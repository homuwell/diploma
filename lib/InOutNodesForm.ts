import {isEmptyRule, maxLengthRule, maxNumRule, minNumRule} from "./ValidationRules";
import {createFormFieldConfig} from "./formConfig";
export const inOutNodesForm = {
    inNodeM: {
        ...createFormFieldConfig("n-", "inNodeM", "number"),
        validationRules: [
            isEmptyRule("inNodeM"),
            minNumRule("inNodeM", 0),
            maxNumRule("inNodeM", 100)
        ]
    },
    inNodeP: {
        ...createFormFieldConfig("n+", "inNodeP", "number"),
        validationRules: [
            isEmptyRule("inNodeP"),
            minNumRule("inNodeP", 0),
            maxNumRule("inNodeP", 100)
        ]
    },
    outNodeM: {
        ...createFormFieldConfig("k-", "outNodeM", "number"),
        validationRules: [
            isEmptyRule("outNodeM"),
            minNumRule("outNodeM", 0),
            maxNumRule("outNodeM", 100)
        ]
    },
    outNodeP: {
        ...createFormFieldConfig("k+", "outNodeP", "number"),
        validationRules: [
            isEmptyRule("outNodeP"),
            minNumRule("outNodeP", 0),
            maxNumRule("outNodeP", 100)
        ]
    }
};