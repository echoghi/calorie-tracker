import React from 'react';
import { Text, Container, BarWrapper, Layer } from './styles';

interface Bar {
    progress: number;
    options: {
        height: number;
        trailColor: string;
        color: string;
        text: {
            value: string;
            style: object;
        };
        containerStyle: React.CSSProperties;
    };
}

const Bar = ({ options, progress }: Bar) => {
    function renderBarBackground() {
        if (progress > 1) {
            return `repeating-linear-gradient(135deg, ${options.color}, ${
                options.color
            } 10px, #5e639a 10px, #5e639a 20px`;
        } else {
            return options.color;
        }
    }

    return (
        <Container width={options.containerStyle.width} margin={options.containerStyle.margin}>
            <BarWrapper height={options.height}>
                <Layer
                    style={{
                        background: renderBarBackground(),
                        height: '100%',
                        marginBottom: `-${options.height}px`,
                        width: progress > 1 ? '100%' : `${progress * 100}%`,
                        zIndex: '2'
                    }}
                />
                <Layer
                    style={{
                        background: options.trailColor,
                        height: `${options.height}px`,
                        width: '100%'
                    }}
                />
            </BarWrapper>
            <Text style={options.text.style}>{options.text.value}</Text>
        </Container>
    );
};

export default Bar;
