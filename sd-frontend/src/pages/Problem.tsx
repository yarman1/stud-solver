import React, { FC } from "react";
import TopNavbar from "../components/TopNavbar";
import { useParams } from "react-router-dom";
import { studAPI } from "../services/StudService";
import ProblemInfo from "../components/ProblemInfo";

interface ProblemProps {}

const Problem: FC<ProblemProps> = ({}) => {
  const { id } = useParams();
  const { data, isSuccess } = studAPI.useGetProblemQuery({ id: id || "" });

  return (
    <div>
      <TopNavbar isBackButton backUrl={`/area/${data?.area_id}`} />
      {isSuccess && <ProblemInfo problem={data} />}
    </div>
  );
};

export default Problem;
