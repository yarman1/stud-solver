import React, { FC } from "react";
import { IAreaRes, IProblemRes } from "../services/StudService";
import { useNavigate } from "react-router-dom";

interface ProblemProps {
  problem: IProblemRes;
}

const Problem: FC<ProblemProps> = ({ problem }) => {
  const navigate = useNavigate();
  return (
    <div
      key={problem.problem_id}
      onClick={() => navigate(`/problem/${problem.problem_id}`)}
      className="w-[15rem] h-[18rem] flex flex-col p-4 border border-1 border-black items-center [&:not(:last-child)]:mr-4 cursor-pointer"
    >
      <img className="w-full aspect-square" src={problem.picture_url} />
      <div>{problem.name}</div>
    </div>
  );
};

export default Problem;
