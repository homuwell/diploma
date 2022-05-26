import {isEmptyRule, maxLengthRule, minNumRule} from "./ValidationRules";
import {createFormFieldConfig} from "./formConfig";

export const linearTypeForm = {
    minFrequency: {
        ...createFormFieldConfig("Минимальное значение частоты", "minFrequency", "number"),
        validationRules: [
            isEmptyRule("minFrequency"),
            minNumRule("minFrequency", 0)
        ]
    },
    maxFrequency: {
        ...createFormFieldConfig("Максимальное значение частоты", "maxFrequency", "number"),
        validationRules: [
            isEmptyRule("maxFrequency"),
            minNumRule("maxFrequency", 0)
        ]
    },
    step: {
        ...createFormFieldConfig("Шаг", "step", "number"),
        validationRules: [
            isEmptyRule("step"),
            minNumRule("step", 0)
        ]
    },

};