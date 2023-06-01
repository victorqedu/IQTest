import { Component } from 'react';
class QuestionsOptions extends Component {
    static Columns = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'ID',
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
            columnVisible: false,
            size: 'small',
            editable: false,
        },
        {
            id: 'image',
            numeric: false,
            disablePadding: false,
            label: 'Image',
            type: 'file',
            columnVisible: true,
            size: 'small',
            editable: true,
        },
    ];
    static DEFAULT_ORDER = 'asc';
    static DEFAULT_ORDER_BY = 'name';
    static DEFAULT_ROWS_PER_PAGE = 5;
    static apiName = "questionsoptions_findByQuestionId";
    static apiDeleteName = "questionsoptions";
    static apiEditName = "questionsoptions";
    static apiPath = "questionsOptionsList";
}
export default QuestionsOptions;