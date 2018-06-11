import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Menu = styled.div`
    padding: 20px 0;
    width: 100%;
    position: fixed;
    top: 80px;
    background: white;
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid #dbdbdb;

    li {
        font-size: 16px;
        font-weight: bold;
        display: inline-flex;
        list-style: none;
    }

    a {
        display: flex;
        align-items: center;

        &.active li,
        &.active i {
            color: #ed5454;
        }
    }
`;

const Icon = styled.i`
    padding: 5px 10px;
    font-size: 25px;
    display: inline-flex;
`;

class SubNav extends React.Component {
    state = {};

    handleNavClass(name) {
        const { path } = this.props;
        let className;

        if (path === `/${name}`) {
            className = 'active';
        } else {
            className = '';
        }

        return className;
    }

    render() {
        return (
            <Menu>
                <Link to="/" className={this.handleNavClass('')}>
                    <Icon className="icon-user" />
                    <li>Overview</li>
                </Link>
                <Link to="/calendar" className={this.handleNavClass('calendar')}>
                    <Icon className="icon-calendar" />
                    <li>Calendar</li>
                </Link>
                <Link to="/nutrition" className={this.handleNavClass('nutrition')}>
                    <Icon className="icon-bar-chart-2" />
                    <li>Nutrition</li>
                </Link>
                <Link to="/activity" className={this.handleNavClass('activity')}>
                    <Icon className="icon-activity" />
                    <li>Activity</li>
                </Link>
                <Link to="/settings" className={this.handleNavClass('settings')}>
                    <Icon className="icon-settings" />
                    <li>Settings</li>
                </Link>
            </Menu>
        );
    }
}

export default SubNav;
