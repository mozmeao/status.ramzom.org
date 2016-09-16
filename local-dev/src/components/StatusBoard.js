import React, { Component } from 'react';
import { Link } from 'react-router';
import fetch from 'isomorphic-fetch';
import jsyaml from 'js-yaml';

import Header from './Header';
import GlobalStatus from './GlobalStatus';

const DEFAULT_ORDER_VALUE = 10000;

class Service extends Component {
    getBadge() {
        return (
            <span className={"status " + this.props.status}>{this.props.status}</span>
        );
    }

    getLink() {
        if (this.props.link === '') {
            return '';
        }

        return (
            <a className="status-link" href={this.props.link} title="Learn more">Learn more</a>
        );
    }

    render() {
        return (
            <li className="list-group-item">
                {this.getBadge()}
                {/* soon... <Link to={`/service/${this.props.id}`}>{this.props.name}</Link>*/}
                {this.props.name}
                &nbsp;
                {this.getLink()}
            </li>
        );
    }
}

class ServiceGroup extends Component {
    getServices() {
        var services = [];

        this.props.services.forEach(service => {
            if (!service.display) {
                return;
            }

            services.push(
                <Service
                   key={service.id}
                   id={service.id}
                   status={service.status}
                   link={service.link}
                   name={service.name}
                   order={service.order}/>
            );
        });

        services.sort((a, b) => {
            let a_order = a.props.order !== undefined ? a.props.order : 0;
            let b_order = b.props.order !== undefined ? b.props.order : 0;

            if (a_order < b_order) {
                return -1;
            } else if (a_order > b_order) {
                return 1;
            }

            return 0;
        });

        return services;
    }

    render() {
        var services = this.getServices();
        var header = null;

        if (this.props.name !== 'default') {
            header = (
                <li className="list-group-item list-group-item-info">
                    {this.props.name}
                </li>
            );
        }

        return (
            <ul className={"list-group"}>
                {header}
                {services}
            </ul>
        );
    }
}

class ServiceList extends Component {
    generateGroups() {
        var groups = {
            default: {
                order: DEFAULT_ORDER_VALUE + 1,
                services: []
            }
        };

        this.props.services.forEach(service => {
            if (!service.display) {
                return;
            }

            if (service.group) {
                if (Object.keys(groups).indexOf(service.group) >= 0) {
                    groups[service.group].services.push(service);
                } else {
                    groups[service.group] = {
                        services: [service]
                    };
                }
            } else {
                groups.default.services.push(service);
            }
        });

        for (var property in groups) {
            if (groups.hasOwnProperty(property)) {
                if (property === 'default') {
                    // Default group has already calculated order.
                    continue;
                }

                groups[property].order = this.getGroupOrder(groups[property].services);
            }
        };

        return groups;
    }

    /**
     *  Group order is defined by the component in the group with the minimum
     *  order value.
     *
     * Default is DEFAULT_ORDER_VALUE.
     */
    getGroupOrder(services) {
        var order = DEFAULT_ORDER_VALUE;

        services.forEach(service => {
            if (service.order && service.order < order) {
                order = service.order;
            }
        });

        return order;
    }

    render() {
        var groups = this.generateGroups();
        var serviceGroups = [];

        for (var property in groups) {
            if (groups.hasOwnProperty(property)) {
                serviceGroups.push(
                    <ServiceGroup
                        key={property}
                        name={property}
                        services={groups[property].services}
                        order={groups[property].order} />
                );
            }
        }

        serviceGroups.sort((a, b) => {
            // Reverse ordering
            var a_order = a.props.order;
            var b_order = b.props.order;

            if (a_order < b_order) {
                return -1;
            } else if (a_order > b_order) {
                return 1;
            }

            return 0;
        });

        return (
            <div>
                {serviceGroups}
            </div>
        );
    }
}

class StatusBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            globalStatusMessage: 'Fetching data.',
            globalStatus: 'pending',
            oldGlobalStatus: null,
            services: [],
            lastUpdate: null,
            desktopNotify: false
        };
    }

    updateStatus() {
        fetch('./status.yml').then(response => {
            if (response.ok) {
                response.text().then(text => {
                    this.updateStateFromYaml(text);
                });
            } else {
                console.error('status.yml response not ok :(');
            }
        }).catch((err) => {
            console.error('fetch error!');
            console.error(err);
        });
    }

    updateStateFromYaml(yaml) {
        var statusData = jsyaml.load(yaml);
        var services = Object.keys(statusData.components).map(key => {
            return statusData.components[key];
        });

        this.setState({
            oldGlobalStatus: this.state.globalStatus,
            globalStatus: statusData.globalStatus.status,
            globalStatusMessage: statusData.globalStatus.message,
            services: services,
            lastUpdate: new Date()
        });
    }

    componentDidMount() {
        this.updateStatus();
        setInterval(this.updateStatus.bind(this), 60000);
        this.getDesktopNotifyPermission();
    }

    getDesktopNotifyPermission(message, icon) {
        if (!('Notification' in window)) {
            return;
        }
        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === 'granted') {
            this.setState({desktopNotify: true});
        }
        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(permission => {
                // If the user accepts, let's create a notification
                if (permission === 'granted') {
                    this.setState({desktopNotify: true});
                }
            });
        }
    }

    render() {
        // update last updated timestamp
        var lastUpdate = document.getElementById('last-update');
        lastUpdate.textContent = 'Last Update: ' + this.state.lastUpdate;

        return (
            <div id="status-board">
                <GlobalStatus
                    message={this.state.globalStatusMessage}
                    status={this.state.globalStatus}
                    oldStatus={this.state.oldGlobalStatus}
                    desktopNotify={this.state.desktopNotify} />
                <Header />
                <ServiceList services={this.state.services} />
            </div>
        );
    }
}

export default StatusBoard;
