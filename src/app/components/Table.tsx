import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

export const tableStyle = {
    cell: {
        alignItems: 'center',
        color: '#6b6b6b',
        display: 'flex',
        fontSize: 12,
        letterSpacing: 0.5,
        paddingLeft: 10
    },
    cellCentered: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center'
    },
    expander: {
        border: 0,
        cursor: 'pointer',
        padding: '10px 0',
        textAlign: 'center',
        userSelect: 'none'
    },
    filter: {
        background: '#f4f8f8',
        padding: 10
    },
    filterInput: {
        border: '1px solid #c9c9c9',
        fontSize: 12,
        height: 30,
        width: '100%'
    },
    filterInputDisabled: {
        background: '#f4f8f8',
        border: '1px solid #c9c9c9',
        fontSize: 12,
        height: 30,
        width: '100%'
    },
    filterTr: {
        border: 0
    },
    firstTheadTh: {
        border: 0,
        boxShadow: 'none',
        color: '#1f3237',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        lineHeight: 1.2,
        textTransform: 'uppercase',
        transform: 'translateY(3px)'
    },
    header: {
        borderBottom: '1px solid #d8d8d8',
        boxShadow: '0 2px 6px 0 rgba(0, 0, 0, 0.3)',
        zIndex: 2
    },
    rowAccordion: { cursor: 'pointer' },
    rowActive: { borderLeft: '4px solid #008484', cursor: 'pointer', fontWeight: 'bold' },
    table: {
        border: '1px solid #d8d8d8',
        borderRadius: 3,
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.11)',
        marginTop: 30
    },
    tbodyTr: {
        borderBottom: 0,
        borderTop: '1px solid #e6eef0',
        minHeight: 60
    },
    td: { minHeight: 60, padding: '10px 20px', color: '#6b6b6b', borderRight: '1px solid #d8d8d8' },
    tdActive: { minHeight: 60, padding: '10px 20px', color: '#6b6b6b', borderRight: 0 },
    th: {
        background: '#fff',
        padding: 12.5,
        textAlign: 'left'
    },
    thead: { display: 'block' },
    theadTh: {
        boxShadow: 'none',
        color: '#1f3237',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        lineHeight: 1.2,
        textTransform: 'uppercase',
        transform: 'translateY(3px)'
    }
};

interface TableSort {
    desc: boolean;
    id: string;
}

export function getSortedComponentClass(data: TableSort[], id: string) {
    const sortInfo = data.filter(item => item.id === id);

    if (sortInfo.length) {
        return sortInfo[0].desc ? 'icon-chevron-up table-sort' : 'icon-chevron-down table-sort';
    } else {
        return 'icon-chevron-down table-sort';
    }
}

export const theadProps = () => {
    return {
        style: tableStyle.header
    };
};

export const theadThProps = () => {
    return {
        style: tableStyle.th
    };
};

export const trGroupProps = () => {
    return {
        style: tableStyle.tbodyTr
    };
};

export default function Table({ noDataText, columns, data, onSortedChange }: any) {
    return (
        <ReactTable
            style={tableStyle.table}
            data={data || []}
            noDataText={noDataText}
            columns={columns}
            getTheadProps={theadProps}
            getTheadThProps={theadThProps}
            getTrGroupProps={trGroupProps}
            onSortedChange={onSortedChange}
            defaultPageSize={10}
            className="-striped -highlight"
        />
    );
}
