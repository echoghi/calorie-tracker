import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Loading from '../Loading';
import { useWindowSize } from 'the-platform';
import isEmpty from 'lodash.isempty';
import moment from 'moment';
// Components
import Bar from '../ProgressBar/Bar';
import MealTable from './MealTable';
import queryString from 'query-string';
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
    Content
} from './styles';
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

    // will read the url and set today to true/false
    function isToday() {
        let date = moment();

        if (location.search) {
            const parsed = queryString.parse(location.search);
            date = moment(parseInt(parsed.d, 10));

            setToday(moment().isSame(date, 'day'));
        } else if (today) {
            setToday(true);
        }
    }

    function saveDayToState() {}

    useEffect(() => {
        window.scrollTo(0, 0);
        isToday();
    }, []);

    const loadDay = (date: moment.Moment = moment()) => {
        if (location.search) {
            const parsed = queryString.parse(location.search);

            date = moment(parseInt(parsed.d, 10));

            setToday(moment().isSame(date, 'day'));
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

    function navigateDayBack() {
        let parsed: any;
        let date: moment.Moment;

        if (location.search) {
            parsed = queryString.parse(location.search);
            // set day to one previous
            date = moment(parseInt(parsed.d, 10)).subtract(1, 'days');
        } else {
            // set day to today
            date = moment().subtract(1, 'days');
        }

        history.push(`/nutrition?d=${date.format('x')}`);
    }

    function navigateDayForward() {
        let parsed: any;
        let date: moment.Moment;

        if (location.search) {
            parsed = queryString.parse(location.search);
            // set day to one previous
            date = moment(parseInt(parsed.d, 10)).add(1, 'days');
        } else {
            // set day to today
            date = moment().add(1, 'days');
        }

        history.push(`/nutrition?d=${date.format('x')}`);
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
