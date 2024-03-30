import React from "react";
import AppRouter from "./components/Router";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { useNavigate } from "react-router-dom";
import { UserSlice } from "./store/reducers/UserSlice";
import { studAPI } from "./services/StudService";

function App() {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    dispatch(UserSlice.actions.update_logged(true));
    dispatch(UserSlice.actions.update_token(token));
  }, []);

  return (
    <div className="w-screen h-screen">
      <AppRouter />
    </div>
  );
}

export default App;
