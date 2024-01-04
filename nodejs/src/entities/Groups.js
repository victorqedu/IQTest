import { Component } from 'react';
class Groups extends Component {
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
    static apiName = "groups";
    static apiEditName = "groups";
    static apiDeleteName = "groups";
    static apiPath = "groupsList";
    static allowEditing = true;
}
export default Groups;
