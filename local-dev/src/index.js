import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import StatusBoard from './components/StatusBoard';
import ServiceDetail from './components/ServiceDetail';
import './css/libs/bootstrap.3.3.6.min.css';
import './css/libs/bootstrap-theme.3.3.6.min.css';
import './css/style.css'

ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="/" component={StatusBoard}/>
        <Route path="/service/:serviceId" component={ServiceDetail}/>
    </Router>
), document.getElementById('root'));
