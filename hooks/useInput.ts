import {useState, useEffect, ChangeEvent} from 'react'

type Return = {
    value : string|number,
    onChange: Function,
    onBlur: Function
}
const useInput = (initialValue : string|number, validationHandlers: object) : Return  => {
    const [value, setValue] = useState(initialValue);
    const [isTouched, setTouched] = useState(false);
    const [errors, setErrors] = useState('');

    const onChange = (e: ChangeEvent<HTMLInputElement>) : void => {
        setValue(e.target.value);
    }
    const onBlur = () : void => {
        setTouched(true);
    }

    return {
        value,
        onChange,
        onBlur
    }
}

export default useInput