import {isEmailRule, isEmptyRule, maxLengthRule, minLengthRule, passwordMatchRule} from "./ValidationRules";
import {createFormFieldConfig} from "./formConfig";

export const registerForm = {
    name: {
        ...createFormFieldConfig("Имя", "name", "text"),
        validationRules: [
            isEmptyRule("Имя"),
            minLengthRule("Имя", 2),
            maxLengthRule("Имя", 25)
        ]
    },
    surname: {
        ...createFormFieldConfig("Фамилия", "surname", "text"),
        validationRules: [
            isEmptyRule("Фамилия"),
            minLengthRule("Фамилия", 3),
            maxLengthRule("Фамилия", 25)
        ]
    },
    login: {
        ...createFormFieldConfig("Логин", "login", "text"),
        validationRules: [
            isEmptyRule("Логин"),
            minLengthRule("Логин", 3),
            maxLengthRule("Логин", 25)
        ]
    },
    email: {
        ...createFormFieldConfig("Электронная почта", "email", "email"),
        validationRules: [
            isEmptyRule("Электр"),
            minLengthRule("email", 3),
            maxLengthRule("email", 40),
            isEmailRule()
        ]
    },
    phoneNumber: {
        ...createFormFieldConfig("Номер телефона", "phoneNumber", "text"),
        validationRules: [
            isEmptyRule("Номер телефона"),
            minLengthRule("Номер телефона", 3),
            maxLengthRule("Номер телефона", 25)
        ]
    },
    password: {
        ...createFormFieldConfig("Пароль", "password", "password"),
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
