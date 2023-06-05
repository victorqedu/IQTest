import React, {Component} from "react";
import {Box, Button, Container, Input, MenuItem, Select, TextField, Typography} from "@mui/material";
import axios from "axios";
import {Form, FormGroup} from "reactstrap";
import commonData from "../genericClasses/commonData";
import { Helmet } from 'react-helmet';

class GenericEdit extends Component {
    constructor(props) {
        super(props);
        //console.log("Start constructor GE "+JSON.stringify(this.props.selectedRowData()));
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.getBase64 = this.getBase64.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.getSelectDataFromApi = this.getSelectDataFromApi.bind(this);
        this.getAllSelectData = this.getAllSelectData.bind(this);

        this.state = {
            // I'm making a copy of the row as described here: https://stackoverflow.com/questions/5055746/cloning-an-object-in-node-js
            // If I don't make the copy and pass this row(this.props.selectedRowData()) to the GenericEdit class than every time I will change something in the EditClass,
            // the change will go in the table rows without saving the data(when pressing tha cancel button instead of save)
            editData: (this.props.id!==undefined||this.props.noRows===true)?JSON.parse(JSON.stringify(this.props.selectedRowData())):{},
            selectData:{},
            changed: false,
            message: "",
            success: false,
        };
        if(this.props.tabLinkColumn!==undefined) { //this is a tab
            console.log("GE constructor his.props.tabLinkColumn is "+this.props.tabLinkColumn+" this.props.id "+this.props.parentSelectedRowId);
            let obj= {};
            obj["id"] = this.props.parentSelectedRowId;
            this.state.editData[this.props.tabLinkColumn] = obj;
        }
    }

    /**
     * Changes the state values for the fields in this edit form except for the fields of the type select that are handled by handleChangeSelect
     * @param event
     * @returns {Promise<void>}
     */
    async handleChange(event) {
        const target = event.currentTarget;
        let name = target.getAttribute("id");
        console.log("handleChange for name "+name);
        let item = {...this.state};
        item.message = "";
        const obj = {};
        for (const key in item.editData) {
            if (item.editData.hasOwnProperty(key)) {
                obj[key] = item.editData[key];
            }
        }
        for (const col of this.props.columns) {
            if(col.id===name) {
                if(col.type==="file") {
                    if(target.files[0]!==undefined) {
                        let file = target.files[0];
                        obj[name] = await this.getBase64(file);
                        item.changed=1;
                        console.log("changed "+name+" with value "+target.files[0].name+" b64 "+obj[name]);
                    }
                } else if(col.type==="integer") {
                    console.log("handleChange for name "+name+" col integer checking "+target.value+" is integer");
                    const re = /^\d*$/;
                    if(target.value.match(re)) {
                        console.log("handleChange for name "+name+" is integer");
                        if(col.minValue!=="" && target.value !== "" && col.minValue > parseInt(target.value))  {
                            item.message = "Minimum value for the field \""+col.label+"\" is "+col.minValue;
                            item.changed=1;
                        } else if (col.maxValue!=="" && target.value !== "" && col.maxValue < parseInt(target.value)) {
                            item.message = "Maximum value for the field \""+col.label+"\" is "+col.maxValue;
                            item.changed=1;
                        } else {
                            obj[name] = target.value;
                            item.changed=1;
                            console.log("changed "+name+" with value "+target.value);
                        }
                    } else {
                        console.log("handleChange for name "+name+" is not integer");
                    }
                } else {
                    obj[name] = target.value;
                    item.changed=1;
                    console.log("changed "+name+" with value "+target.value);
                }
            }
        }
        if(item.changed===1) {
            item.editData = obj;
            this.setState(item);
        }
    }

    /**
     * Changes the state values for the fields of the type select
     * @param event
     * @returns {Promise<void>}
     */
    async handleChangeSelect(event) {
        console.log("handleChangeSelect for "+event.target.name);
        let item = {...this.state};
        item.changed=1;

        if(event.target.value==="") {
            item.editData[event.target.name] = null;
        } else {
            let obj = {};
            obj["id"] = event.target.value;
            item.editData[event.target.name] = obj;
        }
        this.setState(item);
    }

    /**
     * Submits the edit form to the backend API
     * @param event
     * @returns {Promise<void>}
     */
    async handleSubmit(event) {
        console.log("Start handleSubmit this.state.changed "+this.state.changed);
        event.preventDefault();
        if(this.state.changed===1) {
            console.log("Sending JSON data :"+JSON.stringify(this.state.editData));
            let item = {...this.state};
            item.message = "";
            let error = false;
            for (const col of this.props.columns) {
                if(col.mandatory && (item.editData[col.id]==="" || item.editData[col.id]===null || item.editData[col.id]===undefined)) {
                    error = true;
                    item.message += "The field named \""+col.label+"\" is required, please insert a value.&";
                }
            }
            if(!error) {
                item.message = "Changes have been detected, saving data";
                this.setState(item);
                if (typeof this.state.editData.id == 'undefined' || this.state.editData.id === '') {
                    axios.post(commonData.getApiLink()+this.props.apiEditName,
                        JSON.stringify(this.state.editData), commonData.config)
                        .then(
                            res => {
                                console.log("POST Ret data: "+JSON.stringify(res.data));
                                let item = {...this.state};
                                item.editData = res.data;
                                item.success = true;
                                this.setState(item, ()=>{
                                    this.closePopup();
                                });
                            }
                        )
                        .catch(error => {
                            console.log("POST Error");
                            let item = {...this.state};
                            item.message = commonData.parseError(error);
                            this.setState(item);
                        });
                } else {
                    axios.put(commonData.getApiLink()+this.props.apiEditName+"/"+this.props.id,
                        JSON.stringify(this.state.editData), commonData.config)
                        .then(
                            res => {
                                console.log("PUT Ret data: "+JSON.stringify(res.data));
                                let item = {...this.state};
                                item.success = true;
                                item.editData = res.data;
                                this.setState(item, ()=>{
                                    this.closePopup();
                                });
                            }
                        )
                        .catch(error => {
                            let item = {...this.state};
                            item.message = commonData.parseError(error);
                            this.setState(item);
                        });
                }
            } else {
                this.setState(item);
            }
        } else {
            let item = {...this.state};
            item.message = "There are no changes to save on this form";
            this.setState(item);
        }
    }

    /**
     * Closes the editor
     * @param event
     */
    closePopup(event) {
        console.log("Start closePopup for edit data "+this.state.editData);
        if(event!=null) {
            event.preventDefault();
        }

        if(typeof this.props.closeFeedback !== 'undefined') {
            this.props.closeFeedback(this.state.editData, this.state.success);
        }
    }

    /**
     * Obtains a base64 representation of the file
     * @param file
     * @returns {Promise<unknown>}
     */
    getBase64 = file => {
        return new Promise(resolve => {
            let fileInfo;
            let baseURL = "";
            // Make new FileReader
            let reader = new FileReader();

            // Convert the file to base64 text
            reader.readAsDataURL(file);

            // on reader load somthing...
            reader.onload = () => {
                // Make a fileInfo Object
                console.log("Called", reader);
                baseURL = reader.result;
                console.log(baseURL);
                resolve(baseURL);
            };
            console.log(fileInfo);
        });
    };

    componentDidMount() {
        console.log("Start GE componentDidMount");
        this.getAllSelectData();
    }

    /**
     * Obtains the data for the select fields
     */
    async getAllSelectData() {
        let item = {...this.state};
        let changed=false;
        for (const col of this.props.columns) {
            if(col.type==="select") {
                if(item["selectData"][col.id]===undefined) {
                    let selectOptions = await this.getSelectDataFromApi(col.selectApiName, col.selectApiParameter, col);
                    item["selectData"][col.id] = selectOptions;
                    console.log("In getAllSelectDataFromApi item[\"selectData\"]["+col.id+"] = "+selectOptions);
                    changed=true;
                }
            }
        }
        if(changed) {
            console.log("Set state with select data");
            this.setState(item);
        }
    }
    /**
     * Obtains the data for the select fields
     */
    async getSelectDataFromApi(selectApiName, selectApiParameter, column) {
        console.log("Start getSelectDataFromApi for selectApiName "+selectApiName+" selectApiParameter "+selectApiParameter+" this.state.editData[selectApiParameter]: "+this.state.editData[selectApiParameter]);
        if(column.editable===false) {
            return;
        }
        let url = commonData.getApiLink()+selectApiName+"/"+this.state.editData[selectApiParameter];
        if(this.state.editData[selectApiParameter]===undefined) {
            url = commonData.getApiLink()+selectApiName;
        }

        let rows = undefined;
        console.log("getSelectDataFromApi "+url+" this.state.editData[selectApiParameter] "+this.state.editData[selectApiParameter]+" selectApiName "+selectApiName+" selectApiParameter "+selectApiParameter);
        await axios.get(url, commonData.config)
            .then(res => {
                console.log(res.data);
                rows = res.data["_embedded"][column.selectApiPath];
                console.log("extracted rows for "+column.selectApiPath+" are "+JSON.stringify(rows));
                /*let item = {...this.state};
                item.state.selectData[colName] = rows;
                this.setState(item);*/
            })
            .catch(error => {
                console.log("Error is"+error);
            });
        return rows;
    }

    render() {
        console.log("Start render GE "+JSON.stringify(this.state.editData));
        return (<Container>
            <Helmet>
                <title>Iq test</title>
                <meta name="description" content="IQ test"/>
            </Helmet>
            <br/>
            {this.props.id ? 'Edit ' : 'Add'}
            <Form onSubmit={this.handleSubmit}>
                {
                    this.props.columns.map((column, i) => (
                        <Box key={"edd"+i} sx={{border: 0}}>
                            {column.editable===true?
                                column.type==="file"?
                                    <Box sx={{border: 1, borderColor: "divider", padding:"15px", borderRadius: '5px'}}>
                                        <input type="file"
                                            id={column.id}
                                            onChange={this.handleChange}
                                            sx={{width: "100%"}}/><br/>
                                        <Box sx={{padding:"2px", borderRadius: '2px'}}>
                                             <img src={`${this.state.editData[column.id]}`} width={100} sx={{border: 1, padding:"2px"}} alt="..."/>
                                        </Box>
                                    </Box>:
                                    column.type==="select"?
                                        <Box sx={{padding:"2px", borderRadius: '2px'}}>
                                            {column.label}{column.mandatory?"*":""}  :
                                            <Select
                                                id={column.id}
                                                name={column.id}
                                                label={column.label}
                                                variant="outlined"
                                                value={Array.isArray(this.state.selectData[column.id])&&this.state.editData[column.id]!==null&&this.state.editData[column.id]!==undefined?this.state.editData[column.id]["id"]:''}
                                                onChange={this.handleChangeSelect}
                                                sx={{width: "100%"}}>
                                                {column.notNull?"":<MenuItem key={0} value="">No value</MenuItem>}
                                                {
                                                    Array.isArray(this.state.selectData[column.id])?
                                                        this.state.selectData[column.id].map((row,index) => (
                                                            column.selectApiColumnType==="image"?
                                                                <MenuItem key={row.id} value={row.id}><img src={`${row[column.selectApiColumnName]}`} width={100} sx={{border: 1, padding:"2px"}} alt="..."/></MenuItem>:
                                                                /*<MenuItem key={row.id} value={row.id}>{row.id}</MenuItem>:*/
                                                                <MenuItem key={row.id} value={row.id}>{row[column.selectApiColumnName]}</MenuItem>
                                                    )):null
                                                }
                                            </Select>
                                            <br/>
                                            <br/>
                                        </Box>:
                                        <Box>
                                            {column.label}{column.mandatory?"*":""}  :
                                            <TextField
                                                id={column.id}
                                                //label={column.label}
                                                variant="outlined"
                                                value={this.state.editData[column.id]||''}
                                                onChange={this.handleChange}
                                                autoComplete='off'
                                                type={column.type==="numeric"?"number":""}
                                                sx={{width: "100%"}}/>
                                            <br/>
                                            <br/>
                                        </Box> :
                                <Input
                                    type="hidden"
                                    id={column.id}
                                    label={column.label}
                                    value={this.state.editData[column.id]||''}
                                    onChange={this.handleChange}
                                    fullWidth={false}
                                    sx={{width: "0%"}}
                                />
                            }
                        </Box>
                    ))
                }
                <FormGroup>
                    <Button variant="outlined" type="submit">Save</Button>{' '}
                    <Button variant="outlined" onClick={this.closePopup}>Cancel</Button>
                </FormGroup>
                <br/>

                {this.state.message!==""?this.state.message.split("&").map((message, index)=>(<Typography key={"message"+index} color="#AA1111">{message}</Typography>)):"..."}
                <br/>
                <br/>
            </Form>
        </Container>);
    }

}
export default GenericEdit;

