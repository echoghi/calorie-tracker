import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { saveUserData } from './actions';
import { auth, provider } from './firebase.js';

const mapDispatchToProps = dispatch => ({
    saveUserData: data => dispatch(saveUserData(data))
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
        const { pathname } = this.props.history.location;
        let className;

        if (pathname === `/${name}`) {
            className = 'active';
        } else {
            className = '';
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

    renderUserMenu() {
        const { user } = this.state;
        const { loading } = this.props;
        const menuConfig = { horizontal: 'right', vertical: 'top' };

        const style = {
            height: 50,
            width: 50,
            display: 'inline-block'
        };

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

    render() {
        return (
            <div className="navbar">
                <div className="navbar__brand">
                    <i className="icon-fire" />
                </div>
                <ul className="navbar__menu lg">
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
    }
}

export default connect(null, mapDispatchToProps)(NavBar);
