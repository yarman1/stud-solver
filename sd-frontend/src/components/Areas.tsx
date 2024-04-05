import React, { FC } from "react";
import { studAPI } from "../services/StudService";
import Area from "./Area";

interface AreasProps {}

const Areas: FC<AreasProps> = ({}) => {
  const { data, isLoading } = studAPI.useGetAreasQuery();
  return !isLoading ? (
    <div className="m-auto flex flex-col items-center">
      <div className="text-3xl mb-4">Choose the area:</div>
      <div className="flex flex-row overflow-x-scroll">
        {data?.map((area) => (
          <Area area={area} />
        ))}
      </div>
    </div>
  ) : null;
};

export default Areas;
