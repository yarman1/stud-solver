import React from "react";
import AppRouter from "./components/Router";
import { useAppDispatch } from "./hooks/redux";
import { UserSlice } from "./store/reducers/UserSlice";

function App() {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    dispatch(UserSlice.actions.update_logged(true));
    dispatch(UserSlice.actions.update_token(token));
  }, [dispatch]);

  return (
    <div className="w-screen h-screen">
      <AppRouter />
    </div>
  );
}

export default App;
