import styled from 'styled-components';
import { Menu } from '../Notes/styles';
import { Link } from 'react-router-dom';

const LegendWrapper = styled.div`
    display: inline-block;
    border: 1px solid #e6eaee;
    height: 295px;
    margin: 0 0 0 30px;
    min-width: 200px;
    background: #ffffff;
    vertical-align: top;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);

    @media (max-width: 1024px) {
        display: none;
    }
`;

const LegendHeader = styled.div`
    padding: 15px 20px;
    font-size: 17px;
    font-weight: bold;
    border-bottom: 1px solid #e6eaee;
`;

const LegendBody = styled.div`
    padding: 20px;
    font-size: 15px;
`;

const LegendName = styled.div`
    display: inline-block;
    padding: 0 10px;
    vertical-align: text-bottom;
`;

const LegendCalories = styled.div`
    background: #ffab3e;
    border-radius: 3px;
    height: 16px;
    width: 16px;
    display: inline-block;
`;

const LegendProtein = styled.div`
    background: #32c9d5;
    border-radius: 3px;
    height: 16px;
    width: 16px;
    display: inline-block;
`;

const LegendFat = styled.div`
    background: #f08ec1;
    border-radius: 3px;
    height: 16px;
    width: 16px;
    display: inline-block;
`;

const LegendCarbs = styled.div`
    background: #5b6aee;
    border-radius: 3px;
    height: 16px;
    width: 16px;
    display: inline-block;
`;

const LegendItem = styled.div`
    display: block;
    margin: 5px 0;

    .icon-info {
        display: inline-block;
        font-size: 20px;
        color: #3d575d;
    }

    img {
        height: 20px;
        width: 20px;
        vertical-align: text-bottom;
    }
`;

const LegendSubhead = styled.div`
    margin: 10px 0;
    color: #7f8fa4;
    font-size: 15px;
    text-transform: uppercase;
    font-weight: 600;
`;

const Icon = styled.i`
    position: absolute;
    height: 16px;
    width: 16px;
    box-sizing: border-box;
    padding: 1px 4px;
    top: 15px;
    right: 10px;
    font-size: 14px;
    text-align: center;
    border-radius: 3px;
    pointer-events: auto;

    &:active {
        pointer-events: none;
    }

    &.notes {
        background: #ece7fe;
        color: #6031e1;
        z-index: 99;

        @media (max-width: 768px) {
            display: none;
        }
    }

    &.legend {
        position: relative;
        min-width: 0;
        top: 0;
        right: 0;
        margin: 0;
        border: none;
        margin-left: -2px;
        vertical-align: top;
        display: inline-block;
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
        display: none;
    }
`;

const ToggleMonth = styled.div`
    text-align: center;
    margin-right: 270px;

    @media (max-width: 1024px) {
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

        @media (max-width: 1024px) {
            font-size: 35px;
        }
    }

    h2 {
        min-width: 125px;
        display: inline-block;
        vertical-align: middle;
        padding: 10px;
        margin: 0;

        @media (max-width: 1024px) {
            min-width: auto;
            display: flex;
            align-items: center;
        }
    }
`;

const Summary = styled.div`
    padding: 15px 15px 150px 15px;
    background: #ffffff;

    h2 {
        color: rgb(0, 132, 137);
    }
`;

const InfoIcon = styled.span`
    opacity: 0.8;
    cursor: pointer;
    position: absolute;
    color: #3d575d;
    font-size: 20px;
    bottom: 10px;
    right: 10px;

    @media (max-width: 1024px) {
        display: none;
    }

    &:hover {
        color: #ed5454;
    }
`;

const Wrapper = styled.div`
    padding: 200px 50px 30px 50px;

    @media (min-width: 1024px) and (max-width: 1199px) {
        padding: 200px 30px 30px 30px;
    }

    @media (max-width: 768px) {
        background: #ffffff;
        padding: 65px 0;
        height: 100vh;
    }
`;

const CalendarWrapper = styled.div`
    display: flex;

    @media (max-width: 768px) {
        display: block;
    }
`;

const CalendarContainer = styled.div`
    display: grid;
    width: 100%;
    grid-template: 50px 5fr / repeat(7, 1fr);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    background: #ffffff;

    @media (max-width: 768px) {
        box-shadow: none;
    }
`;

const Meals = styled.div``;

const YearHeader = styled.h4`
    text-align: center;
    margin: 0 270px 20px 0;

    @media (max-width: 1024px) {
        margin: 5px auto;
    }

    @media (max-width: 768px) {
        display: none;
    }
`;

const MealHeader = styled.div`
    display: flex;
    justify-content: space-between;
`;

const CalendarHeader = styled.div`
    grid-area: 1/1/1/8;
    display: flex;
    justify-content: space-around;
    border-bottom: 0.5px solid #e6edef;
    background: #ffffff;

    span {
        opacity: 0.8;
        text-align: center;
        font-weight: bold;
        padding: 15px 0;
    }

    @media (max-width: 768px) {
        border-top: 1px solid rgb(219, 219, 219);
        border-bottom: 0;
    }
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

const DayNumber = styled.div`
    font-weight: bold;
    box-sizing: border-box;
    position: absolute;
    top: 15px;
    left: 15px;

    @media (max-width: 768px) {
        left: 0;
        top: 0;
        right: 0;
        text-align: center;
    }
`;

const Day = styled.div`
    position: relative;
    border: 0.5px solid #e6edef;
    border-right: ${props => (props.last ? 0 : '0.5px solid #e6edef')};
    border-left: ${props => (props.first ? 0 : '0.5px solid #e6edef')};
    pointer-events: none;
    box-sizing: border-box;
    height: 150px;
    background: ${props => (props.inactive ? '#f6fafd' : '#ffffff')};
    opacity: ${props => (props.inactive ? 0.5 : 1)};
    color: ${props => (props.today ? '#ed5454' : 'inherit')};

    @media (max-width: 768px) {
        pointer-events: auto;
        height: 80px;
        border: 0;

        #nutrition-ring-container {
            display: ${props => (props.inactive ? 'none' : 'flex')};
        }

        background: #ffffff;
    }
`;

const DayMenuContainer = styled.div`
    position: absolute;
    pointer-events: auto;
    display: flex;
    bottom: 5px;
    right: 5px;

    @media (max-width: 768px) {
        display: none;
    }
`;

const CalendarMenuLink = styled(Link)`
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    transition: opacity ease-in 0.3s;
    border-top: 1px solid rgb(242, 242, 242);
    background: #fff;
    font-size: 16px;
    padding: 10px 0;
    text-align: left;

    &:first-child {
        border-top: 0;
    }

    &:hover {
        opacity: 0.8;
    }
`;

const CalendarMenu = styled(Menu)`
    padding: 10px 15px;
    right: 0;
    top: 40px;
`;

export {
    Icon,
    Day,
    DayOverview,
    ToggleMonth,
    Summary,
    Meals,
    InfoIcon,
    Meal,
    MealHeader,
    Wrapper,
    YearHeader,
    DayNumber,
    CalendarWrapper,
    CalendarHeader,
    CalendarContainer,
    DayMenuContainer,
    CalendarMenuLink,
    CalendarMenu,
    LegendHeader,
    LegendWrapper,
    LegendBody,
    LegendItem,
    LegendSubhead,
    LegendCalories,
    LegendProtein,
    LegendCarbs,
    LegendFat,
    LegendName
};
