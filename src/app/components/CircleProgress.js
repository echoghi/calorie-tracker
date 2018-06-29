import React from 'react';
import styled, { keyframes } from 'styled-components';

const CircleContainer = styled.div`
    position: relative;
`;

class CircleProgress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hello: false
        };
    }

    renderProgress(height, value) {
        const radius = parseInt(height.split('px')[0]) / 4;
        const circumference = 2 * Math.PI * radius;
        const progress = value / 100;
        const dashoffset = circumference * (1 - progress);

        // console.log('progress:', value + '%', '|', 'offset:', dashoffset);

        return dashoffset;
    }

    render() {
        const { containerStyle, options, animate, progress, containerClassName, key } = this.props;
        const { height, width, xOffSet, yOffSet } = containerStyle;
        const heightNum = height.split('px')[0];
        const widthNum = width.split('px')[0];
        const radius = heightNum / 2 - options.strokeWidth / 2;

        const dash = keyframes`
        to {
            stroke-dashoffset: ${this.renderProgress(height, progress)};
        }
        `;

        const Progress = styled.circle`
            stroke-dasharray: 339.292;
            stroke-dashoffset: 339.292;
            stroke-linecap: round;
            transform: rotate(-90deg);
            transform-origin: 50% 50%;
            transition: stroke-dashoffset 1s linear;
            animation: ${props => (props.animate ? `${dash} 1s linear forwards` : `${dash} 0s linear forwards`)};
        `;

        return (
            <CircleContainer xOffSet={xOffSet} yOffSet={yOffSet} key={key}>
                <svg
                    width={widthNum}
                    height={heightNum}
                    style={{ transform: `translateY(${yOffSet}px) translateX(${xOffSet}px)`, position: 'relative' }}
                    viewBox={`0 0 ${parseInt(widthNum)} ${parseInt(heightNum)}`}
                    className={containerClassName}
                >
                    <circle
                        cx={widthNum / 2}
                        cy={heightNum / 2}
                        r={radius}
                        fill="none"
                        stroke={options.trailColor || '#e6e6e6'}
                        strokeWidth={options.strokeWidth}
                    />
                    <Progress
                        animate={animate}
                        cx={widthNum / 2}
                        cy={heightNum / 2}
                        r={radius}
                        fill="none"
                        stroke={options.color}
                        strokeWidth={options.strokeWidth}
                    />
                </svg>
            </CircleContainer>
        );
    }
}

export default CircleProgress;
