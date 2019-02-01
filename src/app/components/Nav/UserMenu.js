import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Fade from '@material-ui/core/Fade';

const Menu = styled.ul`
    position: absolute;
    width: 200px;
    font-family: 'Varela Round';
    margin-top: 40px;
    background: #fff;
    list-style: none;
    padding: 15px;
    right: 0;
    border: 1px solid #dbdbdb;
    border-radius: 0 0 4px 4px;
`;

const MenuItem = styled.li`
    padding: 10px;
    border-top: 1px solid rgb(242, 242, 242);

    &:first-child {
        border-top: 0;
    }

    &:hover {
        opacity: 0.8;
    }
`;

const Name = styled.div`
    font-size: 12px;
    font-weight: bold;
    padding: 0 15px;

    @media (max-width: 768px) {
        display: none;
    }
`;

const Icon = styled.i`
    display: inline-block;
    vertical-align: top;
    padding: 20px 5px;

    @media (max-width: 768px) {
        display: none;
    }
`;

const Greeting = styled.div`
    float: right;
    padding: 0 20px;
    display: inline-flex;
    height: 100%;
    align-items: center;
    cursor: pointer;
`;

const MenuWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const Image = styled.img`
    height: 50px;
    border-radius: 50%;
    box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px;
`;

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
                    <Image src={userData.photoURL} />
                    <Name>{userData.displayName}</Name>
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
