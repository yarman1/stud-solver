import React, { FC } from "react";
import { IMathDefReq, IMathIndefReq, IProblemRes, studAPI } from "../services/StudService";
import ProblemForm, { IProblemFormOption } from "./ProblemForm";
import { TInput } from "./ProblemForm";
import {useAppDispatch, useAppSelector} from "../hooks/redux";
import { useNavigate } from "react-router-dom";
import {UserSlice} from "../store/reducers/UserSlice";

interface ProblemInfoProps {
  problem: IProblemRes;
}

interface IProblemOptions {
  "indef-int": IProblemFormOption[];
  "def-int": IProblemFormOption[];
}

const ProblemInfo: FC<ProblemInfoProps> = ({ problem }) => {
  const [math, result] = studAPI.useMathMutation();
  const navigate = useNavigate();
  const { isLogged } = useAppSelector((state) => state.UserReducer);
  const dispatch = useAppDispatch();

  const formOptions: IProblemFormOption[] = JSON.parse(problem.input_schema);

  if (result.isSuccess) {
    dispatch(UserSlice.actions.update_reset(true));
    dispatch(UserSlice.actions.updateBackLink(`/problem/${problem.problem_id}`));
  } else {
    dispatch(UserSlice.actions.update_reset(false));
    dispatch(UserSlice.actions.updateBackLink(`/area/${problem.area_id}`));
  }

  const handleSubmit = (input: TInput) => {
    const type = problem.operation_name;
    const body: IMathDefReq | IMathIndefReq = input as any;

    math({ body, type, isLogged });
  };

  const saveImage = (blob: string) => {
    const link = document.createElement("a");
    link.href = blob;
    link.download = "image.png";
    link.click();
  };

  React.useEffect(() => {
    if (result.isSuccess && typeof result.data !== "string" && result.data.solution_id) {
      navigate(`/history/solution/${result.data.solution_id}`);
    }
    console.log(result);
  }, [result]);

  return (
    <div className="flex flex-col items-center mt-8 p-4">
      <div className="text-2xl mb-8">{problem.name}</div>
      <div className="flex items-center">
        <div className="flex flex-col p-8 w-1/2 border border-1 border-black rounded items-center">
          {result.isSuccess && typeof result.data === "string" ? (
            <div>
              <img src={result.data} />
              <div
                onClick={() => saveImage(result.data as string)}
                className="mx-auto my-4 px-4 py-2 border border-1 border-black w-[4rem] text-center rounded cursor-pointer"
              >
                Save
              </div>
            </div>
          ) : (
            <>
              <div>Formatted:</div>
              <div className="flex mt-4">
                <ProblemForm
                  formOptions={formOptions}
                  handleSubmit={handleSubmit}
                  buttonLabel="Solve"
                />
              </div>
            </>
          )}
        </div>
        <div className="w-1/2 p-4">{problem.description}</div>
      </div>
    </div>
  );
};

export default ProblemInfo;
