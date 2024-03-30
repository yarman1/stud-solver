import React, { FC } from "react";
import { studAPI } from "../services/StudService";
import { useParams } from "react-router-dom";
import TopNavbar from "../components/TopNavbar";
import AreaInfo from "../components/AreaInfo";
import Problems from "../components/Problems";

interface AreaProps {}

const Area: FC<AreaProps> = ({}) => {
  const { id } = useParams<{ id: string }>();
  const { data: area, isLoading, isSuccess } = studAPI.useGetAreaQuery({ id: id || "" });

  React.useEffect(() => {
    console.log(area);
  }, [area]);

  return (
    <div>
      <TopNavbar isBackButton backUrl="/" />
      {isSuccess && <AreaInfo area={area} />}
      {isSuccess && <Problems area_id={`${area.area_id}`} />}
    </div>
  );
};

export default Area;
