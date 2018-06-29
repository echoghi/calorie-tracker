import React from 'react';
import styled from 'styled-components';

const CircleContainer = styled.div`
    position: relative;

    &:first-child {
        margin-top: 3px;
    }
`;

class CircleProgress extends React.Component {
    constructor(props) {
        super(props);

        const { containerStyle, progress, options } = this.props;
        const { size } = containerStyle;

        const radius = size / 2 - options.strokeWidth / 2;
        const center = size / 2;
        const circumference = 2 * Math.PI * radius;
        const dashoffset = circumference * (1 - progress);

        const Progress = styled.circle`
            stroke-dasharray: ${circumference};
            stroke-linecap: round;
            transform: rotate(-90deg);
            transform-origin: 50% 50%;
            transition: stroke-dashoffset 1s linear;
        `;

        this.state = {
            Progress,
            radius,
            center,
            dashoffset,
            circumference
        };
    }

    render() {
        const { Progress, radius, center, circumference, dashoffset } = this.state;
        const { containerStyle, options, containerClassName } = this.props;
        const { size, xOffSet, yOffSet } = containerStyle;

        const style = {
            strokeDashoffset: dashoffset
        };

        return (
            <CircleContainer xOffSet={xOffSet} yOffSet={yOffSet} key={`${containerClassName}-${Math.random}`}>
                <svg
                    width={size}
                    height={size}
                    style={{ transform: `translateY(${yOffSet}px) translateX(${xOffSet}px)`, position: 'relative' }}
                    viewBox={`0 0 ${size} ${size}`}
                    className={containerClassName}
                >
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke={options.trailColor || '#e6e6e6'}
                        strokeWidth={options.strokeWidth}
                    />
                    <Progress
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        style={style}
                        stroke={options.color}
                        strokeWidth={options.strokeWidth}
                        strokeDasharray={circumference}
                    />
                </svg>
            </CircleContainer>
        );
    }
}

export default CircleProgress;
