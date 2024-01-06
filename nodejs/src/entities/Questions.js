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
            id: 'points',
            numeric: true,
            disablePadding: false,
            label: 'Points',
            type: 'integer',
            columnVisible: true,
            size: 'small',
            editable: true,
        },
        {
            id: 'explication',
            numeric: false,
            disablePadding: false,
            label: 'Explication',
            type: 'text',
            columnVisible: true,
            size: 'regular',
            editable: true,
        },
        {
            id: 'idQuestionsOptionsCorrect',
            numeric: true,
            disablePadding: false,
            label: 'Correct option',
            type: 'select',
            selectApiName: "questionsoptions_findByQuestionId",
            selectApiParameter: "id", // the name of the column from the current object that will be used in the selectApiName query
            selectApiPath: "questionsOptionsList",
            selectApiColumnName: "image",
            selectApiColumnType: "image",
            selectApiColumnNameBackup: "description",
            selectApiColumnTypeBackup: "text",
            columnVisible: true,
            size: 'regular',
            editable: true,
        },
        {
            id: 'description',
            numeric: false,
            disablePadding: true,
            label: 'Description',
            type: 'textarea',
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
        {
            id: 'fontSize',
            numeric: true,
            disablePadding: false,
            label: 'Dimensiune font',
            type: 'integer',
            columnVisible: true,
            size: 'regular',
            editable: true,
        },
        {
            id: 'maxTime',
            numeric: true,
            disablePadding: false,
            label: 'Timp maxim',
            type: 'integer',
            columnVisible: true,
            size: 'regular',
            editable: true,
        },
        {
            id: 'imageWidth',
            numeric: true,
            disablePadding: false,
            label: 'Lungime imagine',
            type: 'integer',
            columnVisible: true,
            size: 'regular',
            editable: true,
        },
        {
            id: 'text',
            numeric: false,
            disablePadding: false,
            label: 'Text',
            type: 'textarea',
            columnVisible: false,
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
    static apiName = "questions_findByTestId";
    static apiDeleteName = "questions";
    static apiEditName = "questions";
    static apiPath = "questionsList";
    static allowEditing = true;
}
export default Questions;
