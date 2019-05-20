import styled from 'styled-components';
import Button from '@material-ui/core/Button';

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

    @media (max-width: 768px) {
        height: 60px;
        font-size: 20px;
    }
`;

const MealForm = styled.form`
    margin: 10px 0;
`;

const Overview = styled.div`
    margin: 40px 0;
    display: flex;
    justify-content: space-between;

    @media (max-width: 768px) {
        display: flex;
        margin: 10px 0 0 0;
    }
`;

const Content = styled(Overview)`
    @media (max-width: 768px) {
        flex-direction: column-reverse;
    }
`;

const Grams = styled.span`
    display: inline-block;
    font-size: 50px;
    padding-left: 5px;
    color: #a2a7d9;

    @media (max-width: 768px) {
        font-size: 20px;
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
        height: 100px;
        margin: 0;
    }

    h1 {
        display: inline-block;
    }

    h1 {
        font-size: 100px;
        color: #5e639a;
        margin-bottom: 0;

        @media (max-width: 768px) {
            font-size: 25px;
        }
    }

    h3 {
        font-size: 25px;
        text-transform: uppercase;
        color: #a2a7d9;

        @media (max-width: 768px) {
            font-size: 15px;
            margin: 5px 0;
        }
    }
`;

const BoxHeader = styled.div`
    width: 70%;
    margin: 20px auto;

    @media (max-width: 768px) {
        margin: 0 auto;
    }
`;

const InputWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 20px;
`;

const NutritionWrapper = styled.div`
    max-width: 1024px;
    margin: 0 auto;
    padding: 200px 0;

    @media (min-width: 1500px) {
        max-width: 1400px;
    }

    @media (min-width: 1024px) and (max-width: 1199px) {
        padding: 80px 40px 120px;
    }

    @media (max-width: 1023px) {
        padding: 80px 40px 120px;
    }

    @media (max-width: 768px) {
        padding: 80px 15px 120px 15px;
    }
`;

const MealFormButton = styled(Button)`
    border-radius: 0 0 3px 3px !important;
    bottom: 0 !important;
    font-size: 16px !important;
    height: 65px !important;
    left: 0 !important;
    position: absolute !important;

    @media (max-width: 768px) {
        height: 60px !important;
    }
`;

const InputControl = styled.div`
    margin: 0 10px;
`;

const MealsContainer = styled.div`
    position: relative;
    display: inline-block;
    height: 425px;
    width: 31%;
    border: 1px solid #e6eaee;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    border-radius: 3px;
    background: #ffffff;
    text-align: center;

    @media (max-width: 768px) {
        width: 100%;
        display: block;
        height: 400px;
        margin: 0;
    }

    h3,
    h4 {
        padding: 5px 30px 15px 30px;
        color: #3d575d;
        font-size: 25px;
        text-align: left;
        margin-bottom: 0;
        font-weight: normal;

        @media (max-width: 768px) {
            font-size: 20px;
        }
    }

    span.subhead {
        top: 270px;
        position: absolute;
        font-size: 20px;
        color: #a2a7d9;
        left: 0;
        right: 0;
    }
`;

export {
    Overview,
    Box,
    MealForm,
    NutritionWrapper,
    MealsHeader,
    BoxHeader,
    HeaderWrapper,
    InputWrapper,
    MealFormButton,
    Grams,
    MealsContainer,
    Content,
    InputControl
};
