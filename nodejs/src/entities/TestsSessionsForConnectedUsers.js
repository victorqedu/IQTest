import { Component } from 'react';
class TestsSessionsForConnectedUsers extends Component {
    static Columns = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'ID',
            type: 'integer',
            columnVisible: false,
            size: 'small',
            editable: false,
        },
        {
            id: 'ipAddress',
            numeric: false,
            disablePadding: false,
            label: 'IP ddress',
            type: 'text',
            columnVisible: false,
            size: 'regular',
            editable: false,
        },
        {
            id: 'testDate',
            numeric: false,
            disablePadding: false,
            label: 'Data',
            type: 'datetime',
            columnVisible: true,
            size: 'regular',
            editable: false,
        },
        {
            id: 'subject',
            numeric: false,
            disablePadding: false,
            label: 'Subiect',
            type: 'text',
            columnVisible: true,
            size: 'regular',
            editable: false,
        },
        {
            id: 'idTests',
            numeric: false,
            disablePadding: false,
            label: 'Test',
            type: 'text',
            columnVisible: true,
            size: 'regular',
            editable: false,
        },
        {
            id: 'points',
            numeric: false,
            disablePadding: false,
            label: 'Punctaj realizat/maxim',
            type: 'text',
            columnVisible: true,
            size: 'regular',
            editable: false,
        },
    ];
    static DEFAULT_ORDER = 'asc';
    static DEFAULT_ORDER_BY = 'name';
    static DEFAULT_ROWS_PER_PAGE = 5;
    static apiName = "testssessions";
    static apiDeleteName = "testssessions";
    static apiEditName = "testssessions";
    static apiPath = "testsSessionsDTOList";
    static allowEditing = false;
}
export default TestsSessionsForConnectedUsers;
