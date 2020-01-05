import React, { Fragment, useState } from 'react';
import { SortingRule, CellInfo } from 'react-table';
import produce from 'immer';
import { connect } from 'react-redux';
import firebase from 'firebase';

import Firebase from '../firebase';
import ConfirmationDialog from './ConfirmationDialog';
import { errorNotification, successNotification } from '../actions';
import Table, { tableStyle, Header } from '../Table';
import { RootState, Day } from '../types';
import MealMenu from './MealMenu';

const mapStateToProps = (state: RootState) => ({
    userData: state.adminState.userData
});

const mapDispatchToProps = {
    errorMessage: (message?: string) => errorNotification(message),
    successMessage: (message?: string) => successNotification(message)
};

interface MealTable {
    userData: firebase.UserInfo;
    day: Day;
    index: number;
    successMessage: (message?: string) => void;
    errorMessage: (message?: string) => void;
}

/*eslint-disable */
function MealTable({ day, userData, index, successMessage, errorMessage }: MealTable) {
    const [sorted, setSorted] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [mealToDelete, setMealToDelete] = useState(0);

    function renderActions(row: CellInfo) {
        const confirmHandler = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
            event.stopPropagation();
            setMealToDelete(row.index);
            setDialog(true);
        };

        const editHandler = () => {
            removeMeal(row.index, false);
        };

        return <MealMenu remove={confirmHandler} edit={editHandler} data={row.original} />;
    }

    const removeMeal = (mealIndex: number, notif: boolean) => {
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
                    draftState.nutrition[name] = +draftState.nutrition[name] - parseInt((+meal[name] * parseFloat(`${meal.servings}`)).toFixed(2), 10);
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
            } else if (notif) {
                // trigger success notification
                successMessage('Meal Removed');

                // close dialog
                setDialog(false);
                setMealToDelete(null);
            }
        });
    };

    const onSortedChange = (sortedItems: SortingRule[]) => setSorted(sortedItems);
    const removeSelectedMeal = () => removeMeal(mealToDelete, true);
    const closeDialog = () => setDialog(false);

    return (
        <Fragment>
            <Table
                data={day.nutrition.meals}
                noDataText="No Meals Found"
                columns={[
                    {
                        Header: (props: any) => <Header name="Name" sorted={sorted} {...props} />,
                        accessor: 'name',
                        headerStyle: tableStyle.theadTh,
                        style: tableStyle.cell
                    },
                    {
                        Header: (props: any) => (
                            <Header name="Calories" sorted={sorted} {...props} />
                        ),
                        accessor: 'calories',
                        headerStyle: tableStyle.theadTh,
                        style: tableStyle.cell
                    },
                    {
                        Header: (props: any) => (
                            <Header name="Protein" sorted={sorted} {...props} />
                        ),
                        accessor: 'protein',
                        headerStyle: tableStyle.theadTh,
                        style: tableStyle.cell
                    },
                    {
                        Header: (props: any) => <Header name="Carbs" sorted={sorted} {...props} />,
                        accessor: 'carbs',
                        headerStyle: tableStyle.theadTh,
                        style: tableStyle.cell
                    },
                    {
                        Header: (props: any) => <Header name="Fat" sorted={sorted} {...props} />,
                        accessor: 'fat',
                        headerStyle: tableStyle.theadTh,
                        style: tableStyle.cell
                    },
                    {
                        Cell: (row: CellInfo) => row.original.servings || '---',
                        Header: (props: any) => (
                            <Header name="Servings" sorted={sorted} {...props} />
                        ),
                        accessor: 'servings',
                        headerStyle: tableStyle.theadTh,
                        style: tableStyle.cell
                    },
                    {
                        Cell: renderActions,
                        Header: 'Modify',
                        accessor: 'fat',
                        headerStyle: tableStyle.theadTh,
                        style: tableStyle.cellCentered
                    }
                ]}
                onSortedChange={onSortedChange}
            />

            {dialog && day.nutrition.meals && day.nutrition.meals[mealToDelete] && (
                <ConfirmationDialog
                    open={dialog}
                    action={removeSelectedMeal}
                    onClose={closeDialog}
                    name={`"${day.nutrition.meals[mealToDelete].name}"`}
                />
            )}
        </Fragment>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MealTable);
