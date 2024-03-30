import React, { FC } from "react";
import TopNavbar from "../components/TopNavbar";
import { studAPI } from "../services/StudService";
import { IFormOption, TInput } from "../components/SignForm";
import AccountForm from "../components/AccountForm";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux";
import { UserSlice } from "../store/reducers/UserSlice";

const Account = () => {
  const { data, error, isLoading } = studAPI.useGetUserQuery();
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [updateUsername, resultUsername] = studAPI.useUpdateUserMutation();
  const [updatePassword, resultPassword] = studAPI.useUpdatePasswordMutation();
  const [deleteUser, resultDelete] = studAPI.useDeleteUserMutation();

  const [userName, setUserName] = React.useState("");

  const usernameFormOptions: IFormOption[] = [{ key: "userName", placeholder: "New username" }];
  const passwordFormOptions: IFormOption[] = [
    { key: "oldPassword", placeholder: "Old password" },
    { key: "newPassword", placeholder: "New password" },
    { key: "repeatPassword", placeholder: "Repeat new password" },
  ];

  const handleUsername = (input: TInput) => {
    updateUsername({
      userName: input.userName,
    });
  };

  const handlePassword = (input: TInput) => {
    console.log(input);
    if (!passwordFormOptions.map((option) => option.key).every((key) => input[key] !== "")) return;
    if (input.newPassword !== input.repeatPassword) return;

    updatePassword({
      oldPassword: input.oldPassword,
      newPassword: input.newPassword,
    });
  };

  React.useEffect(() => {
    if (isLoading || !data?.userName) return;
    setUserName(data.userName);
    console.log(data);
  }, [data]);

  React.useEffect(() => {
    console.log(resultUsername);
    if (resultUsername.isSuccess && resultUsername.data?.userName) {
      setUserName(resultUsername.data?.userName);
    }
  }, [resultUsername]);

  React.useEffect(() => {
    if (resultUsername.isSuccess && data?.userName) {
      console.log(resultPassword);
    }
  }, [resultPassword]);

  React.useEffect(() => {
    if (resultDelete.isSuccess) {
      localStorage.removeItem("token");
      dispatch(UserSlice.actions.update_logged(false));
      dispatch(UserSlice.actions.update_token(""));
      navigate("/");
    }
  }, [resultDelete]);

  return (
    <div>
      <TopNavbar />
      <div className="w-1/2 flex flex-col mx-auto my-4 items-center">
        <div className="text-3xl mb-4">Account management</div>
        <div className="w-full flex flex-col px-[20%] py-8 border border-1 border-black rounded">
          <div className="flex flex-row">
            <div className="mr-2">Current username:</div>
            <div className="font-bold">{userName}</div>
          </div>
          <AccountForm formOptions={usernameFormOptions} buttonLabel="Change username" handleSubmit={handleUsername} />
          <AccountForm formOptions={passwordFormOptions} buttonLabel="Change password" handleSubmit={handlePassword} />
          <div
            onClick={() => deleteUser()}
            className="w-2/3 max-w-[12rem] mx-auto text-center py-3 px-2 cursor-pointer bg-red-500 text-white rounded mt-4"
          >
            Delete account
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
