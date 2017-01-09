// What our YAML looks like after being JSON-ified
const newGlobalStatusData = {
    components: {
        'service1': {
            display: true,
            group: 'group1',
            id: 'service1',
            name: 'Service #1',
            status: 'healthy',
            type: 'teststatus'
        },
        'service2': {
            display: true,
            group: 'group1',
            id: 'service2',
            name: 'Service #2',
            status: 'healthy',
            type: 'teststatus'
        }
    },
    globalStatus: {
        message: 'do not give up',
        status: 'healthy'
    }
}

export default newGlobalStatusData;
