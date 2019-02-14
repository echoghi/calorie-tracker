import React from 'react';
import ReactTable from 'react-table';
import Firebase from '../firebase.js';
import produce from 'immer';
import 'react-table/react-table.css';
import { connect } from 'react-redux';
import moment from 'moment';
import ConfirmationDialog from './ConfirmationDialog';
import IconButton from '@material-ui/core/IconButton';
import { errorNotification, successNotification } from '../actions';
import { tableStyle, getSortedComponentClass } from '../TableUtils';

const mapStateToProps = (state: any) => ({
    userData: state.adminState.userData
});

const mapDispatchToProps = (dispatch: any) => ({
    errorNotification: (message: any) => dispatch(errorNotification(message)),
    successNotification: (message: any) => dispatch(successNotification(message))
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

interface UserProps {
    uid: string;
}

/*eslint-disable */
function MealTable({ day, userData, index }: { day: Day; userData: UserProps; index: number }) {
    const [sorted, setSorted] = React.useState([]);
    const [dialog, setDialog] = React.useState(false);
    const [mealToDelete, setMealToDelete] = React.useState(0);

    function renderActions(rowIndex: number) {
        const clickHandler = () => {
            setDialog(true);
            setMealToDelete(rowIndex);
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
                    draftState.nutrition[name] = +draftState.nutrition[name] - parseInt((parseInt(meal[name], 10) * parseFloat(meal.servings)).toFixed(2), 10);
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
                errorNotification();
            } else {
                // trigger success notification
                successNotification('Meal Removed');

                // close dialog
                setDialog(false);
                setMealToDelete(null);
            }
        });
    };

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
                getTheadProps={() => {
                    return {
                        style: tableStyle.header
                    };
                }}
                getTheadThProps={() => {
                    return {
                        style: tableStyle.th
                    };
                }}
                getTrGroupProps={() => {
                    return {
                        style: tableStyle.tbodyTr
                    };
                }}
                onSortedChange={sortedItems => setSorted(sortedItems)}
                defaultPageSize={10}
                className="-striped -highlight"
            />

            {dialog && day.nutrition.meals && day.nutrition.meals.length && (
                <ConfirmationDialog
                    open={dialog}
                    action={() => removeMeal(mealToDelete)}
                    onClose={() => setDialog(false)}
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
