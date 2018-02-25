import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { saveUserData } from './actions';
import { auth, provider } from './firebase.js';

const mapStateToProps = state => ({
    data: state.adminState.data,
    home: state.navigationState.home,
    nutrition: state.navigationState.nutrition,
    calendar: state.navigationState.calendar,
    activity: state.navigationState.activity,
    settings: state.navigationState.settings
});

const mapDispatchToProps = dispatch => ({
    saveUserData: data => dispatch(saveUserData(data))
});

class NavBar extends React.Component {
    state = {
        width: 0,
        menuOpen: false,
        mobile: false,
        user: null,
        loading: true
    };

    handleMenu = () => {
        this.setState({ menuOpen: !this.state.menuOpen });
    };

    handleHamburgerClass() {
        let className;

        if (this.state.menuOpen) {
            className = 'hamburger active';
        } else {
            className = 'hamburger';
        }

        return className;
    }

    handleNavClass(name) {
        let className;

        if (this.props[name]) {
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

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                console.log(user);
                this.props.saveUserData(user);
                this.setState({ user, loading: false });
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

    logIn = () => {
        auth.signInWithPopup(provider).then(result => {
            const user = result.user;
            this.props.saveUserData(user);

            this.setState({
                user
            });
        });
    };

    logOut = () => {
        auth.signOut().then(() => {
            this.props.saveUserData({});
            this.setState({
                user: null
            });
        });
    };

    renderGreeting() {
        let { user, loading } = this.state;

        const style = {
            height: 50,
            width: 50,
            margin: 15,
            textAlign: 'center',
            display: 'inline-block'
        };

        if (user && !loading) {
            return (
                <div className="greeting">
                    <Paper style={style} zDepth={1} rounded={false} className="paper">
                        <img className="user__img" src={this.state.user.photoURL} />
                    </Paper>
                    <h3>Welcome back, {this.state.user.displayName}</h3>
                </div>
            );
        } else {
            return (
                <div className="greeting loading">
                    <div className="user__img" />
                    <div className="greeting__message" />
                </div>
            );
        }
    }

    renderUserMenu() {
        let { user, loading } = this.state;

        if (!user && loading) {
            return (
                <div className="login__button loading">
                    <div />
                </div>
            );
        } else if (!user && !loading) {
            return (
                <RaisedButton
                    label="Login"
                    className="login__button"
                    onClick={this.logIn}
                    backgroundColor="#ed5454"
                    labelColor="#fff"
                />
            );
        } else {
            return (
                <IconMenu
                    iconButtonElement={
                        <IconButton>
                            <MoreVertIcon />
                        </IconButton>
                    }
                    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
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

    render() {
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
                        <li className={this.handleNavClass('home')}>
                            <i className="icon-home" /> Overview
                        </li>
                    </Link>
                    <Link to="/calendar">
                        <li className={this.handleNavClass('calendar')}>
                            <i className="icon-calendar" /> Calendar
                        </li>
                    </Link>
                    <Link to="/nutrition">
                        <li className={this.handleNavClass('nutrition')}>
                            <i className="icon-plus-circle" /> Nutrition
                        </li>
                    </Link>
                    <Link to="/activity">
                        <li className={this.handleNavClass('activity')}>
                            <i className="icon-bar-chart" /> Activity
                        </li>
                    </Link>
                    <Link to="/settings">
                        <li className={this.handleNavClass('settings')}>
                            <i className="icon-settings" /> Settings
                        </li>
                    </Link>
                </ul>
                <div className="navbar__top">
                    {this.renderGreeting()}
                    {this.renderUserMenu()}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
