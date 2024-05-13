// REGEX CONSTANTS
export const UPPER_CASE_REG_EXP   = /(?=.*?[A-Z])/;
export const LOWER_CASE_REG_EXP   = /(?=.*?[a-z])/;
export const DIGITS_REG_EXP      = /(?=.*?[0-9])/;
export const SPECIAL_CHAR_REG_EXP = /(?=.*?[#?!@$%^&*-])/;
export const EMAIL_REG_EXP       = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const urlRegex = /^(https?|ftp):\/\/(([a-z\d]([a-z\d-]*[a-z\d])?\.)+[a-z]{2,}|localhost)(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;


// CONTACT VALIDATION CONSTANTS
export const PHONE_VALIDATION_API_URL = 'https://phonevalidation.abstractapi.com/v1/'
export const PHONE_VALIDATION_API_KEY = '002f7a9d4a47437b857b0f0429466817';


// "http://localhost:5000";
export const BASE_URL = "http://localhost:5000";
// "https://kofficobbin.pythonanywhere.com";
