import React from 'react';
import { Link } from 'react-router-dom';
import Fade from '@material-ui/core/Fade';
import { Greeting, Menu, MenuItem, MenuWrapper, Image, Backup, UserName, Icon } from './styles';
import { ClickAwayListener } from '@material-ui/core';

interface UserMenu {
    userData: any;
    logOut: () => void;
}

function UserMenu({ userData, logOut }: UserMenu) {
    const [open, setMenu] = React.useState(false);

    const closeMenu = () => {
        setMenu(false);
    };

    const toggleMenu = () => {
        setMenu(!open);
    };

    return (
        <ClickAwayListener onClickAway={closeMenu}>
            <Greeting>
                <MenuWrapper onClick={toggleMenu}>
                    {userData.photoURL && <Image src={userData.photoURL} alt={userData.email} />}
                    {!userData.photoURL && <Backup className="icon-user" />}
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
                                <MenuItem onClick={logOut}>Log Out</MenuItem>
                            </Menu>
                        </Fade>
                    </div>
                )}
            </Greeting>
        </ClickAwayListener>
    );
}

export default UserMenu;
