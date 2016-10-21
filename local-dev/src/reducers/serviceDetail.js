/*
Reducers for actions related to serviceDetail state data.
*/

function serviceDetail(state = [], action) {
    if (action.type === 'UPDATE_SERVICE_DETAIL') {
        console.log('gonna poll detail for the current service!');
        return state;
    } else {
        return state;
    }
}

export default serviceDetail;
