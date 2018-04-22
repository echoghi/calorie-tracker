import React from 'react';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
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

class NavBar extends React.Component {
    state = {
        width: 0,
        menuOpen: false,
        mobile: false
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
        const { open, anchorEl } = this.state;
        const { userData } = this.props;

        const style = {
            height: 50,
            width: 50,
            display: 'inline-block'
        };

        return (
            <div className="greeting">
                <div onClick={this.handleClick}>
                    <Paper style={style} zDepth={1} circle rounded className="paper">
                        <img className="user__img" src={userData.photoURL} />
                    </Paper>
                    <i className="icon-chevron-down" />
                </div>
                <Popover
                    className="logout__button"
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                    onRequestClose={() => this.setState({ open: false })}
                >
                    <Menu>
                        <MenuItem containerElement={<Link to="settings" />} primaryText="Settings" />
                        <MenuItem primaryText="Log Out" onClick={this.logOut} />
                    </Menu>
                </Popover>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
