import React from 'react';
import { SubNavMenu as Menu, SubNavIcon as Icon, PageIndicator } from './styles';
import { NavLink } from 'react-router-dom';
import Fade from '@material-ui/core/Fade';

const SubNav = () => {
    const Indicator = (name: string) =>
        window.location.pathname === `/${name}` && (
            <Fade in={true}>
                <PageIndicator>.</PageIndicator>
            </Fade>
        );

    return (
        <Menu>
            <NavLink exact={true} to="/" activeClassName="active">
                <Icon className="icon-calendar" />
                <li>Calendar</li>
                {Indicator('calendar')}
            </NavLink>
            <NavLink to="/nutrition" activeClassName="active">
                <Icon className="icon-bar-chart" />
                <li>Nutrition</li>
                {Indicator('nutrition')}
            </NavLink>

            <NavLink to="/settings" activeClassName="active">
                <Icon className="icon-settings" />
                <li>Settings</li>
                {Indicator('settings')}
            </NavLink>
        </Menu>
    );
};

export default SubNav;
