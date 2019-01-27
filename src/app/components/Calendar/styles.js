import styled from 'styled-components';

const Icon = styled.i`
    position: absolute;
    height: 22px;
    width: 22px;
    box-sizing: border-box;
    padding: 1px 4px;
    top: 15px;
    right: 10px;
    font-size: 14px;
    text-align: center;
    border-radius: 50%;

    &.icon-feather {
        background: #ece7fe;
        color: #6031e1;
    }

    &.icon-star-full {
        color: #ffba00;
        background: #ffefe7;
    }

    &.legend {
        position: relative;
        min-width: 0;
        top: 0;
        right: 0;
        margin: 0;
        border: none;
        margin-left: -2px;
    }

    &:before {
        vertical-align: middle;
    }
`;

export { Icon };
