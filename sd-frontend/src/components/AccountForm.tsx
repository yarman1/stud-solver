import React, { FC, useState } from "react";

export type TInput = { [key: string]: string };

export interface IFormOption {
    key: string;
    placeholder: string;
}

interface AccountFormProps {
    formOptions: IFormOption[];
    handleSubmit: (input: TInput) => void;
    buttonLabel: string;
}

const AccountForm: FC<AccountFormProps> = ({ formOptions, handleSubmit, buttonLabel }) => {
    const [input, setInput] = useState<TInput>({});
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (key: string, value: string) => {
        setInput((prev) => ({ ...prev, [key]: value }));
    };

    const isPasswordKey = (key: string) => /Password/i.test(key);

    return (
        <div className="flex flex-col mt-4">
            {formOptions.map((option, index) => (
                <div key={index} className="mb-4">
                    <input
                        type={isPasswordKey(option.key) && !showPassword ? "password" : "text"}
                        className="w-full p-4 border-1 border-black border rounded"
                        placeholder={option.placeholder}
                        value={input[option.key] || ''}
                        onChange={(e) => handleChange(option.key, e.target.value)}
                    />
                </div>
            ))}
            {formOptions.some(option => isPasswordKey(option.key)) && (
                <div className="mb-4">
                    <label>
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                        /> Show Password
                    </label>
                </div>
            )}
            <div
                className="w-2/3 max-w-[12rem] mx-auto text-center py-3 px-2 border-1 border-black border cursor-pointer"
                onClick={() => handleSubmit(input)}
            >
                {buttonLabel}
            </div>
        </div>
    );
};

export default AccountForm;
