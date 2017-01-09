import React, { Component } from 'react';
import { Link } from 'react-router';

class ServiceSummary extends Component {
    render() {
        return (
            <li className="list-group-item">
                <span className={"status " + this.props.status}>{this.props.status}</span>
                {/* soon...seriously <Link to={`/service/${this.props.id}`}>{this.props.name}</Link> */}
                {this.props.name}
            </li>
        );
    }
}

export default ServiceSummary;
