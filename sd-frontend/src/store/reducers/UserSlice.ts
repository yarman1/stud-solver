import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUser {
  isLogged: boolean;
  access_token: string;
  errorMessage: string;
}

export const initialState: IUser = {
  isLogged: false,
  access_token: "",
  errorMessage: "",
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
    }
  },
});

export default UserSlice.reducer;
