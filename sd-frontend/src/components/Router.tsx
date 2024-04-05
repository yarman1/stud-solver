import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Authorization from "../pages/Authorization";
import History from "../pages/History";
import Solution from "../pages/Solution";
import Main from "../pages/Main";
import { useAppSelector } from "../hooks/redux";
import React from "react";
import Account from "../pages/Account";
import Area from "../pages/Area";
import Problem from "../pages/Problem";

const AppRouter = () => {
  const { isLogged } = useAppSelector((state) => state.UserReducer);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        {!isLogged && <Route path="/auth/:type" element={<Authorization />} />}
        <Route path="/account" element={<Account />} />
        <Route path="/area/:id" element={<Area />} />
        <Route path="/problem/:id" element={<Problem />} />
        <Route path="/history" element={<History />} />
        <Route path="/history/solution/:id" element={<Solution />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
