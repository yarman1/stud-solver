import React, { FC } from "react";
import { useAppSelector } from "../hooks/redux";
import Menu from "./Menu";
import UnloggedMenu from "./UnloggedMenu";
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../store/store";

interface TopNavbarProps {
  isBackButton?: boolean;
  backUrl?: string;
}

const TopNavbar: FC<TopNavbarProps> = ({ isBackButton, backUrl }) => {
  const { isLogged } = useAppSelector((state) => state.UserReducer);
  const navigate = useNavigate();

  const backLink = useSelector((state: RootState) => state.UserReducer.backLink);
  const isReset = useSelector((state: RootState) => state.UserReducer.isReset);

  const backClickHandler = () => {
    if (!isReset) {
      navigate(backLink);
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex p-4 border-b border-1 border-black z-10">
      <div className="flex items-center mr-auto cursor-pointer" onClick={() => navigate("/")}>
        <img className="h-16" src="/images/main-icon.svg" />
        <div>StudSolver</div>
      </div>
      {isBackButton && backLink && (
        <div
          className="mr-8 h-fit px-12 py-3 border border-1 border-black rounded my-auto cursor-pointer"
          onClick={backClickHandler}
        >
          Back
        </div>
      )}
      {isLogged ? <Menu /> : <UnloggedMenu />}
    </div>
  );
};

export default TopNavbar;
