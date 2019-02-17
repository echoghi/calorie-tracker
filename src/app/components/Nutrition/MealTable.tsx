import React from 'react';
import ReactTable, { SortingRule } from 'react-table';
import Firebase from '../firebase';
import produce from 'immer';
import 'react-table/react-table.css';
import { connect } from 'react-redux';
import moment from 'moment';
import ConfirmationDialog from './ConfirmationDialog';
import IconButton from '@material-ui/core/IconButton';
import { errorNotification, successNotification } from '../actions';
import {
    trGroupProps,
    theadThProps,
    theadProps,
    tableStyle,
    getSortedComponentClass
} from '../TableUtils';
import { RootState } from '../types';
import { Dispatch } from 'redux';
import firebase from 'firebase';

const mapStateToProps = (state: RootState) => ({
    userData: state.adminState.userData
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    errorMessage: (message?: string) => dispatch(errorNotification(message)),
    successMessage: (message?: string) => dispatch(successNotification(message))
});

interface Note {
    title: string;
    time: string;
    body: string;
    edited: boolean;
    [index: string]: boolean | string;
}

interface Meal {
    name: string;
    fat: number;
    calories: number;
    carbs: number;
    protein: number;
    servings: string;
    [index: string]: any;
}

interface DayFormat {
    date: number;
    month: number;
    year: number;
}

interface Day {
    nutrition: {
        fat: number;
        calories: number;
        carbs: number;
        protein: number;
        meals?: Meal[];
        [index: string]: number | Meal[];
    };
    day: moment.Moment | DayFormat | any;
    notes?: Note[];
    fitness?: {
        calories: number;
        activities: string[];
    };
    [index: string]: any;
}

interface MealTable {
    userData: firebase.UserInfo;
    day: Day;
    index: number;
    successMessage: (message?: string) => void;
    errorMessage: (message?: string) => void;
}

/*eslint-disable */
function MealTable({ day, userData, index, successMessage, errorMessage }: MealTable) {
    const [sorted, setSorted] = React.useState([]);
    const [dialog, setDialog] = React.useState(false);
    const [mealToDelete, setMealToDelete] = React.useState(0);

    function renderActions(rowIndex: number) {
        const clickHandler = () => {
            setMealToDelete(rowIndex);
            setDialog(true);
        };

        return (
            <IconButton onClick={clickHandler}>
                <i className="icon-trash-2" />
            </IconButton>
        );
    }

    const removeMeal = (mealIndex: number) => {
        const mealData = produce(day, draftState => {
            const meal = draftState.nutrition.meals[mealIndex];

            draftState.day = {
                date: day.day.date(),
                month: day.day.get('month'),
                year: day.day.get('year')
            };

            for (const name in draftState.nutrition) {
                if (name !== 'meals') {
                    // prettier-ignore
                    draftState.nutrition[name] = +draftState.nutrition[name] - parseInt((+meal[name] * parseFloat(meal.servings)).toFixed(2), 10);
                }
            }

            draftState.nutrition.meals = draftState.nutrition.meals.filter(
                mealRef => mealRef !== draftState.nutrition.meals[mealIndex]
            );
        });

        const dayRef = Firebase.db
            .ref('users')
            .child(userData.uid)
            .child(`calendar/${index}`);

        dayRef.set(mealData, error => {
            if (error) {
                errorMessage();
            } else {
                // trigger success notification
                successMessage('Meal Removed');

                // close dialog
                setDialog(false);
                setMealToDelete(null);
            }
        });
    };

    const onSortedChange = (sortedItems: SortingRule[]) => setSorted(sortedItems);
    const removeSelectedMeal = () => removeMeal(mealToDelete);
    const closeDialog = () => setDialog(false);

    return (
        <React.Fragment>
            <ReactTable
                style={tableStyle.table}
                data={day.nutrition.meals || []}
                noDataText="No Meals Found"
                columns={[
                    {
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    Meal
                                    <i
                                        className={getSortedComponentClass(sorted, props.column.id)}
                                    />
                                </span>
                            );
                        },
                        accessor: 'name',
                        headerStyle: tableStyle.theadTh,
                        style: tableStyle.cell
                    },
                    {
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    Calories
                                    <i
                                        className={getSortedComponentClass(sorted, props.column.id)}
                                    />
                                </span>
                            );
                        },
                        accessor: 'calories',
                        headerStyle: tableStyle.theadTh,
                        style: tableStyle.cell
                    },
                    {
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    Protein
                                    <i
                                        className={getSortedComponentClass(sorted, props.column.id)}
                                    />
                                </span>
                            );
                        },
                        accessor: 'protein',
                        headerStyle: tableStyle.theadTh,
                        style: tableStyle.cell
                    },
                    {
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    Carbs
                                    <i
                                        className={getSortedComponentClass(sorted, props.column.id)}
                                    />
                                </span>
                            );
                        },
                        accessor: 'carbs',
                        headerStyle: tableStyle.theadTh,
                        style: tableStyle.cell
                    },
                    {
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    Fat
                                    <i
                                        className={getSortedComponentClass(sorted, props.column.id)}
                                    />
                                </span>
                            );
                        },
                        accessor: 'fat',
                        headerStyle: tableStyle.theadTh,
                        style: tableStyle.cell
                    },
                    {
                        Cell: row => row.original.servings || '---',
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    Servings
                                    <i
                                        className={getSortedComponentClass(sorted, props.column.id)}
                                    />
                                </span>
                            );
                        },
                        accessor: 'servings',
                        headerStyle: tableStyle.theadTh,
                        style: tableStyle.cell
                    },
                    {
                        Cell: row => renderActions(row.index),
                        Header: 'Modify',
                        accessor: 'fat',
                        headerStyle: tableStyle.theadTh,
                        style: tableStyle.cellCentered
                    }
                ]}
                getTheadProps={theadProps}
                getTheadThProps={theadThProps}
                getTrGroupProps={trGroupProps}
                onSortedChange={onSortedChange}
                defaultPageSize={10}
                className="-striped -highlight"
            />

            {dialog && day.nutrition.meals && day.nutrition.meals[mealToDelete] && (
                <ConfirmationDialog
                    open={dialog}
                    action={removeSelectedMeal}
                    onClose={closeDialog}
                    name={`"${day.nutrition.meals[mealToDelete].name}"`}
                />
            )}
        </React.Fragment>
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MealTable);
