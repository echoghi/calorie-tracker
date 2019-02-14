import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import produce from 'immer';
import Loading from '../Loading';
import isEmpty from 'lodash.isempty';
import moment from 'moment';
// Components
import Button from '@material-ui/core/Button';
import Bar from '../ProgressBar/Bar';
import MealTable from './MealTable';
import queryString from 'query-string';
import MealForm from './MealForm';
import Notes from './Notes';
import { HeaderWrapper, Overview, Box, BoxHeader } from './styles';

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

// Reusable validation constuctor for each input
const inputObj = class {
    required: boolean;
    valid: boolean;
    dirty: boolean;

    constructor(required: boolean) {
        this.required = required;
        this.valid = !required;
        this.dirty = false;
    }
};

const mapStateToProps = (state: any) => ({
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
    const [state, setState] = React.useState({
        day: {
            day: null,
            nutrition: null
        },
        dayIndex: 0,
        requestedDate: null,
        today: false,
        todayButton: false,
        validation: {
            calories: new inputObj(true),
            carbs: new inputObj(true),
            fat: new inputObj(true),
            name: new inputObj(true),
            protein: new inputObj(true),
            servings: new inputObj(true)
        }
    });

    React.useEffect(() => {
        loadDay();
    }, []);

    // fetch data when requested date changes
    React.useEffect(() => {
        loadDay();
    }, [location.search, data]);

    function loadDay() {
        const nextState = produce(state, draftState => {
            let requestedDate: moment.Moment;

            if (location.search) {
                const parsed = queryString.parse(location.search);
                requestedDate = moment(parseInt(parsed.d, 10));

                draftState.todayButton = true;
            }

            if (requestedDate) {
                let index: number;
                for (const calendarDay of data.calendar) {
                    index++;
                    if (calendarDay.day.isSame(requestedDate)) {
                        draftState.day = calendarDay;
                        draftState.dayIndex = index;
                    }
                }
            } else {
                const lastIndex = Object.keys(data.calendar).length - 1;

                draftState.dayIndex = lastIndex;

                draftState.day = data.calendar[lastIndex];
            }
        });

        setState(nextState);
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
        const nextState = produce(state, draftState => {
            draftState.today = true;
            draftState.todayButton = false;
            draftState.requestedDate = null;
        });

        history.push({ pathname: '/nutrition', search: '' });

        setState(nextState);
    }

    if (isEmpty(state.day.day)) {
        return <Loading />;
    }

    const { day, dayIndex } = state;
    const { protein, carbs, fat } = day.nutrition || 0;

    return (
        <React.Fragment>
            <div className="nutrition">
                <HeaderWrapper>
                    <div>
                        <h1>Nutrition</h1>
                        <h3>{!isEmpty(day.day) ? day.day.format('dddd, MMMM Do YYYY') : ''}</h3>
                    </div>
                    <div>
                        {state.todayButton && (
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
