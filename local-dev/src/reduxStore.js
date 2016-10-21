import { browserHistory } from 'react-router';
// allows sync between react-router and redux store
import { syncHistoryWithStore } from 'react-router-redux';

import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
// for async reducers
import thunkMiddleware from 'redux-thunk';

import rootReducer from './reducers/index';

const loggerMiddleware = createLogger();

const defaultState = {
    global: {
        desktopNotify: false,
        isUpdating: false,
        lastUpdate: null,
        message: 'Fetching data...',
        notifyMessage: false,
        services: [],
        status: 'pending'
    },
    serviceDetail: {}
}

const store = createStore(
    rootReducer,
    defaultState,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware)
);

export const history = syncHistoryWithStore(browserHistory, store);

// hot reload reducers
if (module.hot) {
    module.hot.accept('./reducers/', () => {
        // cannot import inside a function - must use 'require' instead
        const nextRootReducer = require('./reducers/index').default;
        store.replaceReducer(nextRootReducer);
    });
}

export default store;
