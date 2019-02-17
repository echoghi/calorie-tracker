import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Loading from '../Loading';
import isEmpty from 'lodash.isempty';
import moment from 'moment';
// Components
import Button from '@material-ui/core/Button';
import Bar from '../ProgressBar/Bar';
import MealTable from './MealTable';
import queryString from 'query-string';
import MealForm from './MealForm';
import Notes from '../Notes';
import { HeaderWrapper, Overview, Box, BoxHeader } from './styles';
import { RootState } from '../types';

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

const mapStateToProps = (state: RootState) => ({
    data: state.adminState.data,
    loading: state.adminState.loading,
    userData: state.adminState.userData,
    userLoading: state.adminState.userLoading
});

interface Note {
    title: string;
    time: string;
    body: string;
    edited: boolean;
    [index: string]: string | boolean;
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
        [index: string]: string[] | number;
    };
}

const dayShape: Day = {
    day: moment(),
    nutrition: {
        calories: 0,
        carbs: 0,
        fat: 0,
        protein: 0
    }
};

interface Data {
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

interface NutritionProps extends RouteComponentProps {
    data: Data;
}

const Nutrition: React.SFC<NutritionProps> = ({ data, history }) => {
    const [day, setDay] = React.useState(dayShape);
    const [dayIndex, setDayIndex] = React.useState(0);
    const [today, setToday] = React.useState(true);

    React.useEffect(() => {
        loadDay();
    }, []);

    // fetch data when requested date changes
    React.useEffect(() => {
        loadDay();
    }, [location.search, data]);

    function loadDay() {
        let date: moment.Moment;

        if (location.search) {
            const parsed = queryString.parse(location.search);
            date = moment(parseInt(parsed.d, 10));

            setToday(false);
        }

        if (date) {
            // save the queried day to state
            for (let i = 0; i < data.calendar.length; i++) {
                if (data.calendar[i].day.isSame(date)) {
                    setDay(data.calendar[i]);
                    setDayIndex(+i);

                    return;
                }
            }
        } else {
            const lastIndex = Object.keys(data.calendar).length - 1;

            setDayIndex(lastIndex);

            const todayData = data.calendar[lastIndex];

            setDay(todayData);
        }
    }

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
                margin: '30px auto',
                width: '80%'
            },
            height: 25,
            text: {
                style: {
                    color: '#a2a7d9',
                    fontSize: '1rem',
                    margin: '10px 0 0 0'
                },
                value: text
            },
            trailColor
        };

        return <Bar progress={progress} options={options} />;
    }

    function goToToday() {
        setToday(true);

        history.push({ pathname: '/nutrition', search: '' });
    }

    if (isEmpty(day)) {
        return <Loading />;
    }

    const { protein, carbs, fat } = day.nutrition;

    return (
        <React.Fragment>
            <div className="nutrition">
                <HeaderWrapper>
                    <div>
                        <h1>Nutrition</h1>
                        <h3>{!isEmpty(day.day) ? day.day.format('dddd, MMMM Do YYYY') : ''}</h3>
                    </div>
                    <div>
                        {!today && (
                            <Button
                                onClick={goToToday}
                                color="primary"
                                variant="outlined"
                                size="large"
                            >
                                Go to Today
                            </Button>
                        )}
                    </div>
                </HeaderWrapper>

                <Overview>
                    <Box>
                        <BoxHeader>
                            <h1>{protein}</h1>
                            <span>g</span>
                            <h3>Protein</h3>
                        </BoxHeader>
                        {renderProgressBar('protein')}
                    </Box>

                    <Box>
                        <BoxHeader>
                            <h1>{carbs}</h1>
                            <span>g</span>
                            <h3>Carbohydrates</h3>
                        </BoxHeader>
                        {renderProgressBar('carbs')}
                    </Box>

                    <Box>
                        <BoxHeader>
                            <h1>{fat}</h1>
                            <span>g</span>
                            <h3>Fat</h3>
                        </BoxHeader>
                        {renderProgressBar('fat')}
                    </Box>
                </Overview>

                <Overview>
                    <Notes day={day} index={dayIndex} />
                    <MealForm day={day} index={dayIndex} />
                </Overview>

                <MealTable day={day} index={dayIndex} />
            </div>
        </React.Fragment>
    );
};

export default withRouter(connect(mapStateToProps)(Nutrition));
