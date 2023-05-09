import { Component } from 'react';
class Questions extends Component {
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
            id: 'id_questions_options_correct',
            numeric: true,
            disablePadding: false,
            label: 'Correct option',
            type: 'select',
            columnVisible: true,
            size: 'regular',
            editable: true,
        },
        {
            id: 'description',
            numeric: false,
            disablePadding: true,
            label: 'Description',
            type: 'text',
            columnVisible: true,
            size: 'regular',
            editable: true,
        },
        {
            id: 'image',
            numeric: false,
            disablePadding: false,
            label: 'Image',
            type: 'file',
            columnVisible: true,
            size: 'regular',
            editable: true,
        },
    ];

    static tabs = [
        {
            tabName: 'Options',
            tabObject: 'QuestionsOptions',
            tabCode: "options",
        }
    ];
    static DEFAULT_ORDER = 'asc';
    static DEFAULT_ORDER_BY = 'name';
    static DEFAULT_ROWS_PER_PAGE = 5;
    static apiName = "questions";
    static apiPath = "questionsList";
}
export default Questions;