import React, { useState } from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from '@material-ui/core/IconButton';

import OptionsIcon from '../Icons/OptionsIcons';
import { Menu, MenuItem } from '../Notes/styles';

export default function HabitMenu({ remove, reset }) {
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
                        <MenuItem onClick={reset}>
                            Reset <i className="icon-refresh-cw" />
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
