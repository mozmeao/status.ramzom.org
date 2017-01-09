import global from '../../reducers/global';

import {
    REQUEST_GLOBAL_STATUS,
    RECEIVE_GLOBAL_STATUS,
    RECEIVE_DESKTOP_NOTIFY,
    CLEAR_DESKTOP_NOTIFY } from '../../actions/actionCreators';

const initialStatus = {
    desktopNotify: false,
    isUpdating: true,
    lastUpdate: 'old date',
    message: '',
    notifyMessage: false,
    services: [],
    status: 'pending'
};

const existingStatus = {
    desktopNotify: true,
    isUpdating: true,
    lastUpdate: 'old date',
    message: 'old message',
    notifyMessage: false,
    services: ['a', 'b'],
    status: 'healthy'
};

describe('global reducer', () => {
    test('it should handle REQUEST_GLOBAL_STATUS', () => {
        expect(global({}, { type: REQUEST_GLOBAL_STATUS })).toEqual({
            isUpdating: true
        });
    });

    describe('RECEIVE_GLOBAL_STATUS', () => {
        test('it should handle first status update (from pending status)', () => {
            const newData = {
                lastUpdate: 'new date',
                message: 'new message',
                services: ['a', 'b'],
                status: 'healthy'
            }

            const newStatus = {
                desktopNotify: false,
                isUpdating: false,
                lastUpdate: 'new date',
                message: 'new message',
                notifyMessage: false,
                services: ['a', 'b'],
                status: 'healthy'
            }

            expect(global(initialStatus, {
                type: RECEIVE_GLOBAL_STATUS,
                data: newData
            })).toEqual(newStatus);
        });

        test('it should handle later status update with same status code', () => {
            const newData = {
                lastUpdate: 'new date',
                message: 'new message',
                services: ['a', 'b', 'c'],
                status: 'healthy'
            }

            const newStatus = {
                desktopNotify: true,
                isUpdating: false,
                lastUpdate: 'new date',
                message: 'new message',
                notifyMessage: false,
                services: ['a', 'b', 'c'],
                status: 'healthy'
            }

            expect(global(existingStatus, {
                type: RECEIVE_GLOBAL_STATUS,
                data: newData
            })).toEqual(newStatus);
        });

        test('it should handle later status update with different status code', () => {
            const newData = {
                lastUpdate: 'new date',
                message: 'warning message',
                services: ['c', 'b', 'd'],
                status: 'warning'
            };

            const newStatus = {
                desktopNotify: true,
                isUpdating: false,
                lastUpdate: 'new date',
                message: 'warning message',
                notifyMessage: true, // true because status changed
                services: ['c', 'b', 'd'],
                status: 'warning'
            };

            expect(global(existingStatus, {
                type: RECEIVE_GLOBAL_STATUS,
                data: newData
            })).toEqual(newStatus);
        });
    });

    test('it should handle RECEIVE_DESKTOP_NOTIFY', () => {
        expect(global({ desktopNotify: false }, { type: RECEIVE_DESKTOP_NOTIFY, desktopNotify: true })).toEqual({
            desktopNotify: true
        });
    });

    test('it should handle CLEAR_DESKTOP_NOTIFY', () => {
        expect(global({ notifyMessage: true }, { type: CLEAR_DESKTOP_NOTIFY })).toEqual({
            notifyMessage: false
        });
    });
});
