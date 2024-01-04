import { Component } from 'react';
class Countries extends Component {
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
            id: 'code',
            numeric: false,
            disablePadding: false,
            label: 'Code',
            type: 'text',
            columnVisible: true,
            size: 'small',
            editable: true,
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
    static apiName = "countries";
    static apiEditName = "countries";
    static apiDeleteName = "countries";
    static apiPath = "countriesList";
    static allowEditing = true;
}
export default Countries;
