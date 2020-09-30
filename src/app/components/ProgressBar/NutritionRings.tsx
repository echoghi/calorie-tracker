import React, { Fragment } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { NutritionRingContainer } from './styles';
import moment from 'moment';
import config from '@config';

interface NutritionRings {
    goals: {
        fat: number;
        carbs: number;
        calories: number;
        protein: number;
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
}

interface RingProps {
    value: number;
    color: string;
    trailColor: string;
    radius: number;
}

const Ring = styled.circle`
    stroke-dasharray: ${(props) => props.circumference};
    stroke-linecap: round;
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    animation: ${(props) => (props.animate ? props.animation : 'none')};
    stroke-dashoffset: ${(props) => props.dashoffset};
    stroke: ${(props) => props.color}
    stroke-width: 6;
    fill: none;
`;

const progress = (val: number, total: number) => (val / total > 1 ? 1 : val / total);

const NutritionRings = ({ day, goals, ...props }: NutritionRings) => {
    const { calories, protein, carbs, fat } = day.nutrition;
    // progress
    const calorieProgress = progress(calories, goals.calories);
    const proteinProgress = progress(protein, goals.protein);
    const carbProgress = progress(carbs, goals.carbs);
    const fatProgress = progress(fat, goals.fat);
    // animate today's rings only
    const animate = moment().isSame(day.day, 'day');

    // circle progress component
    const NutritionRing = ({ value, color, trailColor, radius }: RingProps) => {
        // circumference
        const circumference = 2 * Math.PI * radius;
        // stroke-dashoffset
        const dashoffset = circumference * (1 - value);
        // keyframes
        const dash = keyframes`
            from {
                stroke-dashoffset: 1000;
                stroke-dasharray: 1000;
            }
            to {
                stroke-dashoffset: ${dashoffset};
                stroke-dasharray: ${circumference};
            }
        `;
        // animation
        const animation = css`
            ${dash} 1s ease forwards;
        `;

        const ringProps = {
            animate,
            animation,
            circumference,
            color,
            dashoffset
        };

        return (
            <Fragment>
                <circle cx={45} cy={45} r={radius} fill="none" stroke={trailColor} strokeWidth={6} />
                <Ring cx={45} cy={45} r={radius} {...ringProps} />
            </Fragment>
        );
    };

    return (
        <NutritionRingContainer {...props} key={`${day.day.utc}`} id="nutrition-ring-container">
            <svg width={90} height={90} viewBox="0 0 90 90">
                {/* Calories */}
                <NutritionRing
                    color={config.palette.macros.calorie.color}
                    trailColor={config.palette.macros.calorie.trailColor}
                    radius={42}
                    value={calorieProgress}
                />

                {/* Protein */}
                <NutritionRing
                    color={config.palette.macros.protein.color}
                    trailColor={config.palette.macros.protein.trailColor}
                    radius={32}
                    value={proteinProgress}
                />

                {/* Carbs */}
                <NutritionRing
                    color={config.palette.macros.carbs.color}
                    trailColor={config.palette.macros.carbs.trailColor}
                    radius={22.5}
                    value={carbProgress}
                />

                {/* Fat */}
                <NutritionRing
                    color={config.palette.macros.fat.color}
                    trailColor={config.palette.macros.fat.trailColor}
                    radius={12.5}
                    value={fatProgress}
                />
            </svg>
        </NutritionRingContainer>
    );
};

export default NutritionRings;
