import React, { memo } from 'react';
import moment from 'moment';
import { DayOverview, CalorieCircle, ProteinCircle, CarbCircle, FatCircle } from './styles';

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
    onClick?: () => void;
}

const NutritionRings = ({ data, day, context, onClick }: NutritionRings) => {
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
            <CalorieCircle
                key={`${day.day.utc}-0`}
                progress={calories / data.user.goals.calories}
                size={90}
                animate={animate}
                strokeWidth={6}
                color="#FFAB3E"
                trailColor="#FFE9C6"
            />
            <ProteinCircle
                key={`${day.day.utc}-1`}
                progress={protein / data.user.goals.protein}
                size={70}
                animate={animate}
                strokeWidth={6}
                color="#32C9D5"
                trailColor="#E6FDF3"
            />
            <CarbCircle
                key={`${day.day.utc}-2`}
                progress={carbs / data.user.goals.carbs}
                size={50}
                animate={animate}
                strokeWidth={5}
                color="#5B6AEE"
                trailColor="#D0D4FA"
            />
            <FatCircle
                key={`${day.day.utc}-3`}
                progress={fat / data.user.goals.fat}
                size={30}
                animate={animate}
                strokeWidth={5}
                color="#F08EC1"
                trailColor="#FCDFED"
            />
        </DayOverview>
    );
};

export default memo(NutritionRings);
