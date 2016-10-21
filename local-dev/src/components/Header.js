import React, { Component } from 'react';
import { Link } from 'react-router';

import logo from '../img/logo.png';

class Header extends Component {
    render() {
        return (
            <h1 id="logo">
                <Link to="/">
                    <img src={logo} alt="Mozilla Engagement Engineering Status Board" />
                </Link>
            </h1>
        )
    }
}

export default Header;
