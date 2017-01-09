import newGlobalStatusData from './newGlobalStatusData';

export default function fetch(url, options) {
    return new Promise((resolve, reject) => {
        if (url.indexOf('status.yml') > -1) {
            resolve({
                ok: true,
                status: 200,
                statusText: 'OK',
                text: function () {
                    return new Promise((resolve, reject) => {
                        // we're mocking jsyaml in actionCreators.test.js,
                        // so we can just pass back JSON here
                        resolve(JSON.stringify(newGlobalStatusData));
                    });
                }
            });
        } else {
            // generic handler - not used at the moment
            resolve({
                ok: true,
                status: 200,
                statusText: 'OK'
            });
        }
    });
}
