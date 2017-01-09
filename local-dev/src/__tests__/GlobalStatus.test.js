import React from 'react';
import renderer from 'react-test-renderer';

import GlobalStatus from '../components/GlobalStatus';

test('healthy global status', () => {
    const component = renderer.create(
        <GlobalStatus status='healthy'/>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test('warning global status', () => {
    const component = renderer.create(
        <GlobalStatus status='warning'/>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test('failed global status', () => {
    const component = renderer.create(
        <GlobalStatus status='failed'/>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test('pending global status', () => {
    const component = renderer.create(
        <GlobalStatus status='pending'/>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test('sends a desktop notification', () => {
    // tests can't actually send a desktop notification
    GlobalStatus.prototype.sendDesktopNotification = jest.fn(() => true);
    // tests don't like looking for file paths, so we create a predictable stub
    GlobalStatus.prototype.statusToIcon = jest.fn(() => 'stub');

    const component = renderer.create(
        <GlobalStatus
            status='healthy'
            desktopNotify={true}
            notifyMessage={true}
            message='playtime is fun'/>
    );

    expect(GlobalStatus.prototype.sendDesktopNotification).toHaveBeenCalledWith('playtime is fun', 'stub');
});
