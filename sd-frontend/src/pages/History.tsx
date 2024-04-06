import React, { FC } from "react";
import TopNavbar from "../components/TopNavbar";
import { studAPI } from "../services/StudService";
import HistoryFilter from "../components/HistoryFilter";
import HistoryItem from "../components/HistoryItem";
import {useSelector} from "react-redux";
import {RootState} from "../store/store";
import HintBlock from "../components/HintBlock";
import {useAppDispatch} from "../hooks/redux";
import {UserSlice} from "../store/reducers/UserSlice";

interface HistoryProps {}

const History: FC<HistoryProps> = (_) => {
  const { data, isSuccess } = studAPI.useGetSolutionsQuery();
  const [generateReport, result] = studAPI.useReportHistoryMutation();
  const errorMessage = useSelector((state: RootState) => state.UserReducer.errorMessage);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(UserSlice.actions.updateBackLink('/history'));
    dispatch(UserSlice.actions.update_reset(false));
  });

  const [solutionIDs, setSolutionIDs] = React.useState<string[]>([]);

  const [filter, setFilter] = React.useState({ area_name: "", problem_name: "" });

  const areas = React.useMemo(
    () =>
      isSuccess
        ? data.reduce(
            (prev: string[], solution) =>
              prev.indexOf(solution.area_name) === -1 ? [...prev, solution.area_name] : prev,
            []
          )
        : [],
    [data]
  );
  const problems = React.useMemo(
    () =>
      isSuccess
        ? data.reduce(
            (prev: string[], solution) =>
              prev.indexOf(solution.problem_name) === -1 ? [...prev, solution.problem_name] : prev,
            []
          )
        : [],
    [data]
  );

  const handleCheck = (id: string) => {
    const idIndex = solutionIDs.indexOf(id);
    setSolutionIDs((prev) => (idIndex === -1 ? [...prev, id] : prev.filter((item, index) => index !== idIndex)));
  };

  const handleReport = () => {
    if (solutionIDs.length === 0) return;
    generateReport({ solution_id: solutionIDs });
  };

  return (
    <div>
      <TopNavbar />
      <div className="flex flex-col w-full h-full p-16">
        <div className="mx-auto text-2xl mb-4">History</div>
        {isSuccess && (
          <div className="flex">
            <HistoryFilter
              label="Area"
              values={areas}
              handleClick={(value: string) => setFilter((prev) => ({ ...prev, area_name: value }))}
            />
            <HistoryFilter
              label="Problem"
              values={problems}
              handleClick={(value: string) => setFilter((prev) => ({ ...prev, problem_name: value }))}
            />
          </div>
        )}
        {isSuccess && (
          <>
            <div className="border border-1 border-black rounded mt-4 max-h-[50vh] overflow-y-scroll min-h-[12rem]">
              {data
                .filter(
                  (solution) =>
                    (filter.area_name !== "" ? solution.area_name === filter.area_name : true) &&
                    (filter.problem_name !== "" ? solution.problem_name === filter.problem_name : true)
                )
                .map((solution, index) => (
                  <HistoryItem index={index} solution={solution} handleCheck={handleCheck} />
                ))}
            </div>
          </>
        )}
        <div
          onClick={handleReport}
          className="border border-1 border-black px-4 py-2 mx-auto mt-4 rounded cursor-pointer"
        >
          Generate report
        </div>
      </div>
      {errorMessage && <HintBlock message={errorMessage} />}
    </div>
  );
};

export default History;
