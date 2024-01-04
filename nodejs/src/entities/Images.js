import { Component } from 'react';
class Images extends Component {
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
            id: 'image',
            numeric: false,
            disablePadding: false,
            label: 'Image',
            type: 'fileMultiple',
            columnVisible: true,
            size: 'regular',
            editable: true,
        },
    ];
    static DEFAULT_ORDER = 'asc';
    static DEFAULT_ORDER_BY = 'name';
    static DEFAULT_ROWS_PER_PAGE = 5;
    static apiName = "images";
    static apiEditName = "images";
    static apiDeleteName = "images";
    static apiPath = "imagesList";
    static allowEditing = true;
}
export default Images;
