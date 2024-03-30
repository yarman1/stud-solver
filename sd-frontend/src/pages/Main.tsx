import React, { FC } from "react";
import TopNavbar from "../components/TopNavbar";
import { studAPI } from "../services/StudService";
import Areas from "../components/Areas";
import { useAppSelector } from "../hooks/redux";
import MainUnlogged from "../components/MainUnlogged";

interface MainProps {}

const Main: FC<MainProps> = ({}) => {
  const { isLogged } = useAppSelector((state) => state.UserReducer);
  return (
    <div className="flex flex-col w-full h-full">
      <TopNavbar />
      {!isLogged && <MainUnlogged />}
      <Areas />
    </div>
  );
};

export default Main;
