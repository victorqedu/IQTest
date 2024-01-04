import { Component } from 'react';
class TestsQuestions extends Component {
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
            id: 'id_tests',
            numeric: true,
            disablePadding: false,
            label: 'Test',
            type: 'integer',
            columnVisible: true,
            size: 'small',
            editable: false,
        },
        {
            id: 'id_questions',
            numeric: true,
            disablePadding: false,
            label: 'Question',
            type: 'integer',
            columnVisible: true,
            size: 'small',
            editable: false,
        },
        {
            id: 'to_left',
            numeric: true,
            disablePadding: false,
            label: 'To Left',
            type: 'integer',
            columnVisible: false,
            size: 'small',
            editable: false,
        },
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'To right',
            type: 'integer',
            columnVisible: false,
            size: 'small',
            editable: false,
        },

    ];
    static DEFAULT_ORDER = 'asc';
    static DEFAULT_ORDER_BY = 'name';
    static DEFAULT_ROWS_PER_PAGE = 5;
    static apiName = "testsquestions";
    static apiEditName = "testsquestions";
    static apiDeleteName = "testsquestions";
    static apiPath = "testsquestionsList";
    static allowEditing = true;
}
export default TestsQuestions;
