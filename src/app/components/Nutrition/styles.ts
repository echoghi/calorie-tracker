import styled from 'styled-components';

const HeaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const MealsHeader = styled.div`
    padding: 10px 20px;
    font-size: 25px;
    display: flex;
    height: 77px;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e6eaee;
`;

const MealForm = styled.form`
    margin: 10px 0;
`;

const Overview = styled.div`
    margin: 40px 0;
    display: flex;
    justify-content: space-between;

    @media (max-width: 768px) {
        display: block;
        margin: 20px 0;
    }
`;

const Box = styled.div`
    display: inline-block;
    height: 270px;
    width: 31%;
    padding-bottom: 20px;
    border: 1px solid #e6eaee;
    border-radius: 3px;
    background: #ffffff;
    text-align: center;

    @media (max-width: 768px) {
        width: 100%;
        display: block;
        margin: 15px 0;
    }

    &.large {
        width: 100%;
        display: block;
    }

    h1,
    span {
        display: inline-block;
    }

    span {
        font-size: 50px;
        padding-left: 5px;
        color: #a2a7d9;
    }

    h1 {
        font-size: 100px;
        color: #5e639a;
        margin-bottom: 0;
    }

    h3 {
        font-size: 25px;
        text-transform: uppercase;
        color: #a2a7d9;
    }
`;

const BoxHeader = styled.div`
    width: 70%;
    margin: 20px auto;
`;

const InputWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 20px;
`;

export { Overview, Box, MealForm, MealsHeader, BoxHeader, HeaderWrapper, InputWrapper };
