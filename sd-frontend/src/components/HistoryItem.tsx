import React, { FC } from "react";
import { ISolutionRes } from "../services/StudService";
import { useNavigate } from "react-router-dom";

interface HistoryItemProps {
  index: number;
  solution: ISolutionRes;
  handleCheck: (id: string) => void;
}

const HistoryItem: FC<HistoryItemProps> = ({ solution, index, handleCheck }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row h-[5rem] p-2 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-1 [&:not(:last-child)]:border-black [&>div]:flex [&>div]:items-center [&>div]:mx-auto [&>div>*:first-child]:mr-1">
      <input className="w-6" type="checkbox" onClick={() => handleCheck(solution.solution_id)} />
      <div>
        <div>№</div>
        <div>{index + 1}</div>
      </div>
      <div>
        <div>Problem name:</div>
        <div>{solution.problem_name}</div>
      </div>
      <div>
        <div>Creation:</div>
        <div>{solution.created_at}</div>
      </div>
      <div>
        <div>Live to:</div>
        <div>{solution.live_to}</div>
      </div>
      <img
        src="/images/three-dots-menu.svg"
        className="cursor-pointer"
        onClick={() => navigate(`/history/solution/${solution.solution_id}`)}
      />
    </div>
  );
};

export default HistoryItem;
