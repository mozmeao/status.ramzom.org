import React, { Component } from 'react';

import Header from './Header';
import GlobalStatus from './GlobalStatus';
import ServiceSummaryList from './ServiceSummaryList';


class StatusBoard extends Component {
    render() {
        // update last updated timestamp
        var lastUpdate = document.getElementById('last-update');
        lastUpdate.textContent = 'Last Update: ' + this.props.global.lastUpdate;

        return (
            <div id="status-board">
                <GlobalStatus
                    desktopNotify={this.props.global.desktopNotify}
                    message={this.props.global.message}
                    notifyMessage={this.props.global.notifyMessage}
                    status={this.props.global.status}
                    clearDesktopNotify={this.props.clearDesktopNotify}/>
                <Header />
                <ServiceSummaryList services={this.props.global.services} />
            </div>
        );
    }
}

export default StatusBoard;
