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
        {
            id: 'resultsText',
            numeric: false,
            disablePadding: false,
            label: 'Text rezultat',
            type: 'text',
            columnVisible: true,
            size: 'regular',
            editable: true,
        },
        {
            id: 'idSubjects',
            numeric: true,
            disablePadding: false,
            label: 'Subject',
            type: 'select',
            selectApiName: "subjects",
            selectApiParameter: "", // the name of the column from the current object that will be used in the selectApiName query
            selectApiPath: "subjectsList",
            selectApiColumnName: "name",
            selectApiColumnType: "text",
            selectApiColumnNameBackup: "name",
            selectApiColumnTypeBackup: "text",
            columnVisible: true,
            size: 'regular',
            editable: true,
        },
        {
            id: 'detailedResults',
            numeric: true,
            disablePadding: false,
            label: 'Rezultate detaliate',
            type: 'boolean',
            columnVisible: true,
            size: 'regular',
            editable: true,
        },
        {
            id: 'options',
            numeric: true,
            disablePadding: false,
            label: 'Cu optiuni',
            type: 'boolean',
            columnVisible: true,
            size: 'regular',
            editable: true,
        },
    ];
    static tabs = [
        {
            tabName: 'Questions',
            tabObject: 'Questions',
            tabCode: "questions",
            /**
             * this column is in the child(in the tab) and it will be matched against the id of the parent(the current object) in the select, when the table data will be retrieved
             */
            tabLinkColumn: "idTests",
        }
    ];
    static DEFAULT_ORDER = 'asc';
    static DEFAULT_ORDER_BY = 'name';
    static DEFAULT_ROWS_PER_PAGE = 5;
    static apiName = "tests";
    static apiDeleteName = "tests";
    static apiEditName = "tests";
    static apiPath = "testsList";
}
export default Tests;
