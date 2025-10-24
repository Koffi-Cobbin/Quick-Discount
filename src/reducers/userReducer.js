import { 
    ACTIVATE_USER, 
    SET_USER, 
    SET_USER_TOKEN, 
    SET_USER_ORDER, 
    SET_PAYMENT, 
    SET_USER_NOTIFICATIONS,
    SET_USER_TICKETS,
    SET_USER_IS_FOLLOWER
} from "../actions/actionType";


// safe getter that prefers sessionStorage and falls back to localStorage,
// and only JSON.parse when we actually have a non-null string value.
function getStoredJSON(key) {
    const raw = sessionStorage.getItem(key) ?? localStorage.getItem(key);
    if (raw === null || raw === undefined) return null;
    try {
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

const INITIAL_STATE = {
    user: getStoredJSON('user'),
    activate_user: false,
    token: getStoredJSON('user-token'),
    order: getStoredJSON('user-order'),
    payment: getStoredJSON('payment'),
    tickets: getStoredJSON('user-tickets'),
    notifications: getStoredJSON('user-notifications'),
    is_follower: getStoredJSON('user-is-following'),
};


const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type){
        case SET_USER:
            if (action.user===null){
                sessionStorage.removeItem('user');
                localStorage.removeItem('user')
                sessionStorage.removeItem('user-token');
                localStorage.removeItem('user-token');
                sessionStorage.removeItem('payment');
                sessionStorage.removeItem('user-order');
                sessionStorage.removeItem('user-notifications');
                sessionStorage.removeItem('user-tickets');
                sessionStorage.removeItem('user-is-following');
            }
            else {
                if (action.user.rememberMe){
                    localStorage.setItem('user', JSON.stringify(action.user));
                }
                else{
                    sessionStorage.setItem('user', JSON.stringify(action.user));
                }
            }
            return {
                ...state,
                user: action.user
            };

        case ACTIVATE_USER:
            return {
                ...state,
                activate_user: action.activate
            };

        case SET_USER_TOKEN:
            if (action.user.rememberMe){
                localStorage.setItem('user-token', JSON.stringify(action.token));
            }
            else{
                sessionStorage.setItem('user-token', JSON.stringify(action.token));
            };            
            return {
                ...state,
                token: action.token
            };

        case SET_USER_ORDER:
            sessionStorage.setItem('user-order', JSON.stringify(action.order));
            return {
                ...state,
                order: action.order
            };

        case SET_USER_TICKETS:
            sessionStorage.setItem('user-tickets', JSON.stringify(action.tickets));
            return {
                ...state,
                tickets: action.tickets
            };

        case SET_USER_NOTIFICATIONS:
            sessionStorage.setItem('user-notifications', JSON.stringify(action.notifications));
            return {
                ...state,
                notifications: action.notifications
            };

        case SET_USER_IS_FOLLOWER:
            sessionStorage.setItem('user-is-following', JSON.stringify(action.is_follower));
            return {
                ...state,
                is_follower: action.is_follower
            };

        case SET_PAYMENT:
            sessionStorage.setItem('payment', JSON.stringify(action.payment));
            return {
                ...state,
                payment: action.payment
            };
        default:
            return state;
    }
}

export default userReducer;
