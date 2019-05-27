import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { NutritionRingContainer } from './styles';
import moment from 'moment';

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

const progress = (val: number, total: number) => (val / total > 1 ? 1 : val / total);
const dashOffSet = (circumference: number, progressVal: number) =>
    circumference * (1 - progressVal);
const calcCircumference = (r: number) => 2 * Math.PI * r;
const calcKeyframes = (circumference: number, dashOffSetVal: number) => keyframes`
from {
    stroke-dashoffset: 1000;
    stroke-dasharray: 1000;
}
to {
    stroke-dashoffset: ${dashOffSetVal};
    stroke-dasharray: ${circumference};
}
`;

const calcAnimation = (keyframe: any) =>
    css`
        ${keyframe} 1s ease forwards;
    `;

const NutritionRings = ({ day, goals, ...props }: NutritionRings) => {
    const { calories, protein, carbs, fat } = day.nutrition;
    const calorieProgress = progress(calories, goals.calories);
    const proteinProgress = progress(protein, goals.protein);
    const carbProgress = progress(carbs, goals.carbs);
    const fatProgress = progress(fat, goals.fat);

    const now = moment();
    let animate = false;

    // Only animate today's calendar box
    if (now.isSame(day.day, 'day')) {
        animate = true;
    }

    // circumference
    const calorieCircumference = calcCircumference(42);
    const proteinCircumference = calcCircumference(32);
    const carbCircumference = calcCircumference(22.5);
    const fatCircumference = calcCircumference(12.5);

    // stroke-dashoffset
    const calorieDashoffset = dashOffSet(calorieCircumference, calorieProgress);
    const proteinDashoffset = dashOffSet(proteinCircumference, proteinProgress);
    const carbDashoffset = dashOffSet(carbCircumference, carbProgress);
    const fatDashoffset = dashOffSet(fatCircumference, fatProgress);

    // keyframes
    const calorieDash = calcKeyframes(calorieCircumference, calorieDashoffset);
    const proteinDash = calcKeyframes(proteinCircumference, proteinDashoffset);
    const carbDash = calcKeyframes(carbCircumference, carbDashoffset);
    const fatDash = calcKeyframes(fatCircumference, fatDashoffset);

    // animations
    const calorieAnimation = calcAnimation(calorieDash);
    const proteinAnimation = calcAnimation(proteinDash);
    const carbAnimation = calcAnimation(carbDash);
    const fatAnimation = calcAnimation(fatDash);

    const CalorieCircle = styled.circle`
        stroke-dasharray: ${calorieCircumference};
        stroke-linecap: round;
        transform: rotate(-90deg);
        transform-origin: 50% 50%;
        animation: ${cprops => (cprops.animate ? calorieAnimation : 'none')};
        stroke-dashoffset: ${calorieDashoffset};
        stroke: #ffab3e;
        stroke-width: 6;
        fill: none;
    `;

    const ProteinCircle = styled.circle`
        stroke-dasharray: ${proteinCircumference};
        stroke-linecap: round;
        transform: rotate(-90deg);
        transform-origin: 50% 50%;
        animation: ${cprops => (cprops.animate ? proteinAnimation : 'none')};
        stroke-dashoffset: ${proteinDashoffset};
        stroke: #32c9d5;
        stroke-width: 6;
        fill: none;
    `;

    const CarbCircle = styled.circle`
        stroke-dasharray: ${carbCircumference};
        stroke-linecap: round;
        transform: rotate(-90deg);
        transform-origin: 50% 50%;
        animation: ${cprops => (cprops.animate ? carbAnimation : 'none')};
        stroke-dashoffset: ${carbDashoffset};
        stroke: #5b6aee;
        stroke-width: 6;
        fill: none;
    `;

    const FatCircle = styled.circle`
        stroke-dasharray: ${fatCircumference};
        stroke-linecap: round;
        transform: rotate(-90deg);
        transform-origin: 50% 50%;
        animation: ${cprops => (cprops.animate ? fatAnimation : 'none')};
        stroke-dashoffset: ${fatDashoffset};
        stroke: #f08ec1;
        stroke-width: 6;
        fill: none;
    `;

    return (
        <NutritionRingContainer {...props} key={`${day.day.utc}`}>
            <svg width={90} height={90} viewBox="0 0 90 90">
                <circle cx={45} cy={45} r={42} fill="none" stroke="#FFE9C6" strokeWidth={6} />
                <CalorieCircle cx={45} cy={45} r={42} animate={animate} />

                <circle cx={45} cy={45} r={32} fill="none" stroke="#E6FDF3" strokeWidth={6} />
                <ProteinCircle cx={45} cy={45} r={32} animate={animate} />

                <circle cx={45} cy={45} r={22.5} fill="none" stroke="#D0D4FA" strokeWidth={6} />
                <CarbCircle cx={45} cy={45} r={22.5} animate={animate} />

                <circle cx={45} cy={45} r={12.5} fill="none" stroke="#FCDFED" strokeWidth={6} />
                <FatCircle cx={45} cy={45} r={12.5} animate={animate} />
            </svg>
        </NutritionRingContainer>
    );
};

export default NutritionRings;
