import React, { FC } from "react";
import TopNavbar from "../components/TopNavbar";
import { useParams } from "react-router-dom";
import { studAPI } from "../services/StudService";
import ProblemInfo from "../components/ProblemInfo";
import {useSelector} from "react-redux";
import {RootState} from "../store/store";
import HintBlock from "../components/HintBlock";

interface ProblemProps {}

const Problem: FC<ProblemProps> = ({}) => {
  const { id } = useParams();
  const { data, isSuccess } = studAPI.useGetProblemQuery({ id: id || "" });

  const errorMessage = useSelector((state: RootState) => state.UserReducer.errorMessage);

  return (
    <div>
      <TopNavbar isBackButton backUrl={`/area/${data?.area_id}`} />
      {isSuccess && <ProblemInfo problem={data} />}
      {errorMessage && <HintBlock message={errorMessage} />}
    </div>
  );
};

export default Problem;
