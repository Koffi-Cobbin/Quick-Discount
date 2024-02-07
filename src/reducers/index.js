import { combineReducers } from "redux";
import userReducer from "./userReducer";
import discountReducer from "./discountReducer";
import appReducer from "./appReducer";
import organizerReducer from "./organizerReducer";


const rootReducer = combineReducers({
    appState: appReducer,
    userState: userReducer,
    discountState: discountReducer,
    organizerState: organizerReducer,
});

export default rootReducer;
