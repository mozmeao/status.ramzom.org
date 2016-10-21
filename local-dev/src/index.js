import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import store, { history } from './reduxStore';

import App from './components/App';
import StatusBoard from './components/StatusBoard';
import ServiceDetail from './components/ServiceDetail';
import './css/libs/bootstrap.3.3.6.min.css';
import './css/libs/bootstrap-theme.3.3.6.min.css';
import './css/style.css'

ReactDOM.render((
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={StatusBoard}/>
                <Route path="/service/:serviceId" component={ServiceDetail}/>
            </Route>
        </Router>
    </Provider>
), document.getElementById('root'));
