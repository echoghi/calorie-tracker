import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
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
            color: #269bda;
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
    color: #269bda;
`;

class SubNav extends React.Component {
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

    renderIndicator(name) {
        const { path } = this.props;
        let indicator;

        if (path === `/${name}`) {
            indicator = (
                <Fade in={true}>
                    <PageIndicator>.</PageIndicator>
                </Fade>
            );
        } else {
            indicator = '';
        }

        return indicator;
    }

    render() {
        return (
            <Menu>
                <Link to="/" className={this.handleNavClass('')}>
                    <Icon className="icon-user" />
                    <li>Overview</li>
                    {this.renderIndicator('')}
                </Link>
                <Link to="/calendar" className={this.handleNavClass('calendar')}>
                    <Icon className="icon-calendar" />
                    <li>Calendar</li>
                    {this.renderIndicator('calendar')}
                </Link>
                <Link to="/nutrition" className={this.handleNavClass('nutrition')}>
                    <Icon className="icon-bar-chart-2" />
                    <li>Nutrition</li>
                    {this.renderIndicator('nutrition')}
                </Link>
                <Link to="/activity" className={this.handleNavClass('activity')}>
                    <Icon className="icon-activity" />
                    <li>Activity</li>
                    {this.renderIndicator('activity')}
                </Link>
                <Link to="/settings" className={this.handleNavClass('settings')}>
                    <Icon className="icon-settings" />
                    <li>Settings</li>
                    {this.renderIndicator('settings')}
                </Link>
            </Menu>
        );
    }
}

export default SubNav;
