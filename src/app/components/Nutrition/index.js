import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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

// Reusable validation constuctor for each input
const inputObj = class {
    constructor(required) {
        this.required = required;
        this.valid = !required;
        this.dirty = false;
    }
};

const mapStateToProps = state => ({
    data: state.adminState.data,
    loading: state.adminState.loading,
    userData: state.adminState.userData,
    userLoading: state.adminState.userLoading
});

const Nutrition = ({ data, history }) => {
    const [state, setState] = React.useState({
        day: {
            nutrition: {},
            fitness: {},
            day: {}
        },
        todayButton: false,
        validation: {
            name: new inputObj(true),
            servings: new inputObj(true),
            calories: new inputObj(true),
            protein: new inputObj(true),
            carbs: new inputObj(true),
            fat: new inputObj(true)
        }
    });

    React.useEffect(() => {
        loadDay();
    }, []);

    // fetch data when requested date changes
    React.useEffect(
        () => {
            loadDay();
        },
        [location.search, data]
    );

    function loadDay() {
        const nextState = produce(state, draftState => {
            let requestedDate = false;

            if (location.search) {
                const parsed = queryString.parse(location.search);
                requestedDate = moment(parseInt(parsed.d));

                draftState.todayButton = true;
            }

            if (requestedDate) {
                for (let day in data.calendar) {
                    const calendarDay = data.calendar[day];

                    if (calendarDay.day.isSame(requestedDate)) {
                        draftState.day = calendarDay;
                        draftState.dayIndex = day;
                    }
                }
            } else {
                const dayIndex = Object.keys(data.calendar).length - 1;

                draftState.dayIndex = dayIndex;

                draftState.day = data.calendar[dayIndex];
            }
        });

        setState(nextState);
    }

    function renderProgressBar(type) {
        let color;
        let progress;
        let text;

        if (type === 'protein') {
            color = '#F5729C';
            progress = state.day.nutrition.protein / data.user.goals.protein;
            text = state.day.nutrition.protein / data.user.goals.protein;
        } else if (type === 'carbs') {
            color = '#7BD4F8';
            progress = state.day.nutrition.carbs / data.user.goals.carbs;
            text = state.day.nutrition.carbs / data.user.goals.carbs;
        } else {
            color = '#55F3B3';
            progress = state.day.nutrition.fat / data.user.goals.fat;
            text = state.day.nutrition.fat / data.user.goals.fat;
        }

        text = `${Math.round(text * 100)}% of daily goal`;

        const options = {
            height: 25,
            color: color,
            trailColor: '#f4f4f4',
            containerStyle: {
                width: '80%',
                margin: '30px auto'
            },
            className: '',
            text: {
                value: text,
                style: {
                    fontSize: '1rem',
                    color: '#a2a7d9',
                    margin: '10px 0 0 0'
                }
            }
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
