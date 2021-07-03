
import {SAVE_AUTH_INFO, CHANGE_MEMBERSHIP, CHANGE_BALANCE} from "../constants"
export function saveAuthInfo(user,token) {
    // console.log("recall", cart)
    if( token== "undefined" || typeof token =="undefined"){
        token = false
    }
    
    return {
        type: SAVE_AUTH_INFO,
        payload: {user,token}
    }
}
export function changeMembership(membership) {
    // console.log("recall", cart)
    if( membership== "undefined" || typeof membership =="undefined"){
        membership = false
    }
    
    return {
        type: CHANGE_MEMBERSHIP,
        payload: membership
    }
}
export function changeBalance(balance) {
    // console.log("recall", cart)
    if( balance== "undefined" || typeof balance =="undefined"){
        balance = false
    }
    
    return {
        type: CHANGE_BALANCE,
        payload: balance
    }
}