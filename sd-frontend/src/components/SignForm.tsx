import React, { FC } from "react";

export type TInput = { [key: string]: string };

export interface IFormOption {
  key: string;
  placeholder: string;
}

interface SignFormProps {
  formOptions: IFormOption[];
  handleSubmit: (input: TInput) => void;
  buttonLabel: string;
}

const SignForm: FC<SignFormProps> = ({ formOptions, handleSubmit, buttonLabel }) => {
  const [input, setInput] = React.useState<TInput>({});

  const handleChange = (key: string, value: string) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col mb-4">
        {formOptions.map((option, index) => (
          <input
            key={index}
            type="text"
            className="w-full p-4 [&:not(:last-child)]:mb-4 border-1 border-black border rounded"
            placeholder={option.placeholder}
            onChange={(e) => handleChange(option.key, e.target.value)}
          />
        ))}
      </div>
      <div
        className="w-1/3 mx-auto text-center py-3 border-1 border-black border cursor-pointer"
        onClick={() => handleSubmit(input)}
      >
        {buttonLabel}
      </div>
    </div>
  );
};

export default SignForm;
