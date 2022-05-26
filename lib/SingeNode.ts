import {isEmptyRule, maxLengthRule, minNumRule} from "./ValidationRules";
import {createFormFieldConfig} from "./formConfig";

export const singeNodeForm = {
    frequency: {
        ...createFormFieldConfig("Частота", "frequency", "number"),
        validationRules: [
            isEmptyRule("frequency"),
            minNumRule("frequency", 0)
        ]
    }
};