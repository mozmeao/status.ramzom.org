import React, { Component } from 'react';

import favFailed from '../img/favicon-failed.png';
import favHealthy from '../img/favicon-healthy.png';
import favWarning from '../img/favicon-warning.png';

class GlobalStatus extends Component {
    statusToColor(status) {
        var result;

        switch(status) {
            case 'healthy':
                result = 'success';
                break;
            case 'warning':
                result = 'warning';
                break;
            case 'failed':
                result = 'danger';
                break;
            case 'pending':
                result = 'info';
                break;
            default:
                result = '';
                break;
        }

        return result;
    }
    statusToIcon(status) {
        var img;

        switch (status) {
            case 'healthy':
                img = favHealthy;
                break;
            case 'pending':
            case 'warning':
                img = favWarning;
                break;
            case 'failed':
                img = favFailed;
                break;
            default:
                break;
        }
        return img;
    }
    setFavicon(status) {
        // update favicon
        var favicon = document.getElementById('favicon');
        var img = this.statusToIcon(status);

        if (img) {
            favicon.href = img;
        }
    }
    sendDesktopNotification(message, icon) {
        var options = {
            body: 'Mozilla Engagement Engineering Status Board',
            icon: icon
        };
        new Notification(message, options);
    }
    render() {
        this.setFavicon(this.props.status);

        if (this.props.desktopNotify &&
            this.props.oldStatus && this.props.oldStatus !== 'pending' &&
            this.props.status !== this.props.oldStatus) {
                this.sendDesktopNotification(this.props.message, this.statusToIcon(this.props.status));
        }

        var className = 'alert alert-' + this.statusToColor(this.props.status);

        return (
            <div className={className} role="alert">
                {this.props.message}
            </div>
        );
    }
}

export default GlobalStatus;
