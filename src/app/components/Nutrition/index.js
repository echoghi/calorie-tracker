import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Loading from '../Loading';
import { useWindowSize } from 'the-platform';
import isEmpty from 'lodash.isempty';
import moment from 'moment';

import Bar from '../ProgressBar/Bar';
import MealTable from './MealTable';
import MealForm from './MealForm';
import Notes from '../Notes';
import {
    NutritionWrapper,
    HeaderWrapper,
    HeaderContent,
    NavIcon,
    Overview,
    Box,
    BoxHeader,
    Grams,
    Content,
} from './styles';
import { ProgressBarConfig, Day, UserData } from '../types';
import { parseUrlDay } from '../Calendar/utils';

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

const mapStateToProps = (state) => ({
    data: state.adminState.data,
    loading: state.adminState.loading,
    userData: state.adminState.userData,
    userLoading: state.adminState.userLoading,
});

const dayShape = {
    day: moment(),
    nutrition: {
        calories: 0,
        carbs: 0,
        fat: 0,
        protein: 0,
    },
};

const Nutrition = ({ data, history }) => {
    const [day, setDay] = useState(dayShape);
    const [dayIndex, setDayIndex] = useState(0);
    const [today, setToday] = useState(true);
    const { width } = useWindowSize();

    // will read the url and set today to true/false
    function isToday() {
        let date = moment();

        if (location.search) {
            date = parseUrlDay();

            setToday(moment().isSame(date, 'day'));
        } else if (today) {
            setToday(true);
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        isToday();
    }, []);

    const loadDay = (date = moment()) => {
        if (location.search) {
            date = parseUrlDay();

            setToday(moment().isSame(date, 'day'));
        } else {
            setToday(true);
        }

        // save the queried day to state
        for (let i = 0; i < data.calendar.length; i++) {
            if (data.calendar[i].day.isSame(date, 'day')) {
                setDay(data.calendar[i]);
                setDayIndex(+i);

                return;
            }
        }
    };

    // fetch data when requested date changes
    useEffect(() => {
        loadDay();
    });

    function ProgressBar({ type }) {
        const { trailColor, color } = progressBarConfig[type];

        const progress = day.nutrition[type] / data.user.goals[type];
        const text = `${Math.round(
            (day.nutrition[type] / data.user.goals[type]) * 100
        )}% of daily goal`;

        const options = {
            className: '',
            color,
            containerStyle: {
                margin: '30px auto',
                width: '80%',
            },
            height: 25,
            text,
            trailColor,
        };

        return <Bar progress={progress} options={options} />;
    }

    function goToToday() {
        setToday(true);

        history.push({ pathname: '/nutrition', search: '' });
    }

    function navigateDayBack() {
        const date = location.search
            ? parseUrlDay().subtract(1, 'days')
            : moment().subtract(1, 'days');

        history.push(`/nutrition?d=${date.format('x')}`);
    }

    function navigateDayForward() {
        if (location.search) {
            const newDate = parseUrlDay().add(1, 'days');

            if (newDate.isSame(moment(), 'day')) {
                history.push({ pathname: '/nutrition', search: '' });
            } else {
                history.push(`/nutrition?d=${newDate.format('x')}`);
            }
        }
    }

    function rewind() {
        setToday(false);
        history.push(`/nutrition?d=${data.calendar[0].day.format('x')}`);
    }

    if (isEmpty(day)) {
        return <Loading />;
    }

    const { protein, carbs, fat } = day.nutrition;

    return (
        <NutritionWrapper>
            <HeaderWrapper>
                <HeaderContent>
                    <h1>Nutrition</h1>
                </HeaderContent>
                <HeaderContent>
                    <NavIcon
                        className="icon-chevrons-left"
                        active={dayIndex !== 0}
                        onClick={rewind}
                    />
                    <NavIcon
                        className="icon-chevron-left"
                        onClick={navigateDayBack}
                        active={dayIndex !== 0}
                    />
                    <h3>{!isEmpty(day.day) ? day.day.format('dddd, MMMM Do, YYYY') : ''}</h3>
                    <NavIcon
                        className="icon-chevron-right"
                        active={!today}
                        onClick={navigateDayForward}
                    />
                    <NavIcon className="icon-chevrons-right" active={!today} onClick={goToToday} />
                </HeaderContent>
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
        </NutritionWrapper>
    );
};

export default withRouter(connect(mapStateToProps)(Nutrition));
