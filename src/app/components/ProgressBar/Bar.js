import React from 'react';
import { Text, Container, BarWrapper, Layer } from './styles';

const renderBarBackground = (progress, options) => {
    if (progress > 1) {
        return `repeating-linear-gradient(135deg, ${options.color}, ${
            options.color
        } 10px, #5e639a 10px, #5e639a 20px`;
    } else {
        return options.color;
    }
};

const Bar = ({ options, progress }) => (
    <Container width={options.containerStyle.width} margin={options.containerStyle.margin}>
        <BarWrapper height={options.height}>
            <Layer
                style={{
                    height: '100%',
                    width: progress > 1 ? '100%' : `${progress * 100}%`,
                    background: renderBarBackground(progress, options),
                    marginBottom: `-${options.height}px`,
                    zIndex: '2'
                }}
            />
            <Layer
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

export default Bar;
