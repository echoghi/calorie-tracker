import React from 'react';
import Fade from '@material-ui/core/Fade';
import { Summary, Meals, Meal, MealHeader } from './styles';
import { Day } from '../types';

const DaySummary = ({ day }: { day: Day }) => {
    function displayMealName(meal: string) {
        if (meal.length > 40) {
            return `${meal.substring(0, 40)}..`;
        } else {
            return meal;
        }
    }

    return (
        <Fade in={true}>
            <Summary>
                <h2>{day.day.format('MMMM Do')}</h2>
                <MealHeader>
                    <h3>Meals</h3>
                    <h4>{`${day.nutrition.calories} cal`}</h4>
                </MealHeader>
                <Meals>
                    {day.nutrition.meals &&
                        day.nutrition.meals.map(meal => {
                            return (
                                <Meal key={meal.name}>
                                    <span>{displayMealName(meal.name)}</span>
                                    <span>{`${meal.calories * meal.servings} cal`}</span>
                                </Meal>
                            );
                        })}
                </Meals>
            </Summary>
        </Fade>
    );
};

export default DaySummary;
