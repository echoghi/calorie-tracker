import styled from 'styled-components';

const CircleContainer = styled.div`
    position: relative;
`;

const Text = styled.span`
    font-size: 1rem;
    height: 15px;
    padding: 0;
    margin: 5px 0;
    color: #a2a7d9;

    @media (max-width: 768px) {
        font-size: 11px;
        margin: 0;
    }
`;

const BarWrapper = styled.div`
    width: 100%;
    margin: 0 auto;
    height: ${props => props.height}px;
    max-height: ${props => props.height}px;

    @media (max-width: 768px) {
        height: 15px;
        max-height: 15px;
    }
`;

const Progress = styled.div`
    position: relative;
    transition: 0.4s linear;
    transition-property: width, background-color;
    margin-bottom: -${props => props.height}px;
    height: 100%;
    z-index: 2;

    @media (max-width: 768px) {
        margin-bottom: -15px;
    }
`;

const Trail = styled.div`
    position: relative;
    transition: 0.4s linear;
    transition-property: width, background-color;
    width: 100%;
    height: ${props => props.height}px;
    background-color: ${props => props.color};

    @media (max-width: 768px) {
        height: 15px;
    }
`;

export { CircleContainer, Text, BarWrapper, Progress, Trail };
