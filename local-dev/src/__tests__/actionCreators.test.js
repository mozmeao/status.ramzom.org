import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from '../actions/actionCreators';
import jsyaml from 'js-yaml';

import newGlobalStatusData from '../__mocks__/newGlobalStatusData';

import { buildNewGlobalStatusObject } from '../helpers';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('async actions', () => {
    test('fetchGlobalStatus should dispatch both requestGlobalStatus and receiveGlobalStatus actions', () => {
        // Mock jsYaml.load to just convert string to JSON.
        // (No YAML has been used in this test.)
        jsyaml.load = jest.fn(data => JSON.parse(data));

        // A mock store for receiving/holding the dispatched actions.
        const store = mockStore();

        // Build the new global status we expect to be returned from the async response.
        const expectedGlobalStatusObject = buildNewGlobalStatusObject(newGlobalStatusData, 'current timestamp');

        // These are the actions we expect to be dispatched from fetchGlobalStatus.
        const expectedActions = [
            { type: actions.REQUEST_GLOBAL_STATUS },
            { type: actions.RECEIVE_GLOBAL_STATUS, data: expectedGlobalStatusObject }
        ];

        return store.dispatch(actions.fetchGlobalStatus('current timestamp')).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('requestDesktopNotify should dispatch receiveDesktopNotify', () => {
        test('should return false when Notification API is not available', () => {
            // Make sure Notification API is not available.
            if ('Notification' in window) {
                delete window.Notification;
            }

            const store = mockStore();

            const expectedActions = [{
                type: actions.RECEIVE_DESKTOP_NOTIFY,
                desktopNotify: false
            }];

            store.dispatch(actions.requestDesktopNotify());

            expect(store.getActions()).toEqual(expectedActions);
        });

        test('should return true when permission previously granted', () => {
            window.Notification = {};
            window.Notification.permission = 'granted';

            const store = mockStore();

            const expectedActions = [{
                type: actions.RECEIVE_DESKTOP_NOTIFY,
                desktopNotify: true
            }];

            store.dispatch(actions.requestDesktopNotify());

            expect(store.getActions()).toEqual(expectedActions);
        });

        test('should return false when permission previously denied', () => {
            window.Notification = {};
            window.Notification.permission = 'denied';

            const store = mockStore();

            const expectedActions = [{
                type: actions.RECEIVE_DESKTOP_NOTIFY,
                desktopNotify: false
            }];

            store.dispatch(actions.requestDesktopNotify());

            expect(store.getActions()).toEqual(expectedActions);
        });

        test('should return true when permission has been newly granted', () => {
            window.Notification = {};
            window.Notification.permission = null;
            window.Notification.requestPermission = jest.fn(() => {
                return new Promise((resolve, reject) => {
                    resolve('granted');
                });
            });

            const store = mockStore();

            const expectedActions = [{
                type: actions.RECEIVE_DESKTOP_NOTIFY,
                desktopNotify: true
            }];

            return store.dispatch(actions.requestDesktopNotify()).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });

        test('should return false when permission has been newly denied', () => {
            window.Notification = {};
            window.Notification.permission = null;
            window.Notification.requestPermission = jest.fn(() => {
                return new Promise((resolve, reject) => {
                    resolve('denied');
                });
            });

            const store = mockStore();

            const expectedActions = [{
                type: actions.RECEIVE_DESKTOP_NOTIFY,
                desktopNotify: false
            }];

            return store.dispatch(actions.requestDesktopNotify()).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
    });
});

describe('actions', () => {
    test('requestGlobalStatus should create an action with type REQUEST_GLOBAL_STATUS', () => {
        const expectedAction = {
            type: actions.REQUEST_GLOBAL_STATUS
        };

        expect(actions.requestGlobalStatus()).toEqual(expectedAction);
    });

    test('receiveGlobalStatus should create an action containing type RECEIVE_GLOBAL_STATUS and object of global status data', () => {
        const newGlobalData = {
            global: {
                globalTestData: 'peace'
            },
            routing: {
                routingTestData: 'love'
            },
            serviceDetail: {
                serviceDetailTestData: 'understanding'
            }
        };

        const expectedAction = {
            type: actions.RECEIVE_GLOBAL_STATUS,
            data: newGlobalData
        }

        expect(actions.receiveGlobalStatus(newGlobalData)).toEqual(expectedAction);
    });

    test('receiveDesktopNotify should create an action containing type RECEIVE_DESKTOP_NOTIFY and boolean user response', () => {
        const userResponse = true;

        const expectedAction = {
            type: actions.RECEIVE_DESKTOP_NOTIFY,
            desktopNotify: userResponse
        };

        expect(actions.receiveDesktopNotify(userResponse)).toEqual(expectedAction);
    });

    test('creates an action clearing desktop notification', () => {
        const expectedAction = {
            type: actions.CLEAR_DESKTOP_NOTIFY
        };

        expect(actions.clearDesktopNotify()).toEqual(expectedAction);
    });
});
