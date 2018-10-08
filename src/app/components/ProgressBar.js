import React from 'react';
import styled from 'styled-components';

const Text = styled.span`
    font-size: 1rem;
    height: 15px;
    padding: 0;
    margin: 5px 0;
`;

const Container = styled.div`
    width: ${props => props.width};
    margin: ${props => props.margin};
`;

const BarWrapper = styled.div`
    width: 100%;
    margin: 0 auto;
    height: ${props => props.height}px;
    max-height: ${props => props.height}px;
`;

const Bar = styled.div`
    position: relative;
    height: 100%;

    &:first-child {
        transition: 0.4s linear;
        transition-property: width, background-color;
    }
`;

const renderBarBackground = (progress, options) => {
    if (progress > 1) {
        return `repeating-linear-gradient(135deg, ${options.color}, ${
            options.color
        } 10px, #5e639a 10px, #5e639a 20px`;
    } else {
        return options.color;
    }
};

const ProgressBar = ({ options, progress }) => (
    <Container width={options.containerStyle.width} margin={options.containerStyle.margin}>
        <BarWrapper height={options.height}>
            <Bar
                style={{
                    height: '100%',
                    width: progress > 1 ? '100%' : `${progress * 100}%`,
                    background: renderBarBackground(progress, options),
                    marginBottom: `-${options.height}px`,
                    zIndex: '2'
                }}
            />
            <Bar
                style={{
                    width: '100%',
                    height: `${options.height}px`,
                    background: options.trailColor
                }}
            />
        </BarWrapper>
        <Text style={options.text.style}>{options.text.value}</Text>
    </Container>
);

export default ProgressBar;
