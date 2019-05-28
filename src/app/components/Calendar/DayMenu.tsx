import React, { useState } from 'react';
import OptionsIcon from '../Icons/OptionsIcons';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from '@material-ui/core/IconButton';
import { DayMenuContainer, CalendarMenu, CalendarMenuLink } from './styles';
import { Day } from '../types';

export default function DayMenu({ day }: { day: Day }) {
    const [open, handleMenu] = useState(false);
    const toggleMenu = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.stopPropagation();
        handleMenu(!open);
    };
    const closeMenu = () => {
        if (open) {
            handleMenu(false);
        }
    };
    const editLink = `/nutrition?d=${day.day.format('x')}`;

    return (
        <ClickAwayListener onClickAway={closeMenu}>
            <DayMenuContainer>
                <IconButton onClick={toggleMenu}>
                    <OptionsIcon height={16} width={16} orientation="vertical" />
                </IconButton>
                {open && (
                    <CalendarMenu>
                        <CalendarMenuLink to={editLink}>
                            Edit <i className="icon-edit" />
                        </CalendarMenuLink>
                    </CalendarMenu>
                )}
            </DayMenuContainer>
        </ClickAwayListener>
    );
}
