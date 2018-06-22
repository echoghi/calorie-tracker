export const tableStyle = {
    table: {
        border: '1px solid #d8d8d8',
        borderRadius: 3,
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.11)',
        marginTop: 30
    },
    header: {
        borderBottom: '1px solid #d8d8d8',
        boxShadow: '0 2px 6px 0 rgba(0, 0, 0, 0.3)',
        zIndex: 2
    },
    filter: {
        padding: 10,
        background: '#f4f8f8'
    },
    filterTr: {
        border: 0
    },
    filterInput: {
        height: 30,
        width: '100%',
        fontSize: 12,
        border: '1px solid #c9c9c9'
    },
    filterInputDisabled: {
        background: '#f4f8f8',
        height: 30,
        width: '100%',
        fontSize: 12,
        border: '1px solid #c9c9c9'
    },
    cell: {
        fontSize: 12,
        color: '#6b6b6b',
        letterSpacing: 0.5,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 10
    },
    cellCentered: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    thead: { display: 'block' },
    theadTh: {
        fontWeight: 'bold',
        fontSize: 12,
        textTransform: 'uppercase',
        color: '#1f3237',
        lineHeight: 1.2,
        letterSpacing: 0.5,
        transform: 'translateY(3px)',
        boxShadow: 'none'
    },
    firstTheadTh: {
        fontWeight: 'bold',
        fontSize: 12,
        textTransform: 'uppercase',
        color: '#1f3237',
        lineHeight: 1.2,
        letterSpacing: 0.5,
        transform: 'translateY(3px)',
        boxShadow: 'none',
        border: 0
    },
    rowActive: { borderLeft: '4px solid #008484', cursor: 'pointer', fontWeight: 'bold' },
    rowAccordion: { cursor: 'pointer' },
    tdActive: { minHeight: 60, padding: '10px 20px', color: '#6b6b6b', borderRight: 0 },
    td: { minHeight: 60, padding: '10px 20px', color: '#6b6b6b', borderRight: '1px solid #d8d8d8' },
    th: {
        padding: 12.5,
        background: '#fff',
        textAlign: 'left'
    },
    tbodyTr: {
        minHeight: 60,
        borderTop: '1px solid #e6eef0',
        borderBottom: 0
    },
    expander: {
        cursor: 'pointer',
        padding: '10px 0',
        textAlign: 'center',
        userSelect: 'none',
        border: 0
    }
};

export function getSortedComponentClass(data, id) {
    const sortInfo = data.filter(item => item.id === id);
    let className;

    if (sortInfo.length) {
        if (sortInfo[0].desc) {
            className = 'icon-chevron-up table-sort';
        } else {
            className = 'icon-chevron-down table-sort';
        }
    } else {
        className = 'icon-chevron-down table-sort';
    }

    return className;
}
