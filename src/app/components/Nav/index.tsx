import React from 'react';
import UserMenu from './UserMenu';
import { Nav, Brand, Name } from './styles';
import SubNav from './SubNav';

const NavBar = () => {
    return (
        <React.Fragment>
            <Nav>
                <Brand to="/">
                    <i className="icon-aperture" />
                </Brand>
                <Name>Doughboy</Name>
                <UserMenu />
            </Nav>

            <SubNav />
        </React.Fragment>
    );
};

export default NavBar;
