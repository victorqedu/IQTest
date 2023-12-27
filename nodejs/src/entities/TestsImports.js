import { Component } from 'react';
class TestsImports extends Component {
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
            id: 'testData',
            numeric: false,
            disablePadding: false,
            label: 'Test data',
            type: 'textarea',
            columnVisible: true,
            size: 'regular',
            editable: true,
        },
        {
            id: 'resultsData',
            numeric: false,
            disablePadding: false,
            label: 'Results data',
            type: 'textarea',
            columnVisible: true,
            size: 'regular',
            editable: true,
        },

    ];
    static DEFAULT_ORDER = 'asc';
    static DEFAULT_ORDER_BY = 'name';
    static DEFAULT_ROWS_PER_PAGE = 5;
    static apiName = "tests";
    static apiDeleteName = "";
    static apiEditName = "importTestFromString";
    static apiPath = "";
}
export default TestsImports;
