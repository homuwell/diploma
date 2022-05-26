import {isEmptyRule, maxLengthRule, minNumRule} from "./ValidationRules";
import {createFormFieldConfig} from "./formConfig";

export const logarithmicTypeForm = {
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
    ratio: {
        ...createFormFieldConfig("Отношение", "ratio", "number"),
        validationRules: [
            isEmptyRule("ratio"),
            minNumRule("ratio", 0)
        ]
    },

};