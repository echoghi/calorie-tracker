import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import config from '@config';

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
    height: 100%;
    width: 110px;

    @media (max-width: 768px) {
        font-size: 40px;
        padding: 0 20px;
        display: flex;
        align-items: center;
    }
`;

export const BrandImg = styled.img`
    height: 50px;

    @media (max-width: 768px) {
        height: 35px;
    }
`;

export const BrandIcon = styled.svg`
    fill: ${config.palette.primary};
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
        font-size: 25px;
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

export const Menu = styled.ul`
    position: absolute;
    width: 200px;
    font-family: 'Varela Round';
    margin-top: 40px;
    background: #fff;
    list-style: none;
    padding: 15px;
    right: 0;
    border: 1px solid #dbdbdb;
    border-radius: 0 0 4px 4px;

    @media (max-width: 768px) {
        margin-top: 32px;
    }
`;

export const MenuItem = styled.li`
    padding: 10px;
    border-top: 1px solid rgb(242, 242, 242);

    &:first-child {
        border-top: 0;
    }

    &:hover {
        opacity: 0.8;
    }
`;

export const UserName = styled.div`
    font-size: 12px;
    font-weight: bold;
    padding: 0 15px;

    @media (max-width: 768px) {
        display: none;
    }
`;

export const Icon = styled.i`
    display: inline-block;
    vertical-align: top;
    padding: 20px 5px;

    @media (max-width: 768px) {
        display: none;
    }
`;

export const Greeting = styled.div`
    float: right;
    padding: 0 20px;
    display: inline-flex;
    height: 100%;
    align-items: center;
    cursor: pointer;
`;

export const MenuWrapper = styled.div`
    display: flex;
    align-items: center;
`;

export const Image = styled.img`
    height: 50px;
    border-radius: 50%;
    box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px;

    @media (max-width: 768px) {
        height: 40px;
    }
`;

export const Backup = styled.div`
    height: 50px;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25px;
    border-radius: 50%;
    box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px;

    @media (max-width: 768px) {
        height: 40px;
    }
`;

export const SubNavMenu = styled.div`
    padding: 20px 0;
    width: 100%;
    position: fixed;
    top: 80px;
    background: white;
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid #dbdbdb;
    box-shadow: 0 1px 32px 0 rgba(0, 0, 0, 0.1);
    z-index: 99;

    li {
        font-size: 15px;
        font-weight: bold;
        display: inline-flex;
        list-style: none;
    }

    a {
        position: relative;
        display: flex;
        align-items: center;

        &.active li,
        &.active i {
            color: #ff5a5f;
        }
    }

    @media (max-width: 768px) {
        top: auto;
        padding: 10px 0;
        bottom: 0;

        li {
            display: none;
        }
    }
`;

export const SubNavIcon = styled.i`
    padding: 5px 10px;
    font-size: 17px;
    display: inline-flex;
`;
