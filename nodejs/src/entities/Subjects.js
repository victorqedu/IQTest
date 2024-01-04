import { Component } from 'react';
class Subjects extends Component {
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
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Name',
            type: 'text',
            columnVisible: true,
            size: 'regular',
            editable: true,
        },
    ];
    static DEFAULT_ORDER = 'asc';
    static DEFAULT_ORDER_BY = 'name';
    static DEFAULT_ROWS_PER_PAGE = 5;
    static apiName = "subjects";
    static apiEditName = "subjects";
    static apiDeleteName = "subjects";
    static apiPath = "subjectsList";
    static allowEditing = true;
}
export default Subjects;
