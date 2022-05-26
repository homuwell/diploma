import {isEmptyRule, maxLengthRule, minLengthRule, isEmailRule} from "./ValidationRules";
import {createFormFieldConfig} from "./formConfig";

export const resetPasswordLinkForm = {
    email: {
        ...createFormFieldConfig("Почта", "email", "text"),
        validationRules: [
            isEmptyRule("email"),
            minLengthRule("email", 3),
            maxLengthRule("email", 35),
            isEmailRule()
        ]
    }
};
