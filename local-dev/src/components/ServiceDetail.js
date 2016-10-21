/*
Displays details about a given service. (Coming soon...)
*/

import React, { Component } from 'react';

import Header from './Header';
import GlobalStatus from './GlobalStatus';

class ServiceDetail extends Component {
    render() {
        return (
            <div id="service-detail">
                <GlobalStatus
                    desktopNotify={this.props.global.desktopNotify}
                    message={this.props.global.message}
                    notifyMessage={this.props.global.notifyMessage}
                    status={this.props.global.status}
                    clearDesktopNotify={this.props.clearDesktopNotify}/>
                <Header />
                <p>
                    Details about the service...
                </p>
            </div>
        );
    }
}

export default ServiceDetail;
