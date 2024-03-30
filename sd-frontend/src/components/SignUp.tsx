import React, { FC } from "react";
import SignForm, { IFormOption, TInput } from "./SignForm";
import { useAppDispatch } from "../hooks/redux";
import { ISignUpReq, studAPI } from "../services/StudService";
import { useNavigate } from "react-router-dom";

interface SignUpProps {
  handleHave: () => void;
}

const SignUp: FC<SignUpProps> = ({ handleHave }) => {
  const [signUp, result] = studAPI.useSignUpMutation();
  const navigate = useNavigate();

  const formOptions: IFormOption[] = [
    { key: "email", placeholder: "Email" },
    { key: "username", placeholder: "Username" },
    { key: "password", placeholder: "Password" },
    { key: "repeat_password", placeholder: "Repeat password" },
  ];

  const handleSubmit = (input: TInput) => {
    if (!formOptions.map((option) => option.key).every((key) => input[key] !== "")) return;
    if (input.password !== input.repeat_password) return;

    signUp({
      email: input.email,
      password: input.password,
      userName: input.username,
    });
    console.log(input);
  };

  React.useEffect(() => {
    if (result.isSuccess) {
      navigate("/auth/signin");
    }
  }, [result]);

  return (
    <div className="w-full flex-col flex">
      <SignForm buttonLabel="Submit" handleSubmit={handleSubmit} formOptions={formOptions} />
      <div onClick={handleHave} className="flex mx-auto mt-4 cursor-pointer">
        Already have an account? Login
      </div>
    </div>
  );
};

export default SignUp;
