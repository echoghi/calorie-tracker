import React, { useState } from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from '@material-ui/core/IconButton';

import OptionsIcon from '../Icons/OptionsIcons';
import { Menu, MenuItem } from './styles';

export default function NoteMenu({ remove, edit }) {
    const [open, handleMenu] = useState(false);
    const toggleMenu = (event) => {
        event.stopPropagation();
        handleMenu(!open);
    };
    const closeMenu = () => {
        if (open) {
            handleMenu(false);
        }
    };

    return (
        <ClickAwayListener onClickAway={closeMenu}>
            <div>
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
            </div>
        </ClickAwayListener>
    );
}
