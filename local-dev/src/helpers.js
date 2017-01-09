export function buildServicesArray(jsonData) {
    const servicesArray = Object.keys(jsonData.components).map(key => {
        return jsonData.components[key];
    });

    return servicesArray;
}

export function buildNewGlobalStatusObject(jsonData, dateStamp = new Date()) {
    const newGlobalStatusObject = {
        status: jsonData.globalStatus.status,
        message: jsonData.globalStatus.message,
        services: buildServicesArray(jsonData),
        lastUpdate: dateStamp
    };

    return newGlobalStatusObject;
}
