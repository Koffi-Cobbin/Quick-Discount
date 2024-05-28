import axios from "axios";

import {
    DIGITS_REG_EXP,
    EMAIL_REG_EXP,
    LOWER_CASE_REG_EXP,
    PHONE_VALIDATION_API_URL,
    PHONE_VALIDATION_API_KEY,
    SPECIAL_CHAR_REG_EXP,
    UPPER_CASE_REG_EXP
 } from "./constants";

const NUMS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export const isEmailValid = (email) => {
    if (email.length > 0) {
        const validEmail = EMAIL_REG_EXP.test(email); // /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
        if (validEmail) {
            return [true, ""];
        }
        else {
            return [false, "Invalid email address"];
        }
    }
    else {
        return [false, "Invalid email address"];
    }
};

export function isContactValid(phoneNumber) {
    let digits;
    if (phoneNumber.charAt(0) === "+") {
        digits = phoneNumber.slice(1,-1);
    }
    else {
        digits = phoneNumber
    }

    for (let i = 0; i < digits.length; i++) {
        if (NUMS.includes(+digits.charAt(i))) {
            continue;
        }
        else {
            return [false, "Invalid contact"]
        }
    }
    return [true, ""]
};


export async function validatePhoneNumberViaAPI(phoneNumber) {
    try {
        const response = await axios.get(PHONE_VALIDATION_API_URL, {phone: phoneNumber, api_key: PHONE_VALIDATION_API_KEY});
        return response.data.valid
    } 
    catch (error) {
        throw new Error("Caught in validatePhoneNumber: ", error)
    }

    // const handleValidate = async (value) => {
    // const isValid =  await validatePhoneNumberViaApi(value);
    // return isValid
    // }
}


export const isPasswordValid = (passwordInputValue) => {
    const minLengthRegExp   = /.{8,}/;

    const passwordLength       =  passwordInputValue.length;
    const uppercasePassword    =  UPPER_CASE_REG_EXP.test(passwordInputValue);  //  /(?=.*?[A-Z])/
    const lowercasePassword    =  LOWER_CASE_REG_EXP.test(passwordInputValue);  //  /(?=.*?[a-z])/
    const digitsPassword       =  DIGITS_REG_EXP.test(passwordInputValue);      //  /(?=.*?[0-9])/
    const specialCharPassword  =  SPECIAL_CHAR_REG_EXP.test(passwordInputValue); //  /(?=.*?[#?!@$%^&*-])/
    const minLengthPassword    =  minLengthRegExp.test(passwordInputValue);

    let errMsg = "";
    if(passwordLength===0){
            errMsg="Password is empty";
    }else if(!uppercasePassword){
            errMsg="At least one uppercase";
    }else if(!lowercasePassword){
            errMsg="At least one lowercase";
    }else if(!digitsPassword){
            errMsg="At least one digit";
    }else if(!specialCharPassword){
            errMsg="At least one special character";
    }else if(!minLengthPassword){
            errMsg="Minumum of 8 characters";
    }else{
        errMsg="";
    }

    if(errMsg.length === 0){
        return [true, ""];
    }
    else {
        return [false, errMsg];
    }
}


export const confirmPassword= ({passwordInput, setError})=>{
    if(passwordInput.confirmPassword!==passwordInput.password)
    {
        setError("Confirm password is not matched");
        return false;
    }
    else{
        return true;
    }
}

export const handleImageErrors= (errorCode)=>{
    let message = "";
    
    switch (errorCode) {
        case "file-invalid-type":
            message = "Unsupported file format";
            break;
        case "file-too-large":
            message = "File too large";
            break;
        case "file-too-small":
            message = "File too small";
            break;
        case "too-many-files":
            message = "Too many files";
            break;
        default:
            message = "Invalid file";
      };
    return message
}


export function isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

// -----------------------------------
// DATE FORMATTER
// ------------------------------
export function formatDate(inputDate, show_year=true) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const dateParts = inputDate.split('-');
  const year = dateParts[0];
  const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
  const day = parseInt(dateParts[2]);

  const date = new Date(year, month, day);
  
  const abbrWeekday = days[date.getDay()];
  const abbrMonth = months[date.getMonth()];
  const fullYear = date.getFullYear();

  const formattedDate = `${abbrWeekday}, ${abbrMonth} ${day}${ show_year ? ","+fullYear : ''}`;
  return formattedDate;
};


// -----------------------------------
// TIME FORMATTER
// ------------------------------
export function formatTime(inputTime) {
    const timeParts = inputTime.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
  
    let formattedTime = '';
  
    if (hours === 0) {
      formattedTime = `12:${minutes.toString().padStart(2, '0')} am`;
    } else if (hours === 12) {
      formattedTime = `12:${minutes.toString().padStart(2, '0')} pm`;
    } else if (hours > 12) {
      formattedTime = `${(hours - 12).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} pm`;
    } else {
      formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} am`;
    }
  
    return formattedTime;
};  


// write a function to return days past till now given a date in the format "2024-05-22T21:05:31.282889Z"
export function getLastPosted(start) {
    const date1 = new Date(start);

    const currentDateStr = new Date().toISOString(); // Get the current date and time in ISO format
    const date2 = new Date(currentDateStr);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // one hour in milliseconds 
    const oneHour = 1000 * 60 * 60;

    // one minute in milliseconds 
    const oneMinute = 1000 * 60;
    
    // Calculate the difference between the two dates
    const differenceInTime = date2.getTime() - date1.getTime();

    // Calculate the number of days
    const differenceInDays = Math.round(differenceInTime / oneDay);

    // Calculate the number of hours
    const differenceInHours = Math.round(differenceInTime / oneHour);

    // Calculate the number of hours
    const differenceInMinutes = Math.round(differenceInTime / oneMinute);

    if (differenceInDays > 0){
        return `${differenceInDays} ${differenceInDays === 1 ? "day" : "days"} ago`;
    }
    else if (differenceInDays === 0 && differenceInHours > 0){
        return `${differenceInHours} ${differenceInHours === 1 ? "hour" : "hours"} ago`;
    }
    else {
        return `${differenceInMinutes} ${differenceInMinutes === 1 ? "minute" : "minutes"} ago`;
    }
};
