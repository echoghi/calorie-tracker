import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { tableStyle, getSortedComponentClass } from '../TableUtils';

/*eslint-disable */
export default function FoodTable({ day, actions }) {
    const [sorted, setSorted] = React.useState([]);

    return (
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
                                <i className={getSortedComponentClass(sorted, props.column.id)} />
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
                                <i className={getSortedComponentClass(sorted, props.column.id)} />
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
                                <i className={getSortedComponentClass(sorted, props.column.id)} />
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
                                <i className={getSortedComponentClass(sorted, props.column.id)} />
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
                                <i className={getSortedComponentClass(sorted, props.column.id)} />
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
                                <i className={getSortedComponentClass(sorted, props.column.id)} />
                            </span>
                        );
                    },
                    style: tableStyle.cell
                },
                {
                    Cell: row => actions(row.index),
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
    );
}
