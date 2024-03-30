import React, { FC } from "react";
import SignForm, { IFormOption, TInput } from "./SignForm";
import { studAPI } from "../services/StudService";
import { useAppDispatch } from "../hooks/redux";
import { UserSlice } from "../store/reducers/UserSlice";

interface SignInProps {
  handleRecovery: () => void;
  handleCreate: () => void;
}

const SignIn: FC<SignInProps> = ({ handleRecovery, handleCreate }) => {
  const [signIn, result] = studAPI.useSignInMutation();
  const dispatch = useAppDispatch();

  const formOptions: IFormOption[] = [
    { key: "email", placeholder: "Email" },
    { key: "password", placeholder: "Password" },
  ];

  const handleSubmit = (input: TInput) => {
    if (!formOptions.map((option) => option.key).every((key) => input[key] !== "")) return;

    signIn({
      email: input.email,
      password: input.password,
    });
    console.log(input);
  };

  React.useEffect(() => {
    console.log(result);
    if (result.isSuccess) {
      localStorage.setItem("token", result.data.access_token);
      dispatch(UserSlice.actions.update_logged(true));
      dispatch(UserSlice.actions.update_token(result.data.access_token));
    }
  }, [result]);

  return (
    <div className="w-full flex-col flex">
      <div className="my-4 mx-auto">Sign in</div>
      <SignForm buttonLabel="Login" handleSubmit={handleSubmit} formOptions={formOptions} />
      <div className="flex mx-auto mt-4">
        <div className="mr-1 cursor-pointer" onClick={handleRecovery}>
          Forget password?
        </div>
        <div className="mr-1">or</div>
        <div className="cursor-pointer" onClick={handleCreate}>
          Create an account
        </div>
      </div>
    </div>
  );
};

export default SignIn;
