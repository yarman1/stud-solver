import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { UserSlice } from "../store/reducers/UserSlice";

export interface ISignUpReq {
  email: string;
  password: string;
  userName: string;
}

export interface IUsernameRes {
  userName: string;
}

export interface IUsernameReq {
  userName: string;
}

interface IMessage {
  message: string;
}

interface IRecoveryReq {
  email: string;
}

interface IResetReq {
  token: string;
  newPassword: string;
}

interface ISignInReq {
  email: string;
  password: string;
}

export type IMathRes = string | { solution_id: string };

export interface IMathReq {
  type: "def-int" | "indef-int";
  body: IMathDefReq | IMathIndefReq;
  isLogged: boolean;
}

export interface IMathIndefReq {
  expression: string;
}

export interface IMathDefReq {
  expression: string;
  lowerLimit: string;
  upperLimit: string;
  isDecimal: boolean;
}

interface ISolutionReq {
  id: string;
}

export interface ISolutionRes {
  solution_id: string;
  problem_name: string;
  area_name: string;
  created_at: string;
  live_to: string;
}

export interface IAreaRes {
  area_id: number;
  name: string;
  operation_name: string;
  picture_url: string;
  description: string;
}

export interface IProblemRes {
  area_id: number;
  problem_id: number;
  name: string;
  operation_name: "def-int" | "indef-int";
  picture_url: string;
  description: string;
  broad_description_url: string;
  input_schema: string;
}

interface ISolutionFileReq {
  format: string;
  solutionId: string;
}

interface IUpdatePasswordReq {
  oldPassword: string;
  newPassword: string;
}

interface ISignInRes {
  access_token: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3567",
  prepareHeaders: (headers, { getState }) => {
    const storageToken = localStorage.getItem("token");
    const token = storageToken;

    // If we have a token set in state, let's assume that we should be passing it.
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
  credentials: "include",
});

const refreshQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3567",
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  api.dispatch(UserSlice.actions.updateErrorMessage(""));
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // try to get a new token
    const refreshResult = await refreshQuery("/auth/refresh", api, extraOptions);
    const token = (refreshResult.data as { access_token: string }).access_token;
    if (token) {
      // store the new token
      console.log(refreshResult.data);
      localStorage.setItem("token", token);
      api.dispatch(UserSlice.actions.update_logged(true));
      api.dispatch(UserSlice.actions.update_token(token));
      // api.dispatch(tokenReceived(refreshResult.data))
      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
      // api.dispatch(loggedOut())
      localStorage.removeItem("token");
      api.dispatch(UserSlice.actions.update_logged(false));
      api.dispatch(UserSlice.actions.update_token(""));
      window.location.href = '/';
    }
  }
  if (result.error) {
    // @ts-ignore
    const errorData = result.error.data as any;
    let errorMessage = '';
    if (errorData.message) {
      if (Array.isArray(errorData.message)) {
        errorMessage = errorData.message.join('\n');
      } else {
        errorMessage = errorData.message;
      }
    } else if(errorData.description) {
      errorMessage = errorData.description;
    }
    api.dispatch(UserSlice.actions.updateErrorMessage(errorMessage));
  }
  return result;
};

export const studAPI = createApi({
  reducerPath: "studAPI",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Solution"],
  endpoints: (build) => ({
    getUser: build.query<IUsernameRes, void>({
      query: () => ({
        url: "/auth/username",
        method: "GET",
      }),
    }),
    getRefresh: build.query<IMessage, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
    }),
    deleteUser: build.mutation<IMessage, void>({
      query: () => ({
        url: "/auth/user",
        method: "DELETE",
      }),
    }),
    passwordRecovery: build.mutation<IMessage, IRecoveryReq>({
      query: (body) => ({
        url: "/auth/recovery",
        method: "POST",
        body,
      }),
    }),
    resetPassword: build.mutation<IMessage, IResetReq>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "PUT",
        body,
      }),
    }),
    updatePassword: build.mutation<string, IUpdatePasswordReq>({
      query: (body) => ({
        url: "/auth/password",
        method: "PUT",
        body,
      }),
    }),
    updateUser: build.mutation<IUsernameRes, IUsernameReq>({
      query: (body) => ({
        url: "/auth/username",
        method: "PUT",
        body,
      }),
    }),
    logOut: build.mutation<IMessage, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    signUp: build.mutation<IMessage, ISignUpReq>({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
    }),
    signIn: build.mutation<ISignInRes, ISignInReq>({
      query: (body) => ({
        url: "/auth/signin",
        method: "POST",
        body,
      }),
    }),
    math: build.mutation<IMathRes, IMathReq>({
      query: (body) => ({
        url: `/math?operationName=${body.type}`,
        method: "POST",
        body: body.body,
        responseHandler: async (res) => {
          if (body.isLogged) {
            return res.json();
          } else {
            const blob = await res.blob();
            let image = window.URL.createObjectURL(blob);
            return image;
          }
        },
      }),
      invalidatesTags: ["Solution"],
    }),
    getSolution: build.query<string, ISolutionReq>({
      query: (body) => ({
        url: `/history/solution/main/${body.id}`,
        method: "GET",
        responseHandler: async (res) => {
          const blob = await res.blob();
          let image = window.URL.createObjectURL(blob);
          return image;
        },
      }),
    }),
    deleteSolution: build.mutation<void, ISolutionReq>({
      query: (body) => ({
        url: `/history/solution/${body.id}`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Solution"],
    }),
    fileSolution: build.mutation<void, ISolutionFileReq>({
      query: (body) => ({
        url: `/history/solution/file?solutionId=${body.solutionId}&format=${body.format}`,
        method: "GET",
        responseHandler: async (res) => {
          const blob = await res.blob();
          let file = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = file;
          link.setAttribute("download", `${body.solutionId}.${body.format}`);
          document.body.appendChild(link);
          link.click();
          return file;
        },
      }),
    }),
    getSolutions: build.query<ISolutionRes[], void>({
      query: () => ({
        url: "/history/solutions",
        method: "GET",
      }),
      providesTags: ["Solution"],
    }),
    reportHistory: build.mutation<void, { solution_id: string[] }>({
      query: (body) => ({
        url: "/history/report",
        method: "POST",
        responseHandler: async (res) => {
          if (res.status == 400) {
            const resJson = await res.json();
            console.log(resJson.message);
            return;
          }
          const blob = await res.blob();
          let file = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = file;
          link.setAttribute("download", `report.pdf`);
          document.body.appendChild(link);
          link.click();
          return;
        },
        body,
      }),
    }),
    getAreas: build.query<IAreaRes[], void>({
      query: () => ({
        url: "/resources/areas",
        method: "GET",
      }),
    }),
    getArea: build.query<IAreaRes, ISolutionReq>({
      query: (body) => ({
        url: `/resources/area/${body.id}`,
        method: "GET",
      }),
    }),
    getProblems: build.query<IProblemRes[], ISolutionReq>({
      query: (body) => ({
        url: `/resources/problems/${body.id}`,
        method: "GET",
      }),
    }),
    getProblem: build.query<IProblemRes, ISolutionReq>({
      query: (body) => ({
        url: `/resources/problem/${body.id}`,
        method: "GET",
      }),
    }),
  }),
});
