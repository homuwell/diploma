import {
    isEmailRule,
    isEmptyRule,
    maxLengthRule,
    maxNumRule,
    minLengthRule,
    minNumRule,
    passwordMatchRule
} from "./ValidationRules";
import {createFormFieldConfig} from "./formConfig";

export const schemaGeneralForm = {
    name: {
        ...createFormFieldConfig("Название схемы", "name", "text"),
        validationRules: [
            isEmptyRule("name"),
            minLengthRule("name",3),
            maxLengthRule("name", 20)
        ]
    },
    nodesNum: {
        ...createFormFieldConfig("число узлов", "nodesNum", "number"),
        validationRules: [
            isEmptyRule("nodesNum"),
            minNumRule("nodesNum", 2),
            maxNumRule("nodesNum", 100)
        ]
    },
    resistorsNum: {
        ...createFormFieldConfig("число резисторов", "resistorsNum", "number"),
        validationRules: [
            isEmptyRule("resistorsNum"),
            minNumRule("resistorsNum", 0),
            maxNumRule("resistorsNum", 50)
        ]
    },
    CapacitorNum: {
        ...createFormFieldConfig("число конденсаторов", "CapacitorNum", "number"),
        validationRules: [
            isEmptyRule("CapacitorNum"),
            minNumRule("CapacitorNum", 0),
            maxNumRule("CapacitorNum", 50)
        ]
    },
    InductorNum: {
        ...createFormFieldConfig("число катушек", "InductorNum", "number"),
        validationRules: [
            isEmptyRule("InductorNum"),
            minNumRule("InductorNum", 0),
            maxNumRule("InductorNum", 50)
        ]
    },
    VCCSNum: {
        ...createFormFieldConfig("число источников тока, управляемых напряжением (ИТУН)", "VCCSNum", "number"),
        validationRules: [
            isEmptyRule("VCCSNum"),
            minNumRule("VCCSNum", 0),
            maxNumRule("VCCSNum", 20)
        ]
    },
    VCCSFreqDependentNum: {
        ...createFormFieldConfig("число частно-зависимых источников тока, управляемых напряжением (ИТУН)", "VCCSFreqDependentNum", "number"),
        validationRules: [
            isEmptyRule("VCCSFreqDependentNum"),
            minNumRule("VCCSFreqDependentNum", 0),
            maxNumRule("VCCSFreqDependentNum", 20)
        ]
    },
    VCVSNum: {
        ...createFormFieldConfig("число источников напряжения, управляемых напряжением (ИНУН)", "VCVSNum", "number"),
        validationRules: [
            isEmptyRule("VCVSNum"),
            minNumRule("VCVSNum", 0),
            maxNumRule("VCVSNum", 20)
        ]
    },
    VCVSFreqDependentNum: {
        ...createFormFieldConfig("число частно-зависимых источников напряжения, управляемых напряжением (ИНУН)", "VCVSFreqDependentNum", "number"),
        validationRules: [
            isEmptyRule("VCVSFreqDependentNum"),
            minNumRule("VCVSFreqDependentNum", 0),
            maxNumRule("VCVSFreqDependentNum", 20)
        ]
    },
    CCCSNum: {
        ...createFormFieldConfig("число источников тока, управляемых током (ИТУТ)", "CCCSNum", "number"),
        validationRules: [
            isEmptyRule("CCCSNum"),
            minNumRule("CCCSNum", 0),
            maxNumRule("CCCSNum", 20)
        ]
    },
    CCCSFreqDependentNum: {
        ...createFormFieldConfig("число частно-зависимых источников тока, управляемых током (ИТУТ)", "CCCSFreqDependentNum", "number"),
        validationRules: [
            isEmptyRule("CCCSFreqDependentNum"),
            minNumRule("CCCSFreqDependentNum", 0),
            maxNumRule("CCCSFreqDependentNum", 20)
        ]
    },
    CCVSNum: {
        ...createFormFieldConfig("число источников напряжения, управляемых током (ИНУТ)", "CCVSNum", "number"),
        validationRules: [
            isEmptyRule("CCVSNum"),
            minNumRule("CCVSNum", 0),
            maxNumRule("CCVSNum", 20)
        ]
    },
    CCVSFreqDependentNum: {
        ...createFormFieldConfig("число частно-зависимых источников напряжения, управляемых током (ИНУТ)", "CCVSFreqDependentNum", "number"),
        validationRules: [
            isEmptyRule("CCVSFreqDependentNum"),
            minNumRule("CCVSFreqDependentNum", 0),
            maxNumRule("CCVSFreqDependentNum", 20)
        ]
    },
    TransformersNum: {
        ...createFormFieldConfig("число трансформаторов", "TransformersNum", "number"),
        validationRules: [
            isEmptyRule("TransformersNum"),
            minNumRule("TransformersNum", 0),
            maxNumRule("TransformersNum", 20)
        ]
    },
    IdealTransformersNum: {
        ...createFormFieldConfig("число идеальных трансформаторов", "IdealTransformersNum", "number"),
        validationRules: [
            isEmptyRule("IdealTransformersNum"),
            minNumRule("IdealTransformersNum", 0),
            maxNumRule("IdealTransformersNum", 20)
        ]
    },
    OperationAmplifiersNum: {
        ...createFormFieldConfig("число операционных усилителей", "OperationAmplifiersNum", "number"),
        validationRules: [
            isEmptyRule("OperationAmplifiersNum"),
            minNumRule("OperationAmplifiersNum", 0),
            maxNumRule("OperationAmplifiersNum", 20)
        ]
    },
    IdealOperationAmplifiersNum: {
        ...createFormFieldConfig("число идеальных операционных усилителей", "IdealOperationAmplifiersNum", "number"),
        validationRules: [
            isEmptyRule("IdealOperationAmplifiersNum"),
            minNumRule("IdealOperationAmplifiersNum", 0),
            maxNumRule("IdealOperationAmplifiersNum", 20)
        ]
    },
    BipolarTransistorsNum: {
        ...createFormFieldConfig("число биполярных транзисторов", "BipolarTransistorsNum", "number"),
        validationRules: [
            isEmptyRule("BipolarTransistorsNum"),
            minNumRule("BipolarTransistorsNum", 0),
            maxNumRule("BipolarTransistorsNum", 20)
        ]
    },
    UnipolarTransistorsNum: {
        ...createFormFieldConfig("число униполярных транзисторов", "UnipolarTransistorsNum", "number"),
        validationRules: [
            isEmptyRule("UnipolarTransistorsNum"),
            minNumRule("UnipolarTransistorsNum", 0),
            maxNumRule("UnipolarTransistorsNum", 20)
        ]
    }
};
