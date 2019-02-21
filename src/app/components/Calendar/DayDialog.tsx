import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import Bar from '../ProgressBar/Bar';
import { connect } from 'react-redux';
import moment from 'moment';

const mapStateToProps = (state: any) => ({
    data: state.adminState.data
});

interface Note {
    title: string;
    time: string;
    body: string;
    edited: boolean;
}

interface Day {
    nutrition: {
        fat: number;
        calories: number;
        carbs: number;
        protein: number;
        [index: string]: number;
    };
    day: moment.Moment;
    notes?: Note[];
    fitness?: {
        calories: number;
        activities: string[];
    };
}

interface DataShape {
    user: {
        goals: {
            fat: number;
            carbs: number;
            calories: number;
            protein: number;
            [index: string]: number;
        };
    };
    calendar: Day[];
}

interface ProgressProps {
    color: string;
    trailColor: string;
    [index: string]: string;
}

interface ProgressBarConfig {
    calories: ProgressProps;
    carbs: ProgressProps;
    fat: ProgressProps;
    protein: ProgressProps;
    [index: string]: ProgressProps;
}

const progressBarConfig: ProgressBarConfig = {
    calories: {
        color: '#ffab3e',
        trailColor: '#FFE9C6'
    },
    carbs: {
        color: '#5b6aee',
        trailColor: '#D0D4FA'
    },
    fat: {
        color: '#f08ec1',
        trailColor: '#FCDFED'
    },
    protein: {
        color: '#32c9d5',
        trailColor: '#E6FDF3'
    }
};

// TODO: fix TS Link/Button type conflict
const ButtonLink: any = Button;

const DayDialog = ({
    day,
    data,
    open,
    onClose
}: {
    day: Day;
    data: DataShape;
    open: boolean;
    onClose: () => void;
}) => {
    function renderProgressBar(type: string) {
        const { trailColor, color } = progressBarConfig[type];

        const progress: number = day.nutrition[type] / data.user.goals[type];
        const text: string = `${Math.round(
            (day.nutrition[type] / data.user.goals[type]) * 100
        )}% of daily goal`;

        const options = {
            className: '',
            color,
            containerStyle: {
                margin: '10px 0',
                width: '80%'
            },
            height: 15,
            text,
            trailColor
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
