import React, {Component} from 'react';
import axios from "axios";
import {
    Box, Checkbox, Dialog,
    FormControlLabel,
    Paper, Switch, Table,
    TableBody, TableCell,
    TableContainer,
    TablePagination, TableRow,
} from "@mui/material";
import EnhancedTableHead from "../genericClasses/EnhancedTableHead";
import Countries from "../entities/Countries";
import commonData from "../genericClasses/commonData";
import {ReactComponent as AddSVG} from '../images/add.svg';
import {ReactComponent as DeleteSVG} from '../images/delete.svg';
import {ReactComponent as EditSVG} from '../images/edit.svg';
import EditCountries from "../editForms/EditCountries";

class TableCountries extends Component {
    constructor(props) {
        super(props);
        this.setOrderData = this.setOrderData.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.handleChangeDense = this.handleChangeDense.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.openPopupEditor = this.openPopupEditor.bind(this);
        this.getSelectedRowData = this.getSelectedRowData.bind(this);

        this.state = {
            rows: [],// all the rows available
            filteredRows: [],// the rows that will be displayed(rows can be filtered by sorting and page number)
            page: 0, // current page number
            rowsPerPage: 5, // default number of rows per page
            order: undefined, // order type(asc/desc)
            orderBy: undefined, // name of the column to order by
            dense: true, // table type dense or not
            selectedRowId: undefined, // the id of the record that is selected
            isPopupEditorOpened: false // the popup for adding/editing records is opened or not
        };
    }

    componentDidMount() {
        let item = {...this.state};
        console.log("TableCountries componentDidMount");

        axios.get('http://caido.ro:8080/api/countries', commonData.config)
            .then(res => {
                console.log(res.data);
                item.rows = res.data._embedded.countriesList;
                const sortedRows = commonData.sort(item.rows, commonData.getComparator(item.order, item.orderBy));
                const updatedRows = sortedRows.slice(
                    this.state.page * this.state.rowsPerPage,
                    this.state.page * this.state.rowsPerPage + this.state.rowsPerPage,
                );
                item.filteredRows = updatedRows;
                this.setState(item);
            })
            .catch(error => {
                console.log("Eroarea este"+error);
                item.rows = [];
                item.filteredRows = [];
                this.setState(item);
            });
    }

    componentDidUpdate(prevProps) {
        //console.log("TableCountries componentDidUpdate");
    }

    setOrderData = (newOrderBy, newOrder) => {
        let item = {...this.state};
        item.orderBy = newOrderBy;
        item.order = newOrder;
        console.log("newOrderBy  is "+newOrderBy+" newOrder is "+newOrder);
        const sortedRows = commonData.sort(this.state.rows, commonData.getComparator(item.order, item.orderBy));
        const updatedRows = sortedRows.slice(
            this.state.page * this.state.rowsPerPage,
            this.state.page * this.state.rowsPerPage + this.state.rowsPerPage,
        );
        item.filteredRows = updatedRows;
        this.setState(item);
    }

    handleRowClick = (event, rowId) => {
        console.log("handleRowClick for rowId "+rowId);
        let item = {...this.state};
        item.selectedRowId = rowId;
        this.setState(item);
    }

    handleChangePage = (event, newPage) => {
        let item = {...this.state};
        console.log("handleChangePage for page newPage "+newPage+" old page "+item.page);
        item.page = newPage;
        const updatedRows = this.state.rows.slice(
            newPage * this.state.rowsPerPage,
            newPage * this.state.rowsPerPage + this.state.rowsPerPage,
        );
        item.filteredRows = updatedRows;
        item.selectedRowId = undefined;
        this.setState(item);
    }

    handleChangeRowsPerPage = (event) => {
        let newRowPerPage = event.target.value;
        let item = {...this.state};
        console.log("handleChangePage for page newPage "+newRowPerPage+" old page "+item.rowsPerPage);
        item.rowsPerPage = newRowPerPage;
        item.page = 0;
        const updatedRows = this.state.rows.slice(
            item.page * newRowPerPage,
            item.page * newRowPerPage + newRowPerPage,
        );
        item.filteredRows = updatedRows;
        item.selectedRowId = undefined;
        this.setState(item);
    }

    handleChangeDense = (event) => {
        let item = {...this.state};
        item.dense = event.target.checked;
        this.setState(item);
    }

    openPopupEditor(event) {
        const target = event.currentTarget;
        let name = target.getAttribute("id");

        if(name==="add") {
            let item = {...this.state};
            item.selectedRowId = undefined;
            item.isPopupEditorOpened = true;
            this.setState(item);
        } else if(name==="edit") {
            let item = {...this.state};
            if(Number.isInteger(parseInt(item.selectedRowId))) {
                item.isPopupEditorOpened = true;
                this.setState(item);
            }
        }
    }

    getSelectedRowData() {
        if(this.state.selectedRowId!==undefined) {
            for (let i = 0; i < this.state.rows.length; i++) {
                if(this.state.rows[i]===this.state.selectedRowId) {
                    let row = this.state.rows[i];
                    return row;
                }
            }
        }
    }

    render() {
        console.log("render this.selectedRowId "+this.state.selectedRowId);

        const handleClose = (editData) => {
            console.log("render table countries/handleClose ");
            if(this.state.isPopupEditorOpened) {
                this.setState({isPopupEditorOpened: false});
                console.log("editData "+editData);
            } else {
                this.setState({isPopupEditorOpened: false});
            }
        };

        let count = this.state.page*this.state.rowsPerPage+1;
        return (
            <Box>
                <Dialog
                    open={this.state.isPopupEditorOpened}
                    onClose={handleClose}
                    fullScreen={true}
                >
                    <div>
                        <EditCountries
                            id={this.state.selectedRowId}
                            closeFeedback={handleClose}
                            selectedRowData={this.getSelectedRowData}/>
                    </div>
                </Dialog>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <TableContainer component={Paper} >
                        <commonData.StyledTable sx={{ minWidth: 200}} size={this.state.dense ? 'small' : 'medium'}  aria-label="a dense table" >
                            <EnhancedTableHead
                                orderBy={this.state.orderBy}
                                order={this.state.order}
                                setOrderData={this.setOrderData}
                                headCells={Countries.Columns}
                            />
                            <TableBody>
                                {Array.isArray(this.state.filteredRows)
                                    ? this.state.filteredRows.map(row => {
                                        return <commonData.StyledTableRow key={row.id} sx={{ cursor: "pointer" }} selected={this.state.selectedRowId===row.id?true:false} onClick={(event) => this.handleRowClick(event, row.id)}>
                                            <commonData.StyledSmallTableCell padding="checkbox" sx={{"display":"none"}}><Checkbox color="primary" checked={this.state.selectedRowId===row.id?true:false}/></commonData.StyledSmallTableCell>
                                            <commonData.StyledSmallTableCell align="right" >{count++}</commonData.StyledSmallTableCell>
                                            <commonData.StyledTableCell align="right" sx={{"display":"none"}}>{row.id}</commonData.StyledTableCell>
                                            <commonData.StyledTableCell align="left">{row.code}</commonData.StyledTableCell>
                                            <commonData.StyledTableCell align="left">{row.name}</commonData.StyledTableCell>
                                        </commonData.StyledTableRow>
                                    })
                                    : null}
                            </TableBody>
                        </commonData.StyledTable>
                    </TableContainer>
                    <TableContainer component={Paper} >
                        <Table size='small'>
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{padding: "0px 10px 0px 0px",}}>
                                        <FormControlLabel
                                            control={<Switch checked={this.state.dense} onChange={(event) => this.handleChangeDense(event)} />}
                                            label="Dense padding"
                                        />
                                    </TableCell>
                                    <TableCell sx={{width: '30px', maxWidth: '30px',padding: "0px 10px 0px 0px",}}>
                                        <div style={{height:'30px',width: '30px'}}>
                                            <AddSVG data-tip="Add" name="add" id="add" onClick={this.openPopupEditor}/>
                                        </div>
                                    </TableCell>
                                    <TableCell sx={{width: '30px', maxWidth: '30px',padding: "0px 10px 0px 0px",}}>
                                        <div style={{height:'30px',width: '30px'}}>
                                            <DeleteSVG data-tip="Delete" name="delete" id="delete" onClick={this.openAreYouSureDeleteDialog}/>
                                        </div>
                                    </TableCell>
                                    <TableCell sx={{width: '30px', maxWidth: '30px',padding: "0px 0px 0px 0px",}}>
                                        <div style={{height:'30px',width: '30px'}}>
                                            <EditSVG data-tip="Edit" name="edit" id="edit" onClick={this.openPopupEditor}/>
                                        </div>
                                    </TableCell>
                                    <TableCell sx={{padding: "0px 10px 0px 0px",}}>
                                        <TablePagination
                                            rowsPerPageOptions={[2, 5, 10, 25, 50, 100, 1000]}
                                            component="div"
                                            count={this.state.rows.length}
                                            page={this.state.page}
                                            rowsPerPage={this.state.rowsPerPage}
                                            onPageChange={(event, newPage) => this.handleChangePage(event, newPage)}
                                            onRowsPerPageChange={(event) => this.handleChangeRowsPerPage(event)}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Paper>
            </Box>
        );
    }


}

export default TableCountries;