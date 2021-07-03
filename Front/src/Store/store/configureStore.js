import { createStore, combineReducers } from 'redux';
import authReducer from '../reducers/reducers';
const rootReducer = combineReducers(
    { 
        auth: authReducer    }
);

const configureStore = () => {
    return createStore(rootReducer);
}

export default configureStore;