import React, { FC } from "react";
import {useSelector} from "react-redux";
import {RootState} from "../store/store";
import HintBlock from "./HintBlock";

import 'katex/dist/katex.min.css';
import {InlineMath} from "react-katex";
import {parse} from "mathjs";

export type TInput = { [key: string]: string | boolean };

export interface IProblemFormOption {
  key: string;
  type?: "text" | "checkbox";
  placeholder: string;
}

interface ProblemFormProps {
  formOptions: IProblemFormOption[];
  handleSubmit: (input: TInput) => void;
  buttonLabel: string;
}

const ProblemForm: FC<ProblemFormProps> = ({ formOptions, handleSubmit, buttonLabel }) => {
  const [input, setInput] = React.useState<TInput>({});
    const errorMessage = useSelector((state: RootState) => state.UserReducer.errorMessage);

  const handleChange = (key: string, value: string | boolean) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const renderLatex = (expression: string) => {
      try {
          const parsedExpression = parse(expression).toTex();
          return <InlineMath math={parsedExpression} />
      } catch (error) {
          return <span>{expression}</span>;
      }
  };

  return (
    <div className="flex flex-col">
        <div>Formatted: <span id="formatted-expression"> {input.expression ? renderLatex(input.expression as string) : ''}</span></div>
      <div className="flex flex-col mb-4">
        {formOptions.map((option, index) => (
          <div key={index} className="flex [&:not(:last-child)]:mb-4 w-full justify-center items-center">
            {option.type === "checkbox" && (
              <div className="mr-4 my-auto h-12 flex items-center">{option.placeholder}</div>
            )}
            <input
              type={option.type ? option.type : "text"}
              className={`p-4 border-1 border-black border rounded ${
                option.type === "checkbox" ? "h-6 aspect-square" : ""
              }`}
              placeholder={option.placeholder}
              onChange={(e) => handleChange(option.key, option.type === "checkbox" ? e.target.checked : e.target.value)}
            />
          </div>
        ))}
      </div>
      <div
        className="w-1/3 mx-auto text-center py-3 border-1 border-black border cursor-pointer"
        onClick={() => handleSubmit(input)}
      >
        {buttonLabel}
      </div>
        {errorMessage && <HintBlock message={errorMessage} />}
    </div>
  );
};

export default ProblemForm;
