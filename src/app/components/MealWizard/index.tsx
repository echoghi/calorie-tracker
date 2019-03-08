import React, { useState } from 'react';
import Downshift from 'downshift';
import Firebase from '../firebase';
import { InputWrapper, Header, Container } from './styles';
import ErrorBoundary from '../Error/ErrorBoundary';
import { IconButton, Tabs, Tab, Paper } from '@material-ui/core';
import Notifications from '../Notifications';
import ConfirmationDialog from '../Nutrition/ConfirmationDialog';
import { connect } from 'react-redux';
import { successNotification, errorNotification } from '../actions';
import { Dispatch } from 'redux';
import AddMeal from './AddMeal';
import { DBMeal } from '../types';

interface MealWizardProps {
    successMessage: (message?: string) => void;
    errorMessage: (message?: string) => void;
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    errorMessage: (message?: string) => dispatch(errorNotification(message)),
    successMessage: (message?: string) => dispatch(successNotification(message))
});

function MealWizard({ successMessage, errorMessage }: MealWizardProps) {
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [mealToDelete, setMealToDelete] = useState('');
    const [tabIndex, setTabIndex] = useState(0);

    let items: DBMeal[] = [];
    const mealsRef = Firebase.db.ref('meals');

    mealsRef.once('value', snapshot => {
        if (snapshot.val()) {
            items = Object.values(snapshot.val());
        }
    });

    function onSelect(selection: DBMeal) {
        console.log(selection);
    }

    function deleteMeal() {
        const updatedItems = items.filter(meal => meal.value !== mealToDelete);

        mealsRef.set(updatedItems, error => {
            if (error) {
                errorMessage();
            } else {
                successMessage('Meal successfully removed');
            }
        });

        setDeleteDialog(false);
    }

    function confirmDelete(event: React.MouseEvent<HTMLElement, MouseEvent>, name: string) {
        event.stopPropagation();

        setDeleteDialog(true);
        setMealToDelete(name);
    }

    function closeDialog() {
        setMealToDelete('');
        setDeleteDialog(false);
    }

    const itemToString = (item: DBMeal) => (item ? item.value : '');

    const handleTabChange = (event: any, value: number) => {
        setTabIndex(value);
    };

    return (
        <ErrorBoundary>
            <Notifications />
            <Header>
                <h1 style={{ fontSize: 50 }}>Meal Wizard</h1>
                <h4 style={{ marginBottom: 50 }}>Add, remove or edit meals from the database</h4>
            </Header>

            <Container>
                <Paper square={true} style={{ width: '100%' }}>
                    <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
                        <Tab label="Manage Meals" />
                        <Tab label="Add Meal" />
                    </Tabs>
                </Paper>

                {[
                    // Meal Search
                    tabIndex === 0 && (
                        <Downshift onChange={onSelect} itemToString={itemToString}>
                            {({
                                getInputProps,
                                getItemProps,
                                getLabelProps,
                                getMenuProps,
                                isOpen,
                                inputValue,
                                highlightedIndex,
                                selectedItem
                            }) => (
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        margin: '100px auto',
                                        width: 500
                                    }}
                                >
                                    <InputWrapper>
                                        <label
                                            {...getLabelProps()}
                                            style={{
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Enter a Meal
                                            <input
                                                {...getInputProps()}
                                                style={{
                                                    appearance: 'none',
                                                    backgroundColor: 'rgb(255, 255, 204)',
                                                    border: '1px solid #CCCCCC',
                                                    borderRadius: 3,
                                                    boxSizing: 'border-box',
                                                    color: 'rgb(49, 49, 49)',
                                                    height: 40,
                                                    outline: 'none',
                                                    padding: '8px 12px',
                                                    transition: 'border-color 0.2s',
                                                    width: '100%'
                                                }}
                                            />
                                        </label>

                                        <ul
                                            {...getMenuProps()}
                                            style={{
                                                boxShadow: '0px 4px 15px rgba(0,0,0,.15)',
                                                margin: 0,
                                                padding: 0
                                            }}
                                        >
                                            {isOpen &&
                                                items &&
                                                items
                                                    .filter(
                                                        item =>
                                                            !inputValue ||
                                                            item.value
                                                                .toLowerCase()
                                                                .includes(inputValue.toLowerCase())
                                                    )
                                                    .map((item, index) => (
                                                        <li
                                                            key={item.value}
                                                            {...getItemProps({
                                                                index,
                                                                item,
                                                                key: item.value,
                                                                style: {
                                                                    backgroundColor:
                                                                        highlightedIndex === index
                                                                            ? 'lightgray'
                                                                            : 'white',
                                                                    borderBottom:
                                                                        '1px solid #e6eaee',
                                                                    display: 'flex',
                                                                    fontWeight:
                                                                        selectedItem === item
                                                                            ? 'bold'
                                                                            : 'normal',
                                                                    justifyContent: 'space-between',
                                                                    listStyle: 'none',
                                                                    margin: 0,
                                                                    padding: '10px',
                                                                    transition: '.2s all'
                                                                }
                                                            })}
                                                        >
                                                            <span
                                                                style={{
                                                                    alignItems: 'center',
                                                                    display: 'flex'
                                                                }}
                                                            >
                                                                {item.value}
                                                            </span>
                                                            <IconButton
                                                                onClick={e =>
                                                                    confirmDelete(e, item.value)
                                                                }
                                                            >
                                                                <i className="icon-trash-2" />
                                                            </IconButton>
                                                        </li>
                                                    ))}
                                        </ul>
                                    </InputWrapper>
                                </div>
                            )}
                        </Downshift>
                    ),

                    // Add Meal Form
                    tabIndex === 1 && <AddMeal />
                ]}
            </Container>

            <ConfirmationDialog
                open={deleteDialog}
                onClose={closeDialog}
                action={deleteMeal}
                name={mealToDelete}
            />
        </ErrorBoundary>
    );
}

export default connect(
    null,
    mapDispatchToProps
)(MealWizard);
