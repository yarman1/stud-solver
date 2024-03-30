import React, { FC } from "react";
import { studAPI } from "../services/StudService";
import { useAppDispatch } from "../hooks/redux";
import { UserSlice } from "../store/reducers/UserSlice";
import { useNavigate } from "react-router-dom";

interface MenuProps {}

const Menu: FC<MenuProps> = ({}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isOpened, setIsOpened] = React.useState(false);
  const [signOut, result] = studAPI.useLogOutMutation();

  const handleSignOut = () => {
    signOut();
    localStorage.removeItem("token");
    dispatch(UserSlice.actions.update_logged(false));
    dispatch(UserSlice.actions.update_token(""));
  };

  return (
    <div className="relative flex">
      <img
        onClick={() => setIsOpened((prev) => !prev)}
        className="h-12 my-auto cursor-pointer"
        src="/images/menu.svg"
      />
      {isOpened && (
        <div className="z-10 menu-triangle absolute w-[16rem] right-0 top-full flex flex-col [&>*]:bg-white [&>*]:cursor-pointer [&>*]:py-2 [&>*]:border [&>*]:border-1 [&>*]:border-black [&>*]:w-full [&>*]:text-center border-1 border border-black items-center rounded">
          <div onClick={() => navigate("/")}>Main page</div>
          <div onClick={() => navigate("/history")}>History</div>
          <div onClick={() => navigate("/account")}>Account</div>
          <div className="text-red-500 font-bold" onClick={handleSignOut}>
            Sign Out
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
