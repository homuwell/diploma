import {useState, useEffect, ChangeEvent} from 'react'

type Return = {
    value : string|number,
    onChange: Function,
    onBlur: Function
}
const useValidation= (value : string, validationHandlers: Array<Object>) : object  => {
    const [errors, setErrors] = useState('');
    const [passNums,setPassNums] = useState(false);
    const [passCapLetters,setPassCapLetters] = useState(false);
    useEffect(() => {

    }, [value])


    return {
        errors
    }
}

export default useValidation