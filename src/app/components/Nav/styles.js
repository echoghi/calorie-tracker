import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const Brand = styled(NavLink)`
    position: relative;
    font-size: 50px;
    background: #fff;
    color: rgb(0, 132, 137);
    box-sizing: border-box;
    text-align: center;
    display: inline-block;
    padding: 15px 30px;
    cursor: pointer;

    @media (max-width: 768px) {
        font-size: 40px;
        padding: 0 20px;
        display: flex;
        align-items: center;
    }
`;

export const Name = styled.div`
    font-family: Oregano;
    cursor: pointer;
    font-size: 35px;
    color: rgb(0, 132, 137);
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translateX(-50%);
    font-style: italic;

    @media (max-width: 768px) {
        display: none;
    }
`;

export const Nav = styled.div`
    font-family: 'Source Sans Pro', serif;
    position: fixed;
    display: flex;
    justify-content: space-between;
    top: 0;
    width: 100%;
    height: 80px;
    background: #ffffff;
    color: #1b2431;
    border-bottom: 1px solid rgb(219, 219, 219);
    z-index: 999;

    @media (max-width: 768px) {
        height: 65px;
    }
`;
