import React from 'react';
import ReactTable from 'react-table';
import { database } from '../firebase.js';
import produce from 'immer';
import 'react-table/react-table.css';
import { connect } from 'react-redux';
import ConfirmationDialog from './ConfirmationDialog';
import IconButton from '@material-ui/core/IconButton';
import { errorNotification, successNotification } from '../actions';
import { tableStyle, getSortedComponentClass } from '../TableUtils';

const mapStateToProps = state => ({
    userData: state.adminState.userData
});

const mapDispatchToProps = dispatch => ({
    errorNotification: message => dispatch(errorNotification(message)),
    successNotification: message => dispatch(successNotification(message))
});

/*eslint-disable */
function MealTable({ day, userData, index, actions }) {
    const [sorted, setSorted] = React.useState([]);
    const [dialog, setDialog] = React.useState(false);
    const [mealToDelete, setMealToDelete] = React.useState(0);

    function renderActions(index) {
        const clickHandler = () => {
            setDialog(true);
            setMealToDelete(index);
        };

        return (
            <IconButton onClick={clickHandler}>
                <i className="icon-trash-2" />
            </IconButton>
        );
    }

    const removeMeal = mealIndex => {
        const mealData = produce(day, draftState => {
            const meal = draftState.nutrition.meals[mealIndex];

            draftState.day = {
                month: day.day.get('month'),
                date: day.day.date(),
                year: day.day.get('year')
            };

            for (let name in draftState.nutrition) {
                if (name !== 'meals') {
                    // prettier-ignore
                    draftState.nutrition[name] -= parseInt((parseInt(meal[name]) * parseFloat(meal.servings)).toFixed(2));
                }
            }

            draftState.nutrition.meals = draftState.nutrition.meals.filter(
                meal => meal !== draftState.nutrition.meals[mealIndex]
            );
        });

        const dayRef = database
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
                        headerText: 'Meal',
                        accessor: 'name',
                        headerStyle: tableStyle.theadTh,
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    {props.column.headerText}
                                    <i
                                        className={getSortedComponentClass(sorted, props.column.id)}
                                    />
                                </span>
                            );
                        },
                        style: tableStyle.cell
                    },
                    {
                        headerText: 'Calories',
                        accessor: 'calories',
                        headerStyle: tableStyle.theadTh,
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    {props.column.headerText}
                                    <i
                                        className={getSortedComponentClass(sorted, props.column.id)}
                                    />
                                </span>
                            );
                        },
                        style: tableStyle.cell
                    },
                    {
                        headerText: 'Protein',
                        accessor: 'protein',
                        headerStyle: tableStyle.theadTh,
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    {props.column.headerText}
                                    <i
                                        className={getSortedComponentClass(sorted, props.column.id)}
                                    />
                                </span>
                            );
                        },
                        style: tableStyle.cell
                    },
                    {
                        headerText: 'Carbs',
                        accessor: 'carbs',
                        headerStyle: tableStyle.theadTh,
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    {props.column.headerText}
                                    <i
                                        className={getSortedComponentClass(sorted, props.column.id)}
                                    />
                                </span>
                            );
                        },
                        style: tableStyle.cell
                    },
                    {
                        headerText: 'Fat',
                        accessor: 'fat',
                        headerStyle: tableStyle.theadTh,
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    {props.column.headerText}
                                    <i
                                        className={getSortedComponentClass(sorted, props.column.id)}
                                    />
                                </span>
                            );
                        },
                        style: tableStyle.cell
                    },
                    {
                        headerText: 'Servings',
                        accessor: 'servings',
                        Cell: row => row.original.servings || '---',
                        headerStyle: tableStyle.theadTh,
                        Header: props => {
                            return (
                                <span style={tableStyle.thead}>
                                    {props.column.headerText}
                                    <i
                                        className={getSortedComponentClass(sorted, props.column.id)}
                                    />
                                </span>
                            );
                        },
                        style: tableStyle.cell
                    },
                    {
                        Cell: row => renderActions(row.index),
                        accessor: 'fat',
                        headerStyle: tableStyle.theadTh,
                        Header: 'Modify',
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
                onSortedChange={sorted => setSorted(sorted)}
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
