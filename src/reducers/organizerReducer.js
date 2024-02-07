import { 
    SET_ORGANIZER,
    SET_ORGANIZER_DISCOUNTS,
    SET_ORGANIZER_NOTIFICATIONS,
    SET_ANALYTICS,
} from "../actions/actionType";


const INITIAL_STATE = {
    organizer: JSON.parse(sessionStorage.getItem('organizer')),
    discounts: JSON.parse(sessionStorage.getItem('organizer-discounts')),
    notifications: JSON.parse(sessionStorage.getItem('organizer-notifications')),
    analytics: JSON.parse(sessionStorage.getItem('organizer-analytics')),
};


const organizerReducer = (state = INITIAL_STATE, action) => {
    switch (action.type){
        case SET_ORGANIZER:
            if (action.organizer===null){
                sessionStorage.removeItem('organizer');
                sessionStorage.removeItem('organizer-discounts');
                sessionStorage.removeItem('organizer-notifications');
                sessionStorage.removeItem('organizer-analytics');
            }
            else {sessionStorage.setItem('organizer', JSON.stringify(action.organizer));}
            return {
                ...state,
                organizer: action.organizer
            };


        case SET_ORGANIZER_DISCOUNTS:
            sessionStorage.setItem('organizer-discounts', JSON.stringify(action.discounts));
            return {
                ...state,
                discounts: action.discounts
            };


        case SET_ORGANIZER_NOTIFICATIONS:
            sessionStorage.setItem('organizer-notifications', JSON.stringify(action.notifications));
            return {
                ...state,
                notifications: action.notifications
            };

        case SET_ANALYTICS:
            sessionStorage.setItem('organizer-analytics', JSON.stringify(action.analytics));
            return {
                ...state,
                analytics: action.analytics
            };

        default:
            return state;
    }
}

export default organizerReducer;
