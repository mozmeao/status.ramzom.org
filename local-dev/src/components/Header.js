import React, { Component } from 'react';

import logo from '../img/logo.png';

class Header extends Component {
    render() {
        return (
            <h1 id="logo">
                <a href="/">
                    <img src={logo} alt="Mozilla Engagement Engineering Status Board" />
                </a>
            </h1>
        )
    }
}

export default Header;
