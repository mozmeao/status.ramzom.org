/*
Serves as a proxy to pass Redux store info down to child components. Invoked by
components/App.js.
*/

import React, { Component } from 'react';

class Main extends Component {
    // Actions that will happen for all child components.
    componentDidMount() {
        // Invoke action to get global status on page load.
        this.props.fetchGlobalStatus();

        // Poll global status every 60 seconds.
        setInterval(this.props.fetchGlobalStatus, 60000);

        // Invoke action to get desktop notify permission.
        this.props.requestDesktopNotify();
    }

    render() {
        return (
            <div id="wrapper">
                {/* passes props down to child element */}
                {React.cloneElement(this.props.children, this.props)}
            </div>
        )
    }
};

export default Main;
