import {isEmptyRule, maxLengthRule, minLengthRule, isEmailRule, passwordMatchRule} from "./ValidationRules";
import {createFormFieldConfig} from "./formConfig";

export const resetPasswordForm = {
    password: {
        ...createFormFieldConfig("Новый пароль", "password", "password"),
        validationRules: [
            isEmptyRule("password"),
            minLengthRule("password", 8),
            maxLengthRule("password", 20)
        ]
    },
    confirmPassword: {
        ...createFormFieldConfig("Повторите пароль", "confirmPassword", "password"),
        validationRules: [passwordMatchRule()]
    }
};
