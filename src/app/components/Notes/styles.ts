import styled from 'styled-components';

export const NotesHeader = styled.div`
    padding: 10px 20px;
    font-size: 25px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e6eaee;

    @media (max-width: 768px) {
        font-size: 20px;
    }
`;

export const Note = styled.div`
    padding: 15px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #e6eaee;
    cursor: pointer;

    &:first-child {
        border-top: 0;
    }

    &:hover {
        background: rgba(0, 0, 0, 0.03);
    }
`;

export const NoteContainer = styled.div`
    overflow: auto;
    height: 348px;
`;

export const EmptyContainer = styled.div`
    display: block;
    margin: 0 auto;
`;

export const NoNotes = styled.div`
    display: flex;
    align-items: center;
    height: 100%;

    h4 {
        padding: 0;
        margin: 0 auto;
        text-align: center;
    }
`;

export const NoteBox = styled.div`
    position: relative;
    display: inline-block;
    height: 425px;
    width: 65.5%;
    border: 1px solid #e6eaee;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    border-radius: 3px;
    background: #ffffff;
    text-align: center;

    h4 {
        padding: 5px 30px 15px 30px;
        color: #3d575d;
        font-size: 25px;
        text-align: left;
        margin-bottom: 0;
        font-weight: normal;
    }

    @media (max-width: 768px) {
        width: 100%;
        display: block;
        margin: 30px 0;
    }
`;

export const NoteTitle = styled.div`
    width: 20%;
    text-align: left;

    @media (max-width: 768px) {
        width: 25%;
    }
`;

export const NoteBody = styled.div`
    width: 50%;
    text-align: left;

    span {
        display: block;
    }
    span:nth-child(2) {
        color: rgb(38, 155, 218);
    }
`;

export const NoteActions = styled.div`
    width: 60px;
    text-align: right;
`;

export const Menu = styled.div`
    font-family: 'Varela Round';
    padding: 20px 15px;
    border: 1px solid #dbdbdb;
    border-radius: 4px;
    background: #fff;
    position: absolute;
    width: 100px;
    right: 10px;
    z-index: 99;
`;

export const MenuItem = styled.div`
    display: flex;
    justify-content: space-between;
    transition: opacity ease-in 0.3s;
    border-top: 1px solid rgb(242, 242, 242);
    background: #fff;
    padding: 10px 0;
    text-align: left;

    &:first-child {
        border-top: 0;
    }

    &:hover {
        opacity: 0.8;
    }
`;
