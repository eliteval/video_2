import { SAVE_AUTH_INFO, CHANGE_MEMBERSHIP, CHANGE_BALANCE } from "../constants"
var user=localStorage.getItem('user')? JSON.parse(localStorage.getItem('user')):null ;
const initialState = {
    user,
    token: localStorage.getItem('token')
};
const authReducer = (state = initialState, action) => {
    // console.log(action, "action = = = = = = === = = = = === = = = = =")

    switch (action.type) {
        case SAVE_AUTH_INFO:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
            };
        case CHANGE_MEMBERSHIP:
            return {
                ...state,
                user: {
                    ...state.user,
                    membership: action.payload
                }
            };
        case CHANGE_BALANCE:
            return {
                ...state,
                user: {
                    ...state.user,
                    balance: action.payload
                }
            };
        default:
            return state;
    }
}

export default authReducer;