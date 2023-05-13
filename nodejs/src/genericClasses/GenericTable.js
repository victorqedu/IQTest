import React, {Component} from 'react';
import axios from "axios";
import {
    Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    FormControlLabel,
    Paper, Switch, Tab, Table,
    TableBody, TableCell,
    TableContainer,
    TablePagination, TableRow, Tabs, ThemeProvider, Typography,
} from "@mui/material";
import EnhancedTableHead from "../genericClasses/EnhancedTableHead";
import commonData from "../genericClasses/commonData";
import {ReactComponent as AddSVG} from '../images/add.svg';
import {ReactComponent as DeleteSVG} from '../images/delete.svg';
import {ReactComponent as EditSVG} from '../images/edit.svg';
import GenericEdit from "./GenericEdit";
import QuestionsOptions from "../entities/QuestionsOptions";
import Questions from "../entities/Questions";

class GenericTable extends Component {
    constructor(props) {
        super(props);
        this.setOrderData = this.setOrderData.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.handleChangeDense = this.handleChangeDense.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.openPopupEditor = this.openPopupEditor.bind(this);
        this.getSelectedRowData = this.getSelectedRowData.bind(this);
        this.remove = this.remove.bind(this);
        this.openAreYouSureDeleteDialog = this.openAreYouSureDeleteDialog.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.checkReadyToShowData = this.checkReadyToShowData.bind(this);
        this.getDataFromApi = this.getDataFromApi.bind(this);

        this.state = {
            rows: [],// all the rows available
            filteredRows: [],// the rows that will be displayed(rows can be filtered by sorting and page number)
            page: 0, // current page number
            rowsPerPage: 5, // default number of rows per page
            order: undefined, // order type(asc/desc)
            orderBy: undefined, // name of the column to order by
            dense: true, // table type dense or not
            selectedRowId: undefined, // the id of the record that is selected
            isPopupEditorOpened: false, // the popup for adding/editing records is opened or not
            isAreYouSureDeleteOpened: false, // the popup for confirming the deletion of a record
            isInfoDialogOpened: false, // the info dialog
            infoDialogMessage: undefined, // the message displayed in the info dialog
            apiName: this.props.config.apiName, // the name used to access the api eg: http://caido.ro:8080/api/<apiName>/ in order to retrieve the list of rows used to show in the table form
            apiEditName: this.props.config.apiEditName, // the name used to access the api eg: http://caido.ro:8080/api/<apiName>/ to add/edit a record
            apiDeleteName: this.props.config.apiDeleteName, // the name used to access the api eg: http://caido.ro:8080/api/<apiName>/ to delete a record
            apiPath: this.props.config.apiPath, // how to extract the list of elements from the api JSON: countriesList
            config: this.props.config, // list of columns and their properties as defined in entieies directory
            visibleTabIndex: 0,
        };
    }

    /**
     * Deletes the record with id  record this.state.selectedRowId
     * @returns {Promise<void>}
     */
    async remove() {
        let item = {...this.state};
        item.isAreYouSureDeleteOpened = false;
        if(Number.isInteger(parseInt(this.state.selectedRowId))) {
            axios.delete("http://caido.ro:8080/api/"+this.state.apiDeleteName+"/"+this.state.selectedRowId,commonData.config)
                .then(() =>{
                    console.log('Record Deleted successfully for ID '+item.selectedRowId);
                    for (let i = 0; i < item.rows.length; i++) {
                        if (item.rows[i].id === item.selectedRowId) {
                            console.log("found deleted record at line "+i+" removing from array");
                            item.rows.splice(i,1);
                        }
                    }
                    item.filteredRows = item.rows.slice(
                        item.page * item.rowsPerPage,
                        item.page * item.rowsPerPage + item.rowsPerPage,
                    );
                    console.log("updatedRows size "+item.filteredRows.length);
                    for (let i = 0; i < item.filteredRows.length; i++) {
                        console.log("updatedRows["+i+"] "+item.filteredRows[i].code);
                    }
                    this.setState(item);
                }).catch(error => {
                item.infoDialogMessage = `Error deleting: ${error.message}`;
                item.isInfoDialogOpened = true;
                this.setState(item);
                console.error('There was an error deleting!', error);
            });
        } else {
            item.isInfoDialogOpened = true;
            item.infoDialogMessage = `Error deleting: select one record to delete`;
            this.setState(item);
        }
    }

    componentDidMount() {
        this.getDataFromApi();
    }

    /**
     * Obtains the data for the table form from the API
     */
    getDataFromApi() {
        console.log("getDataFromApi ");

        if(this.props.isTab && this.props.parentSelectedRowId===undefined) { // nothing to do if this is a tab and no row is selected in the parent
            return;
        }
        let item = {...this.state};
        let url = 'http://caido.ro:8080/api/'+this.state.apiName;
        if(this.props.parentSelectedRowId!==undefined) {
            url+="/"+this.props.parentSelectedRowId;
        }
        item.selectedRowId = undefined;
        console.log("getDataFromApi "+url);
        axios.get(url, commonData.config)
            .then(res => {
                console.log(res.data);
                item.rows = res.data["_embedded"][this.state.apiPath];
                const sortedRows = commonData.sort(item.rows, commonData.getComparator(item.order, item.orderBy));
                const updatedRows = sortedRows.slice(
                    this.state.page * this.state.rowsPerPage,
                    this.state.page * this.state.rowsPerPage + this.state.rowsPerPage,
                );
                item.filteredRows = updatedRows;
                this.setState(item);
            })
            .catch(error => {
                console.log("Error is"+error);
                item.rows = [];
                item.filteredRows = [];
                this.setState(item);
            });
    }

    componentDidUpdate(prevProps) {
        console.log("componentDidUpdate apiName "+this.state.apiName);
        if(this.props.isTab && this.props.parentSelectedRowId!==prevProps.parentSelectedRowId && this.props.parentSelectedRowId!==undefined) {
            this.getDataFromApi();
        }
    }

    /**
     * Orders the rows according to the parameters
     * @param newOrderBy - the order by
     * @param newOrder - order type ASC or DESC
     */
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

    /**
     * sets the new visible tab
     * @param event
     * @param newTabIndex
     */
    handleTabChange = (event, newTabIndex) => {
        let item = {...this.state};
        item.visibleTabIndex = newTabIndex;
        this.setState(item);
    }

    /**
     * Executes on click on every row and sets the property selectedRowId, opens the popup editor
     * @param event
     * @param rowId
     */
    handleRowClick = (event, rowId) => {
        console.log("handleRowClick for rowId "+rowId);
        let item = {...this.state};
        item.selectedRowId = rowId;
        switch (event.detail) {
            case 1: {
                console.log('single click');
                break;
            }
            case 2: {
                console.log('double click');
                item.isPopupEditorOpened = true;
                break;
            }
            case 3: {
                console.log('triple click');
                break;
            }
            default: {
                break;
            }
        }
        this.setState(item);
    }

    /**
     * Changes the page in the table form
     * @param event
     * @param newPage
     */
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

    /**
     * Changes the number of rows/page
     * @param event
     */
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

    /**
     * Opens the popup editor for add/edit
     * @param event
     */
    openPopupEditor(event) {
        if(this.checkReadyToShowData()) {
            const target = event.currentTarget;
            let name = target.getAttribute("id");
            console.log("openPopupEditor "+name);

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
        } else {
            let item = {...this.state};
            item.isInfoDialogOpened = true;
            item.infoDialogMessage = "Select one record from the parent table";
            this.setState(item);
        }
    }

    /**
     * Obtains all the data for the selected row from the id of the selected row(this.state.selectedRowId)
     * @returns {*}
     */
    getSelectedRowData() {
        if(this.state.selectedRowId!==undefined) {
            for (let i = 0; i < this.state.rows.length; i++) {
                if(this.state.rows[i].id===this.state.selectedRowId) {
                    //let row = JSON.parse(JSON.stringify(this.state.rows[i]));
                    let row = this.state.rows[i];
                    console.log("Table getSelectedRowData returning "+row);
                    return row;
                }
            }
        }
    }

    /**
     * The function opens the dialog where the user is asked if is sure if he wants to delete the selected record or
     * if no record is selected opens the dialog where the user is informed that he must select a record
     * @param event
     */
    openAreYouSureDeleteDialog(event) {
        let item = {...this.state};
        if(this.state.selectedRowId!==undefined) {
            item.isAreYouSureDeleteOpened = true;
            this.setState(item);
        } else {
            item.isInfoDialogOpened = true;
            item.infoDialogMessage = `Error deleting: select one record to delete`;
            this.setState(item);
        }
    }

    /**
     * Checks if the current is allowed to show data in the table and if is allowed to add records
     * (in tabs is not allowed to add/show data unless a record is selected in the parent)
     * @returns {boolean}
     */
    checkReadyToShowData() {
        let show = false;
        if(Array.isArray(this.state.filteredRows)) {
            if(this.props.isTab===undefined || this.props.isTab===false) {
                show = true;
            } else { // this.props.isTab is true
                if(this.props.parentSelectedRowId!==undefined) { // a row is selected in the parent, display the data
                    show = true;
                }
            }
        }
        console.log("checkReadyToShowData for "+this.state.apiName+" returning "+show);
        return show;
    }

    render() {
        console.log("render for "+this.state.apiName+" this.selectedRowId "+this.state.selectedRowId+" parentSelectedRowId "+this.props.parentSelectedRowId);

        /**
         *
         * @param editData
         * @param success
         */
        const handleClose = (editData, success) => {
            console.log("handleClose success "+success+" editData "+JSON.stringify(editData));
            if(this.state.isPopupEditorOpened) {
                let item = {...this.state};
                item.isPopupEditorOpened = false;
                if(success) {
                    if(item.selectedRowId!==undefined) { // the record has been updated, I must replace an existing line
                        for (let i = 0; i < item.rows.length; i++) {
                            if(item.rows[i].id===item.selectedRowId) {
                                item.rows[i] = editData;
                            }
                        }
                        const updatedRows = this.state.rows.slice(
                            item.page * this.state.rowsPerPage,
                            item.page * this.state.rowsPerPage + this.state.rowsPerPage,
                        );
                        item.filteredRows = updatedRows;
                    } else { // this is a new record
                        item.rows.unshift(editData);
                        item.page = 0;
                        const updatedRows = this.state.rows.slice(
                            item.page * this.state.rowsPerPage,
                            item.page * this.state.rowsPerPage + this.state.rowsPerPage,
                        );
                        item.selectedRowId = undefined;
                        item.filteredRows = updatedRows;
                    }
                }
                this.setState(item);
                //console.log("editData "+editData);
            } else {
                this.setState({isPopupEditorOpened: false});
            }
        };
        const handleCloseAreYouSureDelete = () => {
            this.setState({isAreYouSureDeleteOpened: false});
        };

        const handleCloseInfoDialog = () => {
            this.setState({isInfoDialogOpened: false});
        };

        let count = this.state.page*this.state.rowsPerPage+1;
        return (
            <ThemeProvider theme={commonData.theme}>
                <Box>
                    {/*the popup dialog for adding/modifying a record*/}
                    <Dialog
                        open={this.state.isPopupEditorOpened}
                        onClose={handleClose}
                        fullScreen={true}
                    >
                        <div>
                            <GenericEdit
                                id={this.state.selectedRowId}
                                parentSelectedRowId={this.props.parentSelectedRowId}
                                closeFeedback={handleClose}
                                selectedRowData={this.getSelectedRowData}
                                apiEditName={this.state.apiEditName}
                                columns={this.state.config.Columns}
                                tabLinkColumn={this.props.tabLinkColumn}
                            />
                        </div>
                    </Dialog>

                    {/*the popup dialog for deleting a record*/}
                    <Dialog
                        open={this.state.isAreYouSureDeleteOpened}
                        onClose={handleCloseAreYouSureDelete}
                    >
                        <DialogTitle id="alert-dialog-title">{"Are you sure?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">Confirm deletion of the record?</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseAreYouSureDelete}>Cancel</Button>
                            <Button onClick={this.remove} autoFocus>Confirm</Button>
                        </DialogActions>
                    </Dialog>

                    {/*the popup dialog for errors*/}
                    <Dialog
                        open={this.state.isInfoDialogOpened}
                        onClose={handleCloseInfoDialog}
                    >
                        <DialogTitle id="alert-dialog-title">Message</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="message">{this.state.infoDialogMessage}</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseInfoDialog}>Close</Button>
                        </DialogActions>
                    </Dialog>

                    <Paper sx={{ width: '98%', mb: 2, padding: 1 }}>
                        <TableContainer component={Paper} >
                            <Table
                                    sx={{
                                        /*"& .MuiTableRow-root:hover": {
                                            backgroundColor: "#AAC8C8",
                                        },
                                        "& .MuiTableRow-root:selected": {
                                            backgroundColor: "#FFC8C8",
                                        },
                                        "&& .Mui-selected": {
                                            backgroundColor: "#FFC8C8",
                                        },
                                        "& .selected": {
                                            backgroundColor: "#FFC8C8",
                                        },*/
                                        "& .MuiTableCell-root": {
                                            border: '0px solid black',
                                            "borderBottom": '1px solid #aaaaaa',
                                            "tableLayout": 'fixed',
                                        },
                                        minWidth: 200,
                                    }}
                                    size={this.state.dense ? 'small' : 'medium'}  aria-label="a dense table" >
                                <EnhancedTableHead
                                    orderBy={this.state.orderBy}
                                    order={this.state.order}
                                    setOrderData={this.setOrderData}
                                    headCells={this.state.config.Columns}
                                />
                                <TableBody>
                                    {this.checkReadyToShowData()
                                        ? this.state.filteredRows.map(row => {
                                            /*return <commonData.StyledTableRow*/
                                            return <TableRow
                                                key={row.id}
                                                sx={{ cursor: "pointer"}}
                                                selected={this.state.selectedRowId===row.id?true:false}
                                                onClick={(event) => this.handleRowClick(event, row.id)}
                                            >
                                                <commonData.StyledSmallTableCell padding="checkbox" sx={{"display":"none"}}><Checkbox color="primary" checked={this.state.selectedRowId===row.id?true:false}/></commonData.StyledSmallTableCell>
                                                <commonData.StyledSmallTableCell align="right">{count++}</commonData.StyledSmallTableCell>
                                                {
                                                    this.state.config.Columns.map((col, i) => (
                                                        col.type==="file"?
                                                            <commonData.StyledTableCell key={i + "_" + row[col.id]}
                                                                                        align={col.numeric ? 'right' : 'left'}
                                                                                        sx={{"display": col.columnVisible === false ? 'none' : ''}}>
                                                                <img src={`${row[col.id]}`} width={100} sx={{border: 1, padding:"2px"}} alt="..."/>
                                                            </commonData.StyledTableCell>:
                                                            col.type==="select"?
                                                                col.selectApiColumnType==="image"?
                                                                    row[col.id]===null||row[col.id]===undefined||row[col.id]===""?
                                                                        <commonData.StyledTableCell key={i + "_" + row[col.id]}
                                                                                                    align={col.numeric ? 'right' : 'left'}
                                                                                                    sx={{"display": col.columnVisible === false ? 'none' : ''}}>
                                                                        </commonData.StyledTableCell>:
                                                                        <commonData.StyledTableCell key={i + "_" + row[col.id]}
                                                                                                    align={col.numeric ? 'right' : 'left'}
                                                                                                    sx={{"display": col.columnVisible === false ? 'none' : ''}}>
                                                                            <img src={`${row[col.id][col.selectApiColumnName]}`} width={100} sx={{border: 1, padding:"2px"}} alt="..."/>
                                                                        </commonData.StyledTableCell>:
                                                                    row[col.id]===null||row[col.id]===undefined||row[col.id]===""?
                                                                        <commonData.StyledTableCell key={i + "_" + row[col.id]}
                                                                                                    align={col.numeric ? 'right' : 'left'}
                                                                                                    sx={{"display": col.columnVisible === false ? 'none' : ''}}>
                                                                        </commonData.StyledTableCell>:
                                                                        <commonData.StyledTableCell key={i + "_" + row[col.id]}
                                                                                                    align={col.numeric ? 'right' : 'left'}
                                                                                                    sx={{"display": col.columnVisible === false ? 'none' : ''}}>
                                                                            {row[col.id][col.selectApiColumnName]}
                                                                        </commonData.StyledTableCell>:
                                                            <commonData.StyledTableCell key={i + "_" + row[col.id]}
                                                                                        align={col.numeric ? 'right' : 'left'}
                                                                                        sx={{"display": col.columnVisible === false ? 'none' : ''}}>
                                                                {row[col.id]}
                                                            </commonData.StyledTableCell>

                                                    ))
                                                }
                                            </TableRow>
                                        })
                                        : null}
                                </TableBody>
                            </Table>
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
                        <Box sx={{ width: "100%" }}>
                            <Box sx={{ borderBottom: 0, borderColor: "divider" }}>
                                <Tabs
                                    value={this.state.visibleTabIndex}
                                    onChange={(event, newTabIndex) => this.handleTabChange(event, newTabIndex)}
                                    aria-label="basic tabs example"
                                >
                                    {
                                        Array.isArray(this.state.config.tabs)
                                            ? this.state.config.tabs.map((tab,index) => {
                                                return <Tab key={"tab"+index} label={tab.tabName} id={"tab_"+index+"_"+tab.tabCode} aria-controls={"tabAC_"+index+"_"+tab.tabCode} />;
                                            })
                                            : null
                                    }
                                </Tabs>
                            </Box>
                            {
                                Array.isArray(this.state.config.tabs)
                                    ? this.state.config.tabs.map((tab,index) => {
                                        return <Box
                                            key={"tabdiv"+index}
                                            role="tabpanel"
                                            hidden={this.state.visibleTabIndex !== index}
                                            id={"tab_"+index+"_"+tab.tabCode}
                                            aria-labelledby={"tabAC_"+index+"_"+tab.tabCode}>
                                            {
                                                this.state.visibleTabIndex === index && (
                                                    <Box sx={{ p: 0 }}>
                                                        <Typography component={'span'} variant={'body2'}>
                                                            {tab.tabObject==="QuestionsOptions"&&<GenericTable config={QuestionsOptions} isTab={true} parentSelectedRowId={this.state.selectedRowId} tabLinkColumn={tab.tabLinkColumn}/>}
                                                            {tab.tabObject==="Questions"&&<GenericTable config={Questions} isTab={true} parentSelectedRowId={this.state.selectedRowId} tabLinkColumn={tab.tabLinkColumn}/>}
                                                        </Typography>
                                                    </Box>
                                                )}
                                        </Box>;
                                    })
                                    : null
                            }
                        </Box>
                    </Paper>
                </Box>
            </ThemeProvider>
        );
    }
}

export default GenericTable;
