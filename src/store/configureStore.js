import { createStore, combineReducers } from 'redux';
import {railwayReducer} from '../reducers/railway.reducer';

export default () => {
    const store = createStore(combineReducers({
        'railway': railwayReducer
    }));
    return store;
}
