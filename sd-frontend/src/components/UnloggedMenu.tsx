import React, { FC } from "react";
import { useNavigate } from "react-router-dom";

interface UnloggedMenuProps {}

const UnloggedMenu: FC<UnloggedMenuProps> = ({}) => {
  const navigate = useNavigate();
  return (
    <div className="flex h-fit my-auto">
      <div
        className="w-[10rem] text-center py-4 h-fit bg-gray-700 text-white mr-8 rounded cursor-pointer"
        onClick={() => navigate("/auth/signup")}
      >
        Sign up
      </div>
      <div
        className="w-[10rem] text-center py-4 h-fit border border-1 border-black rounded cursor-pointer"
        onClick={() => navigate("/auth/signin")}
      >
        Login
      </div>
    </div>
  );
};

export default UnloggedMenu;
