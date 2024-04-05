import React, {FC, useState} from "react";
import SignForm, { IFormOption, TInput } from "./SignForm";
import { useAppDispatch } from "../hooks/redux";
import { ISignUpReq, studAPI } from "../services/StudService";
import { useNavigate } from "react-router-dom";
import HintBlock from "./HintBlock";

interface SignUpProps {
  handleHave: () => void;
}

const SignUp: FC<SignUpProps> = ({ handleHave }) => {
  const [signUp, result] = studAPI.useSignUpMutation();
  const navigate = useNavigate();
  const [isPasswordEqualityError, setPasswordEqualityError] = useState(false);

  const formOptions: IFormOption[] = [
    { key: "email", placeholder: "Email" },
    { key: "username", placeholder: "Username" },
    { key: "password", placeholder: "Password" },
    { key: "repeat_password", placeholder: "Repeat password" },
  ];

  const handleSubmit = (input: TInput) => {
    if (!formOptions.map((option) => option.key).every((key) => input[key] !== "")) return;
    if (input.password !== input.repeat_password) {
      setPasswordEqualityError(true);
      return;
    }

    signUp({
      email: input.email,
      password: input.password,
      userName: input.username,
    });
  };

  const handleDismissError = () => {
    setPasswordEqualityError(false);
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
      {isPasswordEqualityError && <HintBlock message={"passwords are not equal"} onDismiss={handleDismissError} />}
    </div>
  );
};

export default SignUp;
