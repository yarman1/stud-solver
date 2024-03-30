import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import Recovery from "../components/Recovery";

type TCurrentPage = "signin" | "signup" | "recovery";

interface AuthorizationProps {}

const Authorization: FC<AuthorizationProps> = ({}) => {
  const { type } = useParams<{ type: TCurrentPage }>();
  const navigate = useNavigate();

  return (
    <div className="w-[24rem] h-full flex items-center flex-col justify-center m-auto">
      <div onClick={() => navigate("/")} className="flex flex-col items-center cursor-pointer">
        <img src="/images/main-icon.svg" className="w-[3rem] aspect-square" />
        <div>StudSolver</div>
      </div>
      <div className="w-full">
        {(() => {
          switch (type) {
            case "signin":
              return (
                <SignIn
                  handleRecovery={() => navigate("/auth/recovery")}
                  handleCreate={() => navigate("/auth/signup")}
                />
              );
            case "signup":
              return <SignUp handleHave={() => navigate("/auth/signin")} />;
            case "recovery":
              return <Recovery />;
          }
        })()}
      </div>
    </div>
  );
};

export default Authorization;
