import styled from 'styled-components';

const CircleContainer = styled.div`
    position: relative;

    &:first-child {
        margin-top: 3px;
    }
`;

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

const Layer = styled.div`
    position: relative;
    height: 100%;

    &:first-child {
        transition: 0.4s linear;
        transition-property: width, background-color;
    }
`;

export { CircleContainer, Container, Text, BarWrapper, Layer };
