import React, { FC } from "react";
import { IAreaRes } from "../services/StudService";
import { useNavigate } from "react-router-dom";

interface AreaProps {
  area: IAreaRes;
}

const Area: FC<AreaProps> = ({ area }) => {
  const navigate = useNavigate();
  return (
    <div
      key={area.area_id}
      onClick={() => navigate(`/area/${area.area_id}`)}
      className="w-[15rem] h-[18rem] flex flex-col p-4 border border-1 border-black items-center [&:not(:last-child)]:mr-4 cursor-pointer"
    >
      <img className="w-full aspect-square" src={area.picture_url} />
      <div>{area.name}</div>
    </div>
  );
};

export default Area;
