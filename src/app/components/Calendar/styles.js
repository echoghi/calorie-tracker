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

const DayOverview = styled.div`
    margin: -20px auto;
    text-align: center;
    height: 100px;
    overflow: hidden;

    @media (max-width: 768px) {
        margin: auto;
        height: 30px;
    }
`;

const ToggleMonth = styled.div`
    text-align: center;
    margin-right: 270px;

    @media (max-width: 768px) {
        display: flex;
        justify-content: space-between;
        margin: 0 auto;
    }

    i {
        display: inline-block;
        cursor: pointer;
        vertical-align: sub;
        font-size: 25px;
        opacity: 0.8;

        @media (max-width: 768px) {
            font-size: 35px;
        }
    }

    h2 {
        display: inline-block;
        vertical-align: middle;
        padding: 10px;
        margin: 0;

        @media (max-width: 768px) {
            display: flex;
            align-items: center;
        }
    }
`;

const Summary = styled.div`
    padding: 15px;
    background: #ffffff;

    h2 {
        color: rgb(0, 132, 137);
    }
`;

const Meals = styled.div``;

const MealHeader = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Meal = styled.div`
    padding: 15px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e6edef;

    span:first-child {
        flex-grow: 2;
    }
`;

export { Icon, DayOverview, ToggleMonth, Summary, Meals, Meal, MealHeader };
