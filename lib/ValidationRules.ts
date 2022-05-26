

const createValidationRule = (ruleName : string, errorMessage :string,  validationFunc: Function) => {
 return {
     name: ruleName,
     message: errorMessage,
     validate: validationFunc
 }
};

export function isEmptyRule (inputName: string) {
    return createValidationRule(
        "isEmpty",
        `${inputName} не может быть пустым`,
        (inputValue: string, formObj : Object) => inputValue.length !==0
    );
}

export function minLengthRule(inputName: string, minCharacters: number) {
    return createValidationRule(
        "minLength",
        `${inputName} должен содержать как минимум ${minCharacters} символов`,
        (inputValue :string, formObj: string) => inputValue.length >= minCharacters
    );
}


export function minNumRule(inputName: string, minNum: number) {
    return createValidationRule(
        "minNumLength",
        `${inputName} не может быть меньше ${minNum}`,
        (inputValue :string, formObj: string) => +inputValue >= minNum
    );
}

export function maxNumRule(inputName: string, maxNum: number) {
    return createValidationRule(
        "maxNumLength",
        `${inputName} не может быть больше ${maxNum}`,
        (inputValue :string, formObj: string) => +inputValue <= maxNum
    );
}


export function maxLengthRule(inputName :string, maxCharacters :number) {
    return createValidationRule(
        "maxLength",
        `${inputName} не может содержать больше чем ${maxCharacters} символов`,
        (inputValue :string, formObj :Object) => inputValue.length <= maxCharacters
    );
}

export function passwordMatchRule() {
    return createValidationRule(
        "passwordMatch",
        `Пароли не совпадают`,
        (inputValue: string, formObj: any) => inputValue === formObj.password.value
    );
}

export function isEmailRule() {
    return createValidationRule(
        "isEmail",
        `Не является почтовым адресом`,
        (inputValue: string, formObj: any) => {
           return  inputValue.match(  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        }
    );
}
