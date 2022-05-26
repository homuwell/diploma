import {isEmptyRule, maxLengthRule, minLengthRule} from "./ValidationRules";
import {createFormFieldConfig} from "./formConfig";

export const loginForm = {
    login: {
        ...createFormFieldConfig("Логин", "login", "text"),
        validationRules: [
            isEmptyRule("Логин"),
            minLengthRule("Логин", 3),
            maxLengthRule("Логин", 25)
        ]
    },
    password: {
        ...createFormFieldConfig("Пароль", "password", "password"),
        validationRules: [
            isEmptyRule("password"),
            minLengthRule("password", 8),
            maxLengthRule("password", 20)
        ]
    }
};
