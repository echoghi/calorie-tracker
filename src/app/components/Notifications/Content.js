import React from 'react';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    success: {
        backgroundColor: 'rgb(0, 132, 137)'
    },
    error: {
        background: 'rgb(203, 36, 49)'
    },
    info: {
        backgroundColor: '#d3d7d9'
    },
    warning: {
        backgroundColor: '#FFF9ED'
    },
    icon: {
        fontSize: 20
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit
    },
    message: {
        display: 'flex',
        alignItems: 'center',
        fontSize: 14,
        color: '#ffffff',
        letterSpacing: 0.6
    }
});

const Content = ({ classes, className, message, onClose, variant }) => (
    <SnackbarContent
        className={classNames(classes[variant], className)}
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
                <i className="icon-x2" style={{ color: '#ffffff' }} />
            </IconButton>
        ]}
        style={{
            flexWrap: 'inherit',
            boxShadow: '0 1px 32px 0 rgba(0,0,0,0.1)'
        }}
    />
);

export default withStyles(styles)(Content);
