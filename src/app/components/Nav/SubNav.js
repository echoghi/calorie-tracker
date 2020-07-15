import React from 'react';
import { NavLink } from 'react-router-dom';

import { SubNavMenu as Menu, SubNavIcon as Icon } from './styles';

const SubNav = () => {
    return (
        <Menu>
            <NavLink exact={true} to="/" activeClassName="active">
                <Icon className="icon-calendar" />
                <li>Calendar</li>
            </NavLink>
            <NavLink to="/nutrition" activeClassName="active">
                <Icon className="icon-bar-chart" />
                <li>Nutrition</li>
            </NavLink>

            <NavLink to="/settings" activeClassName="active">
                <Icon className="icon-settings" />
                <li>Settings</li>
            </NavLink>
        </Menu>
    );
};

export default SubNav;
