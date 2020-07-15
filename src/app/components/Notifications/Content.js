import React, { memo } from 'react';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
    error: {
        background: 'rgb(203, 36, 49)',
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        marginRight: theme.spacing.unit,
        opacity: 0.9,
    },
    info: {
        backgroundColor: '#d3d7d9',
    },
    message: {
        alignItems: 'center',
        color: '#ffffff',
        display: 'flex',
        fontSize: 14,
        letterSpacing: 0.6,
    },
    success: {
        backgroundColor: 'rgb(0, 132, 137)',
    },
    warning: {
        backgroundColor: '#FFF9ED',
    },
});

const mainStyles = {
    boxShadow: '0 1px 32px 0 rgba(0,0,0,0.1)',
    flexWrap: 'inherit',
};

const iconStyles = {
    color: '#ffffff',
};

const Content = ({ classes, message, onClose, variant }) => (
    <SnackbarContent
        className={classes[variant]}
        aria-describedby="client-snackbar"
        message={
            <span
                id="client-snackbar"
                className={classes.message}
                data-testid="notification-message"
            >
                {message}
            </span>
        }
        action={[
            <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={onClose}
            >
                <i className="icon-x2" style={iconStyles} />
            </IconButton>,
        ]}
        style={mainStyles}
    />
);

export default memo(withStyles(styles)(Content));
