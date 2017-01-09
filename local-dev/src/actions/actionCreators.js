/*
Global functions ("actions") that can be invoked by components. These actions
are consumed by reducers.
*/

import fetch from 'isomorphic-fetch';
import jsyaml from 'js-yaml';

import { buildNewGlobalStatusObject } from '../helpers';

export const REQUEST_GLOBAL_STATUS = 'REQUEST_GLOBAL_STATUS';
// Dispatched from fetchGlobalStatus.
// Nicety to inform app that request to status.yml is in progress.
export function requestGlobalStatus() {
    return {
        type: REQUEST_GLOBAL_STATUS
    }
}

export const RECEIVE_GLOBAL_STATUS = 'RECEIVE_GLOBAL_STATUS';
// Dispatched from async function returned by fetchGlobalStatus.
export function receiveGlobalStatus(newGlobalStatus) {
    return {
        type: RECEIVE_GLOBAL_STATUS,
        data: newGlobalStatus
    }
}

// Returns a function that performs async action, then dispatches another
// action (requires thunk middleware).
export function fetchGlobalStatus(dateStamp = new Date()) {
    return dispatch => {
        // Inform app that we are looking for updates to status.yml.
        dispatch(requestGlobalStatus());

        // Make an AJAX request to status.yml.
        return fetch(process.env.PUBLIC_URL + '/status.yml?date=' + Date.now()).then(response => {
            if (response.ok) {
                response.text().then(text => {
                    // Convert YAML formatted text to JS object.
                    const statusData = jsyaml.load(text);

                    // Build an object of new data to be sent to
                    // receiveGlobalStatus.
                    const newGlobalStatus = buildNewGlobalStatusObject(statusData, dateStamp);

                    // Dispatch receiveGlobalStatus action, passing in new data.
                    dispatch(receiveGlobalStatus(newGlobalStatus));
                });
            } else {
                console.error('status.yml response not ok :(');
            }
        }).catch(err => {
            console.error('fetch error!');
            console.error(err);
        });
    }
}

export const RECEIVE_DESKTOP_NOTIFY = 'RECEIVE_DESKTOP_NOTIFY';
// Receives a JS object from requestDesktopNotify action.
export function receiveDesktopNotify(newDesktopNotify) {
    return {
        type: RECEIVE_DESKTOP_NOTIFY,
        desktopNotify: newDesktopNotify
    }
}

// Returns a function that performs async action, then dispatches another
// action (requires thunk middleware).
export function requestDesktopNotify() {
    return dispatch => {
        // If browser doesn't support notifications, we're done here.
        if (!('Notification' in window)) {
            dispatch(receiveDesktopNotify(false));
        }
        // Check whether notification permissions have already been granted.
        else if (Notification.permission === 'granted') {
            dispatch(receiveDesktopNotify(true));
        }
        // Otherwise, we need to ask the user for permission.
        else if (Notification.permission !== 'denied') {
            return Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    dispatch(receiveDesktopNotify(true));
                } else {
                    dispatch(receiveDesktopNotify(false));
                }
            });
        // Permission was previously denied.
        } else {
            dispatch(receiveDesktopNotify(false));
        }
    }
}

export const CLEAR_DESKTOP_NOTIFY = 'CLEAR_DESKTOP_NOTIFY';
// Dispatched after displaying desktop notification to avoid duplicate notices.
export function clearDesktopNotify() {
    return {
        type: CLEAR_DESKTOP_NOTIFY
    }
}
