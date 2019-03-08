import styled from 'styled-components';
import { MealsContainer } from '../Nutrition/styles';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 600px;
    margin: 0 auto;
`;

const InputWrapper = styled.div`
    width: 100%;
`;

const Header = styled.div`
    margin-top: 50px;
    text-align: center;
`;

const MealFormContainer = styled(MealsContainer)`
    margin: 50px auto;
    height: 355px;
    width: auto;
`;

export { Container, InputWrapper, Header, MealFormContainer };
