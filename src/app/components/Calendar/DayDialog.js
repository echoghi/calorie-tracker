import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import { connect } from 'react-redux';

import Bar from '../ProgressBar/Bar';

const mapStateToProps = (state) => ({
    data: state.adminState.data,
});

const progressBarConfig = {
    calories: {
        color: '#ffab3e',
        trailColor: '#FFE9C6',
    },
    carbs: {
        color: '#5b6aee',
        trailColor: '#D0D4FA',
    },
    fat: {
        color: '#f08ec1',
        trailColor: '#FCDFED',
    },
    protein: {
        color: '#32c9d5',
        trailColor: '#E6FDF3',
    },
};

const ButtonLink = Button;

const DayDialog = ({ day, data, open, onClose }) => {
    function renderProgressBar(type) {
        const { trailColor, color } = progressBarConfig[type];

        const progress = day.nutrition[type] / data.user.goals[type];
        const text = `${Math.round(
            (day.nutrition[type] / data.user.goals[type]) * 100
        )}% of daily goal`;

        const options = {
            className: '',
            color,
            containerStyle: {
                margin: '10px 0',
                width: '80%',
            },
            height: 15,
            text,
            trailColor,
        };

        return <Bar progress={progress} options={options} />;
    }

    if (!day) {
        return null;
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true}>
            <DialogTitle>{day.day.format('MMMM Do, YYYY')}</DialogTitle>
            <DialogContent>
                <span>Calories</span>
                {renderProgressBar('calories')}
                <span>Protein</span>
                {renderProgressBar('protein')}
                <span>Fat</span>
                {renderProgressBar('fat')}
                <span>Carbs</span>
                {renderProgressBar('carbs')}
                <DialogContentText />
            </DialogContent>
            <DialogActions>
                <ButtonLink
                    component={Link}
                    to={`/nutrition?d=${day.day.format('x')}`}
                    color="primary"
                    variant="contained"
                    autoFocus={true}
                >
                    Edit
                </ButtonLink>
                <Button color="primary" onClick={onClose}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default connect(mapStateToProps)(DayDialog);
