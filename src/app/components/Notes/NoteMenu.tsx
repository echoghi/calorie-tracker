import React, { Fragment, useState } from 'react';
import OptionsIcon from '../Icons/OptionsIcons';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from '@material-ui/core/IconButton';
import { Menu, MenuItem } from './styles';

interface NoteMenu {
    remove: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    edit: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export default function NoteMenu({ remove, edit }: NoteMenu) {
    const [open, handleMenu] = useState(false);
    const toggleMenu = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.stopPropagation();
        handleMenu(!open);
    };
    const closeMenu = () => handleMenu(false);

    return (
        <Fragment>
            <ClickAwayListener onClickAway={closeMenu}>
                <IconButton onClick={toggleMenu}>
                    <OptionsIcon />
                </IconButton>
                {open && (
                    <Menu>
                        <MenuItem onClick={edit}>
                            Edit <i className="icon-edit" />
                        </MenuItem>
                        <MenuItem onClick={remove}>
                            Delete <i className="icon-trash-2" />
                        </MenuItem>
                    </Menu>
                )}
            </ClickAwayListener>
        </Fragment>
    );
}
