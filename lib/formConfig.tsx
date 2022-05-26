import React from "react";
import MyInput from "../components/MyInput";
import {
    isEmptyRule,
    minLengthRule,
    maxLengthRule,
    passwordMatchRule,
    isEmailRule
} from "./ValidationRules";

export function createFormFieldConfig(label :string, name: string, type: string, defaultValue: string | number = "") {
    return {
        renderInput: (handleChange: Function, value: string, isValid : Boolean, error :string, key : number)  => {
            return (
                <MyInput
                    key={key}
            name={name}
            type={type}
            label={label}
            isValid={isValid}
            value={value}
            handleChange={handleChange}
            errorMessage={error}
            />
        );
        },
        label,
        value: defaultValue,
        valid: false,
        errorMessage: "",
        touched: false
    };
}


