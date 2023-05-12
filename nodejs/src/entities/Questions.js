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
            id: 'id_tests',
            numeric: true,
            disablePadding: false,
            label: 'Test',
            type: 'integer',
            columnVisible: false,
            size: 'small',
            editable: false,
        },
        {
            id: 'orderq',
            numeric: true,
            disablePadding: false,
            label: 'Order',
            type: 'integer',
            columnVisible: true,
            size: 'small',
            editable: true,
        },
        {
            id: 'idQuestionsOptionsCorrect',
            numeric: true,
            disablePadding: false,
            label: 'Correct option',
            type: 'select',
            selectApiPrefix: "administrator/",
            selectApiName: "questionsoptions_findByQuestionId",
            selectApiParameter: "id", // the name of the column from the current object that will be used in the selectApiName query
            selectApiPath: "questionsOptionsList",
            selectApiColumnName: "image",
            selectApiColumnType: "image",
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
            /**
             * this column is in the child(in the tab) and it will be matched against the id of the parent(the current object) in the select, when the table data will be retrieved
             */
            tabLinkColumn: "idQuestions",
        }
    ];
    static DEFAULT_ORDER = 'asc';
    static DEFAULT_ORDER_BY = 'name';
    static DEFAULT_ROWS_PER_PAGE = 5;
    static apiPrefix = "administrator/";
    static apiName = "questions_findByTestId";
    static apiDeleteName = "questions";
    static apiEditName = "questions";
    static apiPath = "questionsList";
}
export default Questions;