import { Component } from 'react';
class TestsSessions extends Component {
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
            id: 'testDate',
            numeric: false,
            disablePadding: false,
            label: 'Data',
            type: 'text',
            columnVisible: true,
            size: 'regular',
            editable: false,
        },
        {
            id: 'ipAddress',
            numeric: false,
            disablePadding: false,
            label: 'IP ddress',
            type: 'text',
            columnVisible: true,
            size: 'regular',
            editable: false,
        },
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Name',
            type: 'text',
            columnVisible: true,
            size: 'regular',
            editable: true,
        },
        {
            id: 'age',
            numeric: true,
            disablePadding: false,
            label: 'Age in years',
            type: 'integer',
            minValue:1,
            maxValue:130,
            columnVisible: true,
            size: 'small',
            editable: true,
            mandatory: true,
        },
        {
            id: 'idSex',
            numeric: true,
            disablePadding: false,
            label: 'Sex',
            type: 'select',
            selectApiName: "sex",
            selectApiParameter: undefined, // the name of the column from the current object that will be used in the selectApiName query
            selectApiPath: "sexList",
            selectApiColumnName: "name",
            selectApiColumnType: "text",
            columnVisible: true,
            size: 'regular',
            editable: true,
            notNull: true,
            mandatory: true,
        },
        {
            id: 'idTests',
            numeric: true,
            disablePadding: false,
            label: 'Test',
            type: 'select',
            selectApiName: "tests",
            selectApiParameter: undefined, // the name of the column from the current object that will be used in the selectApiName query
            selectApiPath: "testsList",
            selectApiColumnName: "description",
            selectApiColumnType: "text",
            columnVisible: true,
            size: 'regular',
            editable: false,
            notNull: true,
            mandatory: true,
        },
        {
            id: 'idUsers',
            numeric: true,
            disablePadding: false,
            label: 'Utilizator',
            type: 'select',
            selectApiName: "users",
            selectApiParameter: undefined, // the name of the column from the current object that will be used in the selectApiName query
            selectApiPath: "usersList",
            selectApiColumnName: "username",
            selectApiColumnType: "text",
            columnVisible: true,
            size: 'regular',
            editable: false,
            notNull: true,
            mandatory: false,
            defaultValue: "connectedUser",
        },
    ];
    static DEFAULT_ORDER = 'asc';
    static DEFAULT_ORDER_BY = 'name';
    static DEFAULT_ROWS_PER_PAGE = 5;
    static apiName = "testssessions";
    static apiDeleteName = "testssessions";
    static apiEditName = "testssessions";
    static apiPath = "testsSessionsList";
}
export default TestsSessions;
