import { Component } from 'react';
class Tests extends Component {
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
            id: 'description',
            numeric: false,
            disablePadding: false,
            label: 'Description',
            type: 'text',
            columnVisible: true,
            size: 'regular',
            editable: true,
        },
    ];
    static DEFAULT_ORDER = 'asc';
    static DEFAULT_ORDER_BY = 'name';
    static DEFAULT_ROWS_PER_PAGE = 5;
    static apiName = "tests";
    static apiPath = "testsList";
}
export default Tests;