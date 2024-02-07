import { 
    SET_PREVIOUS_URL,
    SET_LOADING_STATUS,
    SET_LOADING_MESSAGE, 
    SET_ERRORS,
} from "../actions/actionType";


const INITIAL_STATE = {
    previous_url: JSON.parse(sessionStorage.getItem('previous_url')),
    loading_message: null,
    loading: false,
    errors: null,
};


const appReducer = (state = INITIAL_STATE, action) => {
    switch (action.type){
        case SET_PREVIOUS_URL:
            sessionStorage.setItem('previous_url', JSON.stringify(action.previous_url));
            return {
                ...state,
                previous_url: action.previous_url
            };
        
        case SET_LOADING_STATUS:
            return {
                ...state,
                loading: action.status,
            };
        
        case SET_LOADING_MESSAGE:
            return {
                ...state,
                loading_message: action.loading_message,
            };

        case SET_ERRORS:
            return {
                ...state,
                errors: action.errors,
            };

        default:
            return state;
    }
}

export default appReducer;
