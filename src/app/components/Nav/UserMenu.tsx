import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Fade from '@material-ui/core/Fade';
import { Greeting, Menu, MenuItem, MenuWrapper, Image, Backup, UserName, Icon } from './styles';
import { ClickAwayListener } from '@material-ui/core';
import firebase from 'firebase';
import Firebase from '../firebase';
import { connect } from 'react-redux';
import { RootState } from '../types';
import { logOut, saveUserData } from '../actions';

interface UserMenu {
    userData: firebase.UserInfo;
    appLogOut: () => void;
    notification: string;
    saveUser: (userData: firebase.UserInfo) => void;
}

const mapStateToProps = (state: RootState) => ({
    notification: state.notificationState.message,
    userData: state.adminState.userData
});

const mapDispatchToProps = {
    appLogOut: () => logOut(),
    saveUser: (userData: firebase.UserInfo) => saveUserData(userData)
};

function UserMenu({ userData, appLogOut, notification, saveUser }: UserMenu) {
    const [open, setMenu] = useState(false);

    useEffect(() => {
        if (notification === 'Display Name Updated.') {
            // reload new display name into redux
            // when a display name update is successfully saved
            Firebase.auth.currentUser.reload().then(() => {
                saveUser(Firebase.auth.currentUser);
            });
        }
    }, [notification, saveUser]);

    const closeMenu = () => {
        setMenu(false);
    };

    const toggleMenu = () => {
        setMenu(!open);
    };

    const logOutHandler = () => {
        Firebase.auth.signOut().then(() => {
            appLogOut();
        });
    };

    return (
        <ClickAwayListener onClickAway={closeMenu}>
            <Greeting>
                <MenuWrapper onClick={toggleMenu}>
                    {[
                        // User Photo
                        userData.photoURL && (
                            <Image key={0} src={userData.photoURL} alt={userData.email} />
                        ),
                        // Default user icon
                        !userData.photoURL && <Backup key={1} className="icon-user" />
                    ].filter(Boolean)}
                    <UserName>{userData.displayName}</UserName>
                    <Icon className="icon-chevron-down" />
                </MenuWrapper>

                {open && (
                    <div>
                        <Fade in={open}>
                            <Menu className="logout__button" onClose={closeMenu}>
                                <MenuItem>
                                    <Link onClick={closeMenu} to="settings">
                                        Account Settings
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link onClick={closeMenu} to="settings">
                                        Edit Profile
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={logOutHandler}>Log Out</MenuItem>
                            </Menu>
                        </Fade>
                    </div>
                )}
            </Greeting>
        </ClickAwayListener>
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserMenu);
