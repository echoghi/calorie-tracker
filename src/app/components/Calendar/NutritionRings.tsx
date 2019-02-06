import React from 'react';
import moment from 'moment';
import Circle from '../ProgressBar/Circle';
import { DayOverview } from './styles';
import { useWindowSize } from 'the-platform';

interface NutritionRings {
    data: {
        user: {
            goals: {
                fat: number;
                carbs: number;
                calories: number;
                protein: number;
            };
        };
    };
    day: {
        nutrition: {
            fat: number;
            calories: number;
            carbs: number;
            protein: number;
        };
        day: moment.Moment;
    };
    context: moment.Moment;
    onClick: () => void;
}

const NutritionRings = React.memo(({ data, day, context, onClick }: NutritionRings) => {
    const { width } = useWindowSize();
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
        <DayOverview onClick={onClick}>
            <Circle
                progress={calories / data.user.goals.calories}
                size={width < 768 ? 30 : 90}
                animate={animate}
                strokeWidth={width < 768 ? 2 : 6}
                color="#FFAB3E"
                trailColor="#FFE9C6"
                style={{
                    position: 'relative',
                    transform:
                        width < 768
                            ? 'translateY(0px) translateX(-0.5px)'
                            : 'translateY(0) translateX(0)'
                }}
            />
            <Circle
                progress={protein / data.user.goals.protein}
                size={width < 768 ? 23 : 70}
                animate={animate}
                strokeWidth={width < 768 ? 2 : 6}
                color="#32C9D5"
                trailColor="#E6FDF3"
                style={{
                    position: 'relative',
                    transform:
                        width < 768
                            ? 'translateY(-32.5px) translateX(-.5px)'
                            : 'translateY(-87px) translateX(1px)'
                }}
            />
            <Circle
                progress={carbs / data.user.goals.carbs}
                size={width < 768 ? 16 : 50}
                animate={animate}
                strokeWidth={width < 768 ? 1 : 5}
                color="#5B6AEE"
                trailColor="#D0D4FA"
                style={{
                    position: 'relative',
                    transform:
                        width < 768
                            ? 'translateY(-58px) translateX(0px)'
                            : 'translateY(-153px) translateX(1px)'
                }}
            />
            <Circle
                progress={fat / data.user.goals.fat}
                size={width < 768 ? 10 : 30}
                animate={animate}
                strokeWidth={width < 768 ? 1 : 5}
                color="#F08EC1"
                trailColor="#FCDFED"
                style={{
                    position: 'relative',
                    transform:
                        width < 768
                            ? 'translateY(-82px) translateX(0px)'
                            : 'translateY(-199px) translateX(1px)'
                }}
            />
        </DayOverview>
    );
});

export default NutritionRings;