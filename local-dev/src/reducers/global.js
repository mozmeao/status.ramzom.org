/*
Reducers for actions related to globalStatus state data.
*/

import {
    REQUEST_GLOBAL_STATUS,
    RECEIVE_GLOBAL_STATUS,
    RECEIVE_DESKTOP_NOTIFY,
    CLEAR_DESKTOP_NOTIFY } from '../actions/actionCreators';

// This reducer automatically gets a filtered 'state'.
// It gets state.global only (not the full state stored by Redux).
function global(globalState = {}, action) {
    let newGlobalState;

    // All reducers are fired for all actions, so check action type.
    switch (action.type) {
        case REQUEST_GLOBAL_STATUS:
            // Take everything currently in state.global and put in in a new
            // object. Then overwrite that with values provided last - namely
            // changing 'isUpdating' to true.
            newGlobalState = Object.assign({}, globalState, {
                isUpdating: true
            });

            break;
        case RECEIVE_GLOBAL_STATUS:
            // Should we send a desktop notification?
            let notifyMessage = false;

            // If status has changed and old status wasn't 'pending', flag
            // state to send a notification.
            if (action.data.status !== globalState.status && globalState.status !== 'pending') {
                notifyMessage = true;
            }

            newGlobalState = Object.assign({}, globalState, {
                isUpdating: false,
                lastUpdate: action.data.lastUpdate,
                message: action.data.message,
                notifyMessage,
                services: action.data.services,
                status: action.data.status
            });

            break;
        case RECEIVE_DESKTOP_NOTIFY:
            newGlobalState = Object.assign({}, globalState, {
                desktopNotify: action.desktopNotify
            });

            break;
        case CLEAR_DESKTOP_NOTIFY:
            newGlobalState = Object.assign({}, globalState, {
                notifyMessage: false
            });

            break;
        default:
            // If unknown action.type comes in, ignore and keep current state.
            newGlobalState = globalState;
            break;
    }

    return newGlobalState;
}

export default global;
