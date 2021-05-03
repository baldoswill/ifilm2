let errors = {};

export function checkExistince(fieldName, value, valueName) {
    if ((typeof (value) === "undefined" || value === '') && errors[fieldName] === '') {
        errors[fieldName] = `${valueName} is required`;
    }
}


const checkCharacterLength = (fieldName, value, valueName, max, min) => {
    if (typeof (value) === "string" && errors[fieldName] === '') {
        if (value.length > max || value.length < min) {
            errors[fieldName] = `${valueName} should not be greater than ${max} and be lesser than ${min} characters`;
        }
    }

    if (typeof (value) === "number" && errors[fieldName] === '') {
        
        if (value > max || value < min) {
            errors[fieldName] = `${valueName} should not be greater than ${max} and be lesser than ${min}`;
        }
    }
}

const checkIfPatternIsCorrect = (fieldName, value, valueName, pattern) => {
    if(typeof(pattern) !== 'undefined'){        
        let regEx = RegExp(pattern.customPattern, 'gi');
        if (!regEx.test(value) && errors[fieldName] === '') {
            errors[fieldName] = pattern.customMessage !== '' ? pattern.customMessage : `${valueName} is not in the correct format`;
        }
    }   
}

const checkInclusion = (arrValue, valueFilter, errorMessage) => {
    if (!arrValue.includes(valueFilter) && errors[value] === '') {
        let error = errorMessage;
    }
}

const validateFile = (fieldName, value, valueName) => {

    let maxfilesize = 1024 * 1024;

    if (typeof(value) === "undefined" || value.name === '') {
        errors[fieldName] = `${valueName} is required`;
    } else if (value.type !== 'image/jpeg' && value.type !== 'image/jpg' && value.type !== 'image/png' && value.type !== 'image/bmp') {
        errors[fieldName] = `${valueName} file type is not supported. Please upload a (png, bmp, jpg or jpeg)`;
    } else if (value.size > maxfilesize) {
        errors[fieldName] = `${valueName} file size is too large`;
    }
}
 
const checkPasswordMatch = (firstValue, secondValue) => {
    if((typeof(firstValue) !== "undefined" && firstValue['val'] !== '') 
    && (typeof(secondValue) !== "undefined" && secondValue['val'] !== '') && errors['confirmPassword'] === ''){
        if(firstValue['val'] !== secondValue['val']){
            errors['confirmPassword'] = 'Password and Confirm Password doesnt match'
        }
    }
}

export function checkValidity(values) {
    Object.keys(values).forEach(key => {
        errors[key] = "";
        checkExistince(key, values[key]['val'], values[key]['valueName']);
        checkCharacterLength(key, values[key]['val'], values[key]['valueName'], values[key]['max'], values[key]['min'])
        checkIfPatternIsCorrect(key, values[key]['val'], values[key]['valueName'], values[key]['pattern']);

        if (key === 'picture') {
            validateFile(key, values[key]['val'], values[key]['valueName']);
        }
        
    });


    const {password, confirmPassword} = values;

    checkPasswordMatch(password, confirmPassword);
    

    return {errors};
}
