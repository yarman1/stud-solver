import React, { FC } from "react";
import SignForm, { IFormOption, TInput } from "./SignForm";
import { studAPI } from "../services/StudService";
import { useNavigate, useSearchParams } from "react-router-dom";

interface RecoveryProps {}

const Recovery: FC<RecoveryProps> = ({}) => {
  const navigate = useNavigate();

  const [passwordRecovery, resultRecovery] = studAPI.usePasswordRecoveryMutation();
  const [passwordReset, resultReset] = studAPI.useResetPasswordMutation();

  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");

  const formOptionsEmail: IFormOption[] = [{ key: "email", placeholder: "Email" }];
  const formOptionsPassword: IFormOption[] = [
    { key: "password", placeholder: "Enter new password" },
    { key: "repeat_password", placeholder: "Repeat new password" },
  ];

  const handleSubmit = (input: TInput) => {
    if (!formOptionsEmail.map((option) => option.key).every((key) => input[key] !== "")) return;

    passwordRecovery({ email: input.email });
  };

  const handleReset = (input: TInput) => {
    if (!token) return;
    if (!formOptionsPassword.map((option) => option.key).every((key) => input[key] !== "")) return;
    // if (input.password !== input.repeat_password) return;

    passwordReset({ token: token, newPassword: input.password });
  };

  React.useEffect(() => {
    if (resultReset.isSuccess) {
      navigate("/auth/signin");
    }
  }, [resultReset]);

  React.useEffect(() => {
    if (resultRecovery.isSuccess) {
      navigate("/");
    }
  }, [resultRecovery]);

  return (
    <div>
      <div className="text-center my-4">Password recovery</div>
      <SignForm
        formOptions={token ? formOptionsPassword : formOptionsEmail}
        handleSubmit={token ? handleReset : handleSubmit}
        buttonLabel={token ? "Reset password" : "Submit"}
      />
    </div>
  );
};

export default Recovery;
