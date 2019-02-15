import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Fade from '@material-ui/core/Fade';
import { Greeting, Menu, MenuItem, MenuWrapper, Image, Backup, UserName, Icon } from './styles';

class UserMenu extends Component {
    state = {
        open: false
    };

    componentDidMount() {
        window.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = event => {
        if (
            this.menuRef &&
            !this.menuRef.contains(event.target) &&
            !this.imageRef.contains(event.target)
        ) {
            this.setState({ open: false });
        }
    };

    handleMenu = () => {
        this.setState({ open: !this.state.open });
    };

    render() {
        const { open } = this.state;
        const { userData } = this.props;

        return (
            <Greeting
                ref={node => {
                    this.imageRef = node;
                }}
            >
                <MenuWrapper onClick={this.handleMenu}>
                    {userData.photoURL && <Image src={userData.photoURL} alt={userData.email} />}
                    {!userData.photoURL && <Backup className="icon-user" />}
                    <UserName>{userData.displayName}</UserName>
                    <Icon className="icon-chevron-down" />
                </MenuWrapper>

                {open && (
                    <div
                        ref={node => {
                            this.menuRef = node;
                        }}
                    >
                        <Fade in={open}>
                            <Menu
                                className="logout__button"
                                onClose={() => this.setState({ open: false })}
                            >
                                <MenuItem>
                                    <Link onClick={this.handleMenu} to="settings">
                                        Account Settings
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link onClick={this.handleMenu} to="settings">
                                        Edit Profile
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={this.props.logOut}>Log Out</MenuItem>
                            </Menu>
                        </Fade>
                    </div>
                )}
            </Greeting>
        );
    }
}

export default UserMenu;
