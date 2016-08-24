import React, { Component } from 'react';

import Header from './Header';

class ServiceDetail extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="service-detail">
                <Header />
                And then some service detail stuff down here...
            </div>
        );
    }
}

export default ServiceDetail;
