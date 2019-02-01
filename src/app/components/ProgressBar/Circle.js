import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { CircleContainer } from './styles';

const Circle = React.memo(({ progress, color, style, animate, size, strokeWidth }) => {
    progress = progress > 1 ? 1 : progress;

    const radius = size / 2 - strokeWidth / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference * (1 - progress);

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

    const animation = () =>
        css`
            ${dash} 1s ease forwards;
        `;

    const ProgressCircle = styled.circle`
        stroke-dasharray: ${circumference};
        stroke-linecap: round;
        transform: rotate(-90deg);
        transform-origin: 50% 50%;
        animation: ${props => (props.animate ? animation : 'none')};
        stroke-dashoffset: ${dashoffset};
        stroke: ${color};
        stroke-width: ${strokeWidth};
        fill: none;
    `;

    return (
        <CircleContainer key={`${Math.random()}`}>
            <svg width={size} height={size} style={style} viewBox={`0 0 ${size} ${size}`}>
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="#f4f4f4"
                    strokeWidth={strokeWidth}
                />
                <ProgressCircle cx={center} cy={center} r={radius} animate={animate} />
            </svg>
        </CircleContainer>
    );
});

export default Circle;
