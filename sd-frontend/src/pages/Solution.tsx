import React, { FC } from "react";
import TopNavbar from "../components/TopNavbar";
import { studAPI } from "../services/StudService";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useAppDispatch} from "../hooks/redux";
import {UserSlice} from "../store/reducers/UserSlice";

type TFileFormat = "pdf" | "png" | "jpeg";

interface SolutionProps {}

const Solution: FC<SolutionProps> = ({}) => {
  const { id } = useParams();
  const { data, isSuccess } = studAPI.useGetSolutionQuery({ id: id as string });
  const navigate = useNavigate();

  const [getSolutionFile, result] = studAPI.useFileSolutionMutation();
  const [removeFromHistory, resultRemove] = studAPI.useDeleteSolutionMutation();

  console.log(data);
  const handleClick = (format: TFileFormat) => {
    getSolutionFile({
      solutionId: id as string,
      format: format,
    });
  };

  const handleRemove = () => {
    removeFromHistory({
      id: id as string,
    });
  };

  const buttonOptions: TFileFormat[] = ["pdf", "jpeg", "png"];

  React.useEffect(() => {
    if (resultRemove.isSuccess) {
      navigate("/history");
    }
  }, [resultRemove]);

  return (
    <div>
      <TopNavbar isBackButton />
      <div className="flex flex-col w-2/3 max-w-[1280px] mx-auto p-4 border border-2 border-black mt-4 rounded">
        <img src={data} />
        <div className="flex mt-4">
          {buttonOptions.map((option, index) => (
            <div
              key={index}
              className="flex border border-1 border-black px-6 py-3 rounded mx-auto cursor-pointer"
              onClick={() => handleClick(option)}
            >
              <div className="mr-1">Save as</div>
              <div className="uppercase">{option}</div>
            </div>
          ))}
        </div>
        <div
          className="flex border border-1 border-black px-6 py-3 rounded mx-auto cursor-pointer mt-4"
          onClick={handleRemove}
        >
          Remove from history
        </div>
      </div>
    </div>
  );
};

export default Solution;
