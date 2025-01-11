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


const INITIAL_STATE = {
    user: JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user')),
    activate_user: false,
    token: JSON.parse(sessionStorage.getItem('user-token') || localStorage.getItem('user-token')),
    order: JSON.parse(sessionStorage.getItem('user-order')),
    payment: JSON.parse(sessionStorage.getItem('payment')),
    tickets: JSON.parse(sessionStorage.getItem('user-tickets')),
    notifications: JSON.parse(sessionStorage.getItem('user-notifications')),
    is_follower: JSON.parse(sessionStorage.getItem('user-is-following')),
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
