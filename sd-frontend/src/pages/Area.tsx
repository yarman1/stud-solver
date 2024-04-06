import React, { FC } from "react";
import { studAPI } from "../services/StudService";
import { useParams } from "react-router-dom";
import TopNavbar from "../components/TopNavbar";
import AreaInfo from "../components/AreaInfo";
import Problems from "../components/Problems";
import {useAppDispatch} from "../hooks/redux";
import {UserSlice} from "../store/reducers/UserSlice";

interface AreaProps {}

const Area: FC<AreaProps> = ({}) => {
  const { id } = useParams<{ id: string }>();
  const { data: area, isLoading, isSuccess } = studAPI.useGetAreaQuery({ id: id || "" });
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(UserSlice.actions.updateBackLink("/"));
    dispatch(UserSlice.actions.update_reset(false));
  });

  return (
    <div>
      <TopNavbar isBackButton backUrl="/" />
      {isSuccess && <AreaInfo area={area} />}
      {isSuccess && <Problems area_id={`${area.area_id}`} />}
    </div>
  );
};

export default Area;
