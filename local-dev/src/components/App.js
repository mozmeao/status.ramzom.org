/*
Component that wraps any child component requiring our Redux data store.
*/

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
import Main from './Main';

// Converts state to an object to be passed as props to Main component.
function mapStateToProps(state) {
    return {
        global: state.global,
        serviceDetail: state.serviceDetail
    };
}

// Allows all action creators (from actions/actionCreators.js) to be called
// directly (instead of through the 'dispatch' method).
function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

// Adds state and action creators as props to Main component.
// This is much more convenient than passing props down many levels.
const App = connect(mapStateToProps, mapDispatchToProps)(Main);

export default App;
