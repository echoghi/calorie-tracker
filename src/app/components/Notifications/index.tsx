import React from 'react';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import { closeSnackBar, processQueue } from '../actions';
import Content from './Content';

interface UserProps {
    uid: string;
}

interface State {
    adminState: {
        data: {};
        day: {
            day: {};
            todayButton: boolean;
            formattedDay: {};
            requestedDate: boolean;
            dayRef: {};
            dayIndex: 0;
        };
        error: boolean;
        userData: UserProps;
        userLoading: true;
        loading: boolean;
        success: boolean;
    };
    notificationState: {
        open: boolean;
        message: string;
        type: string;
        queue: any[];
        duration: number;
    };
}

const mapStateToProps = (state: State) => ({
    duration: state.notificationState.duration,
    message: state.notificationState.message,
    open: state.notificationState.open,
    queue: state.notificationState.queue,
    type: state.notificationState.type
});

const mapDispatchToProps = (dispatch: any) => ({
    close: () => dispatch(closeSnackBar()),
    process: () => dispatch(processQueue())
});

const styles = (theme: any) => ({
    margin: {
        margin: theme.spacing.unit
    }
});

function Transition(props: any) {
    return <Slide {...props} direction="right" />;
}

interface Notifications {
    message: string;
    type: string;
    open: boolean;
    duration: number;
    process: () => void;
    close: () => void;
}

const Notifications = ({ message, type, open, duration, process, close }: Notifications) => {
    const handleClose = (event: any, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        close();
    };

    return (
        <Snackbar
            anchorOrigin={{
                horizontal: 'left',
                vertical: 'bottom'
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Notifications));
