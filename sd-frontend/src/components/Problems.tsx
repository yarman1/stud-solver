import React, { FC } from "react";
import { studAPI } from "../services/StudService";
import Area from "./Area";
import Problem from "./Problem";

interface ProblemsProps {
  area_id: string;
}

const Problems: FC<ProblemsProps> = ({ area_id }) => {
  const { data, isLoading } = studAPI.useGetProblemsQuery({ id: area_id });
  console.log(data);
  return !isLoading ? (
    <div className="m-auto flex flex-col items-center">
      <div className="text-3xl mb-4">Choose the problem:</div>
      <div className="flex flex-row overflow-x-scroll">
        {data?.map((problem) => (
          <Problem problem={problem} />
        ))}
      </div>
    </div>
  ) : null;
};

export default Problems;
