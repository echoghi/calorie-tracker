import React from 'react';
import moment from 'moment';
import Circle from '../ProgressBar/Circle';

const Day = React.memo(({ data, day, context }) => {
    const { calories, protein, carbs, fat } = day.nutrition;
    const now = moment();
    let animate = false;

    // Only animate today's calendar box
    if (
        now.date() === day.day.date() &&
        now.month() === day.day.month() &&
        now.year() === day.day.year()
    ) {
        if (day.day.month() === context.month()) {
            animate = true;
        }
    }

    return (
        <div className="day__overview">
            <Circle
                progress={calories / data.user.goals.calories}
                size={90}
                animate={animate}
                strokeWidth={6}
                color="#8E81E3"
                style={{
                    transform: 'translateY(-1px) translateX(1px)',
                    position: 'relative'
                }}
            />
            <Circle
                progress={protein / data.user.goals.protein}
                size={70}
                animate={animate}
                strokeWidth={6}
                color="#F5729C"
                style={{
                    transform: 'translateY(-87px) translateX(1px)',
                    position: 'relative'
                }}
            />
            <Circle
                progress={carbs / data.user.goals.carbs}
                size={50}
                animate={animate}
                strokeWidth={5}
                color="#7BD4F8"
                style={{
                    transform: 'translateY(-153px) translateX(1px)',
                    position: 'relative'
                }}
            />
            <Circle
                progress={fat / data.user.goals.fat}
                size={30}
                animate={animate}
                strokeWidth={5}
                color="#55F3B3"
                style={{
                    transform: 'translateY(-199px) translateX(1px)',
                    position: 'relative'
                }}
            />
        </div>
    );
});

export default Day;
