import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUser {
  isLogged: boolean;
  access_token: string;
  errorMessage: string;
  backLink: string;
  isReset: boolean;
}

export const initialState: IUser = {
  isLogged: false,
  access_token: "",
  errorMessage: "",
  backLink: "",
  isReset: false,
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    update_logged(state, action: PayloadAction<boolean>) {
      state.isLogged = action.payload;
    },
    update_token(state, action: PayloadAction<string>) {
      state.access_token = action.payload;
    },
    updateErrorMessage(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
    },
    updateBackLink(state, action: PayloadAction<string>) {
      state.backLink = action.payload;
    },
    update_reset(state, action: PayloadAction<boolean>) {
      state.isReset = action.payload;
    }
  },
});

export default UserSlice.reducer;
