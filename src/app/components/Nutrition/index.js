import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import withFirebase from '../HOC/withFirebase';
import moment from 'moment';
import queryString from 'query-string';
import isEmpty from 'lodash.isempty';
import produce from 'immer';
// Components
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Bar from '../ProgressBar/Bar';
import MealTable from './MealTable';
import MealForm from './MealForm';
import Notes from './Notes';
import { HeaderWrapper } from './styles';
import ConfirmationDialog from './ConfirmationDialog';
import { errorNotification, successNotification, warningNotification } from '../actions';

// Reusable validation constuctor for each input
const inputObj = class {
    constructor(required) {
        this.required = required;
        this.valid = !required;
        this.dirty = false;
    }
};

const mapStateToProps = state => ({
    userData: state.adminState.userData,
    data: state.adminState.data,
    snackbar: state.notificationState.open
});

const mapDispatchToProps = dispatch => ({
    errorNotification: message => dispatch(errorNotification(message)),
    successNotification: message => dispatch(successNotification(message)),
    warningNotification: message => dispatch(warningNotification(message))
});

const Nutrition = ({
    location,
    userData,
    data,
    loadDay,
    history,
    snackbar,
    errorNotification,
    successNotification
}) => {
    const [state, setState] = React.useState({
        requestedDate: null,
        mounted: false,
        day: {},
        formattedDay: {},
        todayButton: false,
        dayRef: {},
        deleteMeal: null,
        validation: {
            name: new inputObj(true),
            servings: new inputObj(true),
            calories: new inputObj(true),
            protein: new inputObj(true),
            carbs: new inputObj(true),
            fat: new inputObj(true)
        }
    });

    // load user data
    React.useEffect(
        () => {
            if (!isEmpty(userData)) {
                mapDayToState(userData);
            }
        },
        [snackbar]
    );

    // parse requested day
    React.useEffect(() => {
        if (location.search) {
            const parsed = queryString.parse(location.search);
            saveDateQuery(moment(parseInt(parsed.d)));
        }
        window.scrollTo(0, 0);
    }, []);

    const mapDayToState = userData => {
        const { today, requestedDate } = state;

        if (today) {
            history.push({ pathname: '/nutrition', search: '' });
        }

        const { day, todayButton, formattedDay, dayRef } = loadDay(userData, requestedDate);

        const nextState = produce(state, draftState => {
            draftState.todayButton = todayButton;
            draftState.day = day;
            draftState.formattedDay = formattedDay;
            draftState.dayRef = dayRef;
        });

        setState(nextState);
    };

    const removeMeal = index => {
        const { dayRef, day } = state;

        const mealData = produce(day, data => {
            const meal = data.nutrition.meals[index];

            for (let name in day.nutrition) {
                if (name !== 'meals') {
                    data.nutrition[name] -= meal[name] * meal.servings;
                }
            }

            data.nutrition.meals = data.nutrition.meals.filter(
                meal => meal !== data.nutrition.meals[index]
            );
        });

        dayRef.set(mealData, error => {
            if (error) {
                errorNotification();
            } else {
                // trigger success notification
                successNotification('Meal Removed');

                const nextState = produce(state, draftState => {
                    draftState.confirmationDialog = false;
                    draftState.deleteMeal = null;
                });

                setState(nextState);
            }
        });
    };

    function closeConfirmationDialog() {
        const nextState = produce(state, draftState => {
            draftState.confirmationDialog = false;
        });

        setState(nextState);
    }

    function renderProgressBar(type) {
        let color;
        let progress;
        let text;

        if (type === 'protein') {
            color = '#F5729C';
            progress = day.nutrition.protein / data.user.goals.protein;
            text = day.nutrition.protein / data.user.goals.protein;
        } else if (type === 'carbs') {
            color = '#7BD4F8';
            progress = day.nutrition.carbs / data.user.goals.carbs;
            text = day.nutrition.carbs / data.user.goals.carbs;
        } else {
            color = '#55F3B3';
            progress = day.nutrition.fat / data.user.goals.fat;
            text = day.nutrition.fat / data.user.goals.fat;
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

    const { day, confirmationDialog, formattedDay, todayButton, deleteMeal, dayRef } = state;

    const { protein, carbs, fat } = day.nutrition || 0;

    function goToToday() {
        const nextState = produce(state, draftState => {
            draftState.today = true;
            draftState.requestedDate = null;
        });

        setState(nextState);
        mapDayToState(userData);
    }

    function renderActions(index) {
        const clickHandler = () => {
            const nextState = produce(state, draftState => {
                draftState.confirmationDialog = true;
                draftState.deleteMeal = index;
            });

            setState(nextState);
        };

        return (
            <IconButton onClick={clickHandler}>
                <i className="icon-trash-2" />
            </IconButton>
        );
    }

    return (
        <React.Fragment>
            {!isEmpty(day) && !isEmpty(data) && (
                <div className="nutrition">
                    <HeaderWrapper>
                        <div>
                            <h1>Nutrition</h1>
                            <h3>{formattedDay.day.format('dddd, MMMM Do YYYY')}</h3>
                        </div>
                        <div>
                            {todayButton && (
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
                    <div className="nutrition__overview">
                        <div className="nutrition__overview--box">
                            <div className="nutrition__overview--head">
                                <h1>{protein}</h1>
                                <span>g</span>
                                <h3>Protein</h3>
                            </div>
                            {renderProgressBar('protein')}
                        </div>

                        <div className="nutrition__overview--box">
                            <div className="nutrition__overview--head">
                                <h1>{carbs}</h1>
                                <span>g</span>
                                <h3>Carbohydrates</h3>
                            </div>
                            {renderProgressBar('carbs')}
                        </div>

                        <div className="nutrition__overview--box">
                            <div className="nutrition__overview--head">
                                <h1>{fat}</h1>
                                <span>g</span>
                                <h3>Fat</h3>
                            </div>
                            {renderProgressBar('fat')}
                        </div>
                    </div>
                    <div className="nutrition__overview">
                        <Notes day={day} dayRef={dayRef} />
                        <MealForm day={day} dayRef={dayRef} />
                    </div>

                    <MealTable day={day} ata={data} actions={renderActions} />
                </div>
            )}

            {confirmationDialog && (
                <ConfirmationDialog
                    open={confirmationDialog}
                    action={() => removeMeal(deleteMeal)}
                    onClose={closeConfirmationDialog}
                    name={
                        day.nutrition.meals ? `"${day.nutrition.meals[deleteMeal].name}"` : 'Meal'
                    }
                />
            )}
        </React.Fragment>
    );
};

export default withFirebase(
    withRouter(
        connect(
            mapStateToProps,
            mapDispatchToProps
        )(Nutrition)
    )
);
