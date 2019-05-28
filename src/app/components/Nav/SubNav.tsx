import React from 'react';
import { SubNavMenu as Menu, SubNavIcon as Icon, PageIndicator } from './styles';
import { NavLink } from 'react-router-dom';
import Fade from '@material-ui/core/Fade';

const Indicator = ({ name = '' }: { name?: string }) =>
    window.location.pathname === `/${name}` && (
        <Fade in={true}>
            <PageIndicator>.</PageIndicator>
        </Fade>
    );

const SubNav = () => {
    return (
        <Menu>
            <NavLink exact={true} to="/" activeClassName="active">
                <Icon className="icon-calendar" />
                <li>Calendar</li>
                <Indicator />
            </NavLink>
            <NavLink to="/nutrition" activeClassName="active">
                <Icon className="icon-bar-chart" />
                <li>Nutrition</li>
                <Indicator name="nutrition" />
            </NavLink>

            <NavLink to="/settings" activeClassName="active">
                <Icon className="icon-settings" />
                <li>Settings</li>
                <Indicator name="settings" />
            </NavLink>
        </Menu>
    );
};

export default SubNav;
