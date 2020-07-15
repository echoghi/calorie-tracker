import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import OptionsIcon from '../Icons/OptionsIcons';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from '@material-ui/core/IconButton';
import { MenuItem } from '../Notes/styles';
import { MealMenuWrapper } from './styles';
import { copyMeal, successNotification } from '../actions';
import { parseUrlDay } from '../Calendar/utils';
import moment from 'moment';

const mapDispatchToProps = {
    copyMeal: (meal) => copyMeal(meal),
    successMessage: (message) => successNotification(message),
};

const mapStateToProps = (state) => ({
    userData: state.adminState.userData,
});

function MealMenu({ remove, history, data, copyMeal, edit, successMessage }) {
    const [open, handleMenu] = useState(false);
    const toggleMenu = (event) => {
        event.stopPropagation();
        handleMenu(!open);
    };

    const copy = () => {
        copyMeal(data);
        closeMenu();
        window.scrollTo(0, 200);
        // prettier-ignore
        successMessage('Meal copied!');

        if (history.location.search) {
            history.push({ pathname: '/nutrition', search: '' });
        }
    };

    const editMeal = () => {
        edit();
        copyMeal(data);
        closeMenu();
        window.scrollTo(0, 200);
    };

    const closeMenu = () => {
        if (open) {
            handleMenu(false);
        }
    };

    const date = parseUrlDay();

    return (
        <ClickAwayListener onClickAway={closeMenu}>
            <div>
                <IconButton onClick={toggleMenu}>
                    <OptionsIcon />
                </IconButton>
                {open && (
                    <MealMenuWrapper>
                        <MenuItem onClick={editMeal}>
                            Edit <i className="icon-edit" />
                        </MenuItem>
                        {history.location.search && !moment().isSame(date, 'day') && (
                            <MenuItem onClick={copy}>
                                Copy <i className="icon-file-plus" />
                            </MenuItem>
                        )}
                        <MenuItem onClick={remove}>
                            Delete <i className="icon-trash-2" />
                        </MenuItem>
                    </MealMenuWrapper>
                )}
            </div>
        </ClickAwayListener>
    );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MealMenu));
