import {useState, useCallback, ChangeEvent} from "react";

const useForm = (formObj: Object) => {
    const [form, setForm] = useState<any>(formObj);
    const isInputFieldValid = useCallback( (inputField :any) => {

        for (const rule of inputField.validationRules) {
            if (!rule.validate(inputField.value, form)) {
                inputField.errorMessage = rule.message;
                return false;
            }
        }
        return true;
    }, [form]);

    const onInputChange = useCallback((event:any) => {

        const {name, value} = event.target;

        const inputObj = {...form[name]};

        inputObj.value = value;
        const isValidInput = isInputFieldValid(inputObj);

        if (isValidInput && !inputObj.valid) {
            inputObj.valid = true;
        } else if (!isValidInput && inputObj.valid) {
            inputObj.valid = false;
        }
        inputObj.touched = true;
        setForm({...form, [name]: inputObj});


     },[form, isInputFieldValid])
    const renderFormInputs = () => {
        return Object.values(form).map( (inputObj :any) => {
            const {value, label, errorMessage, valid, renderInput} = inputObj;
            return renderInput(onInputChange, value, valid, errorMessage, label)
        });
    }

    const isFormValid = useCallback( () => {
        let isValid = true;
        const arr :any = Object.values(form);

        for (let i = 0; i < arr.length; i++) {
            if (!arr[i].valid) {
                isValid = false;
                break
            }
        }
        return isValid;
    }, [form])

    return [form, renderFormInputs, isFormValid]
}
export default useForm
