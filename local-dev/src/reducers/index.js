import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// One reducer for each piece of state
import global from './global';
import serviceDetail from './serviceDetail';

const rootReducer = combineReducers({ global, serviceDetail, routing: routerReducer });

export default rootReducer;
