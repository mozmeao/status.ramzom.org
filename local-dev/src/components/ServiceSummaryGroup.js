import React, { Component } from 'react';

import ServiceSummary from './ServiceSummary';

class ServiceSummaryGroup extends Component {
    getServices() {
        var services = [];

        this.props.services.forEach(service => {
            if (!service.display) {
                return;
            }

            services.push(
                <ServiceSummary
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
            <ul className="list-group">
                {header}
                {services}
            </ul>
        );
    }
}

export default ServiceSummaryGroup;
