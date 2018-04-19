import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { saveUserData, logOut } from './actions';
import { auth } from './firebase.js';

const mapDispatchToProps = dispatch => ({
    saveUserData: data => dispatch(saveUserData(data)),
    logOut: () => dispatch(logOut())
});

class NavBar extends React.Component {
    state = {
        width: 0,
        menuOpen: false,
        mobile: false,
        user: null
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
        auth.onAuthStateChanged(user => {
            if (user) {
                this.props.saveUserData(user);
                this.setState({ user });
            }
        });

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

    renderUserMenu() {
        const { user } = this.state;
        const { loading } = this.props;
        const menuConfig = { horizontal: 'right', vertical: 'top' };

        const style = {
            height: 50,
            width: 50,
            display: 'inline-block'
        };

        if (!user || loading) {
            return (
                <div className="login__button loading">
                    <div />
                </div>
            );
        } else {
            return (
                <IconMenu
                    iconButtonElement={
                        <div className="greeting">
                            <Paper style={style} zDepth={1} circle rounded className="paper">
                                <img className="user__img" src={user.photoURL} />
                            </Paper>
                            <i className="icon-chevron-down" />
                        </div>
                    }
                    anchorOrigin={menuConfig}
                    targetOrigin={menuConfig}
                    className="logout__button"
                >
                    <Link to="settings">
                        <MenuItem primaryText="Settings" />
                    </Link>
                    <MenuItem primaryText="Log Out" onClick={this.logOut} />
                </IconMenu>
            );
        }
    }

    renderNav() {
        const { path } = this.props;

        if (path !== '/login') {
            return (
                <div className="navbar">
                    <div className="navbar__brand">
                        <i className="icon-fire" />
                    </div>
                    <div className={this.handleHamburgerClass()} onClick={this.handleMenu}>
                        <div />
                        <div />
                        <div />
                    </div>
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
                    {this.renderUserMenu()}
                </div>
            );
        } else {
            return <div />;
        }
    }

    render() {
        return <div>{this.renderNav()}</div>;
    }
}

export default connect(null, mapDispatchToProps)(NavBar);
