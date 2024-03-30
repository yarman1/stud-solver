import React, { FC } from "react";
import { IAreaRes } from "../services/StudService";

interface AreaInfoProps {
  area: IAreaRes;
}

const AreaInfo: FC<AreaInfoProps> = ({ area }) => {
  return (
    <div className="flex w-3/4 mx-auto my-8">
      <div className="flex flex-col mr-4 min-w-[20%]">
        <div className="text-xl">{area.name}</div>
        <img className="w-full aspect-square" src={area.picture_url} />
      </div>
      <div>{area.description}</div>
    </div>
  );
};

export default AreaInfo;
