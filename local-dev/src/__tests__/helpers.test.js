import * as helpers from '../helpers';
import newGlobalStatusData from '../__mocks__/newGlobalStatusData';

const expectedServices = [
    newGlobalStatusData.components['service1'],
    newGlobalStatusData.components['service2']
];

test('buildServicesArray', () => {
    const services = helpers.buildServicesArray(newGlobalStatusData);

    expect(services).toEqual(expectedServices);
});

test('buildNewGlobalStatusObject', () => {
    const newGlobalStatusObject = helpers.buildNewGlobalStatusObject(newGlobalStatusData, 'current timestamp');

    expect(newGlobalStatusObject).toEqual({
        status: newGlobalStatusData.globalStatus.status,
        message: newGlobalStatusData.globalStatus.message,
        services: expectedServices,
        lastUpdate: 'current timestamp'
    });
});
