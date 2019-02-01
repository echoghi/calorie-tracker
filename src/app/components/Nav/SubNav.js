import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import Fade from '@material-ui/core/Fade';

const Menu = styled.div`
    padding: 30px 0;
    width: 100%;
    position: fixed;
    top: 80px;
    background: white;
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid #dbdbdb;
    box-shadow: 0 1px 32px 0 rgba(0, 0, 0, 0.1);
    z-index: 99;

    li {
        font-size: 16px;
        font-weight: bold;
        display: inline-flex;
        list-style: none;
    }

    a {
        position: relative;
        display: flex;
        align-items: center;

        &.active li,
        &.active i {
            color: #ff5a5f;
        }
    }

    @media (max-width: 768px) {
        top: auto;
        padding: 25px 0;
        bottom: 0;

        li {
            display: none;
        }
    }
`;

const Icon = styled.i`
    padding: 5px 10px;
    font-size: 25px;
    display: inline-flex;
`;

const PageIndicator = styled.span`
    position: absolute;
    left: 50%;
    top: 20px;
    font-size: 50px;
    color: #ff5a5f;
`;

const SubNav = ({ path }) => {
    const Indicator = name =>
        path === `/${name}` && (
            <Fade in={true}>
                <PageIndicator>.</PageIndicator>
            </Fade>
        );

    return (
        <Menu>
            <NavLink exact to="/" activeClassName="active">
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
