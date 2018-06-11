import React from 'react';
import UserMenu from './UserMenu';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logOut } from './actions';
import { auth } from './firebase.js';

const mapStateToProps = state => ({
    userData: state.adminState.userData,
    loading: state.adminState.loading,
    userLoading: state.adminState.userLoading
});

const mapDispatchToProps = dispatch => ({
    logOut: () => dispatch(logOut())
});

const Brand = styled.div`
    position: relative;
    font-size: 50px;
    background: #fff;
    color: #269bda;
    box-sizing: border-box;
    text-align: center;
    display: inline-block;
    padding: 15px 30px;
`;

class NavBar extends React.Component {
    state = {
        width: 0,
        menuOpen: false,
        mobile: false,
        open: false
    };

    handleMenu = () => {
        this.setState({ menuOpen: !this.state.menuOpen });
    };

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

    handleMenuClass() {
        let className;

        if (this.state.width < 760) {
            if (this.state.menuOpen) {
                className = 'navbar__menu active';
            } else {
                className = 'navbar__menu collapsed';
            }
        } else {
            className = 'navbar__menu lg';
        }

        return className;
    }

    renderMenu() {
        if (this.state.width < 760) {
            return (
                <ul className={this.handleMenuClass()}>
                    <Link to="/">
                        <li className={this.handleNavClass('')}>Overview</li>
                    </Link>
                    <Link to="/calendar">
                        <li className={this.handleNavClass('calendar')}>Calendar</li>
                    </Link>
                    <Link to="/nutrition">
                        <li className={this.handleNavClass('nutrition')}>Nutrition</li>
                    </Link>
                    <Link to="/activity">
                        <li className={this.handleNavClass('activity')}>Activity</li>
                    </Link>
                    <Link to="/settings">
                        <li className={this.handleNavClass('settings')}>Settings</li>
                    </Link>
                </ul>
            );
        }
    }

    handleHamburgerClass() {
        let className;

        if (this.state.menuOpen) {
            className = 'hamburger active';
        } else {
            className = 'hamburger';
        }

        return className;
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        this.setState({ width: window.innerWidth });
    };

    logOut = () => {
        auth.signOut().then(() => {
            this.props.logOut();
        });
    };

    handleClick = event => {
        event.preventDefault();

        this.setState({
            open: true,
            anchorEl: event.currentTarget
        });
    };

    renderUserMenu() {
        const { userData, logOut } = this.props;

        return <UserMenu userData={userData} logOut={logOut} />;
    }

    renderNav() {
        const { path } = this.props;

        if (path !== '/login') {
            return (
                <div className="navbar">
                    <Brand>
                        <i className="icon-aperture" />
                    </Brand>
                    <div className={this.handleHamburgerClass()} onClick={this.handleMenu}>
                        <div />
                        <div />
                        <div />
                    </div>
                    {this.renderMenu()}
                    {this.renderUserMenu()}
                </div>
            );
        }
    }

    render() {
        return <div>{this.renderNav()}</div>;
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NavBar);
