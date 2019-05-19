import React, { Fragment } from 'react';
import UserMenu from './UserMenu';
import { Nav, Brand, Name, BrandImg } from './styles';
import SubNav from './SubNav';
import BrandIcon from '../../assets/images/brand.png';

const NavBar = () => {
    return (
        <Fragment>
            <Nav>
                <Brand to="/">
                    <BrandImg src={BrandIcon} />
                </Brand>
                <Name>Doughboy</Name>
                <UserMenu />
            </Nav>

            <SubNav />
        </Fragment>
    );
};

export default NavBar;
