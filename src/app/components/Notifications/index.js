import React from 'react';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';

import { closeSnackBar, processQueue } from '../actions';
import Content from './Content';

const mapStateToProps = (state) => ({
    duration: state.notificationState.duration,
    message: state.notificationState.message,
    open: state.notificationState.open,
    queue: state.notificationState.queue,
    type: state.notificationState.type,
});

const mapDispatchToProps = {
    close: () => closeSnackBar(),
    process: () => processQueue(),
};

const styles = (theme) => ({
    margin: {
        margin: theme.spacing.unit,
    },
});

function Transition(props) {
    return <Slide {...props} direction="right" />;
}

const Notifications = ({ message, type, open, duration, process, close }) => {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        close();
    };

    return (
        <Snackbar
            anchorOrigin={{
                horizontal: 'left',
                vertical: 'bottom',
            }}
            TransitionComponent={Transition}
            open={open}
            autoHideDuration={duration}
            onClose={handleClose}
            onExited={process}
        >
            <Content onClose={handleClose} variant={type} message={message} />
        </Snackbar>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Notifications));
