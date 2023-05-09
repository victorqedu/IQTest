import {Component} from "react";
import {Box, Button, Container, Input, MenuItem, Select, TextField} from "@mui/material";
import axios from "axios";
import {Form, FormGroup} from "reactstrap";
import commonData from "../genericClasses/commonData";

class GenericEdit extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.getBase64 = this.getBase64.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);

        this.state = {
            editData: this.props.id!==undefined?this.props.selectedRowData():{},
            changed: false,
            message: "",
            success: false,
        };
    }

    componentDidMount() {
    }

    async handleChange(event) {
        const target = event.currentTarget;
        let name = target.getAttribute("id");
        console.log("handleChange for name "+name);
        let item = {...this.state};
        item.changed=1;
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
                        console.log("changed "+name+" with value "+target.files[0].name+" b64 "+obj[name]);
                    }
                } else {
                    obj[name] = target.value;
                    console.log("changed "+name+" with value "+target.value);
                }
            }
        }

        item.editData = obj;
        this.setState(item);
    }

    async handleChangeSelect(event) {
        console.log("handleChangeSelect for "+event.target.name);
    }

    async handleSubmit(event) {
        console.log("Start handleSubmit this.state.changed "+this.state.changed);
        event.preventDefault();
        if(this.state.changed===1) {
            console.log("Sending JSON data :"+JSON.stringify(this.state.editData));
            let item = {...this.state};
            item.message = "Changes have been detected, saving data";
            this.setState(item);
            if (typeof this.state.editData.id == 'undefined' || this.state.editData.id === '') {
                axios.post('http://caido.ro:8080/api/'+this.props.apiName, JSON.stringify(this.state.editData), commonData.config)
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
                axios.put("http://caido.ro:8080/api/"+this.props.apiName+"/"+this.props.id, JSON.stringify(this.state.editData), commonData.config)
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
            let item = {...this.state};
            item.message = "There are no changes to save on this form";
            this.setState(item);
        }
    }

    closePopup(event) {
        console.log("Start closePopup for edit data "+this.state.editData);
        if(event!=null) {
            event.preventDefault();
        }

        if(typeof this.props.closeFeedback !== 'undefined') {
            this.props.closeFeedback(this.state.editData, this.state.success);
        }
    }

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
       /* let baseURL = "";
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            baseURL = reader.result;
            console.log("b64 data "+baseURL);
        };
        return baseURL;*/
    };

    render() {
        return (<Container>
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
                                            {column.label}:
                                            <Select
                                                id={column.id}
                                                name={column.id}
                                                label={column.label}
                                                variant="outlined"
                                                value={this.state.editData[column.id]||''}
                                                onChange={this.handleChangeSelect}
                                                sx={{width: "100%"}}>
                                                <MenuItem value={10}>Ten</MenuItem>
                                            </Select>
                                            <br/>
                                            <br/>
                                        </Box>:
                                        <Box>
                                            <TextField
                                                id={column.id}
                                                label={column.label}
                                                variant="outlined"
                                                value={this.state.editData[column.id]||''}
                                                onChange={this.handleChange}
                                                autoComplete='off'
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
                <br/>
                <br/>
                <FormGroup>
                    <Button variant="outlined" type="submit">Save</Button>{' '}
                    <Button variant="outlined" onClick={this.closePopup}>Cancel</Button>
                </FormGroup>
            </Form>
            {this.state.message||''}
        </Container>);
    }

}
export default GenericEdit;

