import React, { useState, Fragment, useCallback } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Loading from '../Loading';
import { useWindowSize } from 'the-platform';
import isEmpty from 'lodash.isempty';
import moment from 'moment';
// Components
import Button from '@material-ui/core/Button';
import Bar from '../ProgressBar/Bar';
import MealTable from './MealTable';
import queryString from 'query-string';
import MealForm from './MealForm';
import Notes from '../Notes';
import { HeaderWrapper, Overview, Box, BoxHeader, Grams, Content } from './styles';
import { RootState, ProgressBarConfig, Day, UserData } from '../types';

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

const dayShape: Day = {
    day: moment(),
    nutrition: {
        calories: 0,
        carbs: 0,
        fat: 0,
        protein: 0
    }
};

interface NutritionProps extends RouteComponentProps {
    data: UserData;
}

const Nutrition = ({ data, history }: NutritionProps) => {
    const [day, setDay] = useState(dayShape);
    const [dayIndex, setDayIndex] = useState(0);
    const [today, setToday] = useState(true);
    const { width } = useWindowSize();

    // fetch data when requested date changes
    useCallback(() => {
        loadDay();
    }, [loadDay]);

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

    function ProgressBar({ type }: { type: 'calories' | 'protein' | 'fat' | 'carbs' }) {
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
            text,
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
        <Fragment>
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
                            <Grams>g</Grams>
                            <h3>Protein</h3>
                        </BoxHeader>

                        <ProgressBar type="protein" />
                    </Box>

                    <Box>
                        <BoxHeader>
                            <h1>{carbs}</h1>
                            <Grams>g</Grams>
                            <h3>{width < 768 ? 'Carbs' : 'Carbohydrates'}</h3>
                        </BoxHeader>

                        <ProgressBar type="carbs" />
                    </Box>

                    <Box>
                        <BoxHeader>
                            <h1>{fat}</h1>
                            <Grams>g</Grams>
                            <h3>Fat</h3>
                        </BoxHeader>

                        <ProgressBar type="fat" />
                    </Box>
                </Overview>

                <Content>
                    <Notes day={day} index={dayIndex} />
                    <MealForm day={day} index={dayIndex} />
                </Content>

                <MealTable day={day} index={dayIndex} />
            </div>
        </Fragment>
    );
};

export default withRouter(connect(mapStateToProps)(Nutrition));
