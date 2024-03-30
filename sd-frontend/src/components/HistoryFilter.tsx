import React, { FC } from "react";

interface HistoryFilterProps {
  label: string;
  values: string[];
  handleClick: (value: string) => void;
}

const HistoryFilter: FC<HistoryFilterProps> = ({ label, values, handleClick }) => {
  const [isOpened, setIsOpened] = React.useState(false);
  const [currentValue, setCurrentValue] = React.useState("");

  return (
    <div className="flex flex-row mx-auto">
      <div className="text-xl mr-4">{label}:</div>
      <div className="relative">
        <div
          className="border border-1 border-black w-[12rem] p-1 chevron relative cursor-pointer"
          onClick={() => setIsOpened((prev) => !prev)}
        >
          {currentValue === "" ? "Select" : currentValue}
        </div>
        {isOpened && (
          <div className="absolute w-[150%] bg-white border border-1 border-black mt-2 p-2">
            <div
              onClick={() => (handleClick(""), setIsOpened(false), setCurrentValue(""))}
              className="text-center cursor-pointer [&:not(:first-child)]:mt-2 [&:not(:last-child)]:pb-2 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-b-1 [&:not(:last-child)]:border-black"
            >
              Default
            </div>
            {values.map((value, index) => (
              <div
                className="text-center cursor-pointer [&:not(:first-child)]:mt-2 [&:not(:last-child)]:pb-2 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-b-1 [&:not(:last-child)]:border-black"
                key={index}
                onClick={() => (handleClick(value), setIsOpened(false), setCurrentValue(value))}
              >
                {value}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryFilter;
