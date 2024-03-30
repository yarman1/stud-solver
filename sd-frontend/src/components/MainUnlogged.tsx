import React, { FC } from "react";
import { useNavigate } from "react-router-dom";

interface MainUnloggedProps {}

const MainUnlogged: FC<MainUnloggedProps> = ({}) => {
  const navigate = useNavigate();
  const header = "Make learning math easier and more convenient with StudSolver";
  return (
    <div className="flex w-full">
      <img className="ml-auto" src="/images/placeholder.jpg" />
      <div className="flex flex-col mr-auto my-auto">
        <div className="flex flex-wrap justify-center text-2xl">
          {header.split(" ").map((word, index) => (
            <div key={index} className="[&:last-child]:font-bold mr-1">
              {word}
            </div>
          ))}
        </div>
        <div
          className="w-[10rem] text-center py-4 h-fit bg-gray-700 text-white mx-auto mt-4 rounded cursor-pointer"
          onClick={() => navigate("/auth/signup")}
        >
          Sign up
        </div>
      </div>
    </div>
  );
};

export default MainUnlogged;
