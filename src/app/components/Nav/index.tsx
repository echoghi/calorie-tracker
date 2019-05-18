import React, { Fragment } from 'react';
import UserMenu from './UserMenu';
import { Nav, Brand, Name } from './styles';
import SubNav from './SubNav';

const NavBar = () => {
    return (
        <Fragment>
            <Nav>
                <Brand to="/">
                    <i className="icon-aperture" />
                </Brand>
                <Name>Doughboy</Name>
                <UserMenu />
            </Nav>

            <SubNav />
        </Fragment>
    );
};

export default NavBar;
