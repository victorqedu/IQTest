import {Component} from "react";
import {Button, Container, Input, TextField} from "@mui/material";
import Countries from "../entities/Countries";
import axios from "axios";
import {Form, FormGroup} from "reactstrap";
import commonData from "../genericClasses/commonData";


class EditCountries extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closePopup = this.closePopup.bind(this);

        this.state = {
            editData: {
                id: "",
                code: "",
                name: "",
            },
            changed: false,
            message: "",
            success: false,
        };
    }

    handleChange(event) {
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
        switch(name) {
            case "id" : {
                obj["id"] = target.value;
                break;
            }
            case "code" : {
                obj["code"] = target.value;
                break;
            }
            case "name" : {
                obj["name"] = target.value;
                break;
            }
            default: {

            }
        }
        item.editData = obj;
        this.setState(item);
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
                axios.post('http://caido.ro:8080/api/countries', JSON.stringify(this.state.editData), commonData.config)
                    .then(
                        res => {
                            console.log("PUT Ret data: "+JSON.stringify(res.data));
                            let item = {...this.state};
                            item.editData = res.data;
                            this.setState(item, ()=>{
                                if(this.state.success===true) {
                                    this.closePopup();
                                }
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
                axios.put('http://caido.ro:8080/api/countries', JSON.stringify(this.state.editData), commonData.config)
                    .then(
                        res => {
                            console.log("PUT Ret data: "+JSON.stringify(res.data));
                            let item = {...this.state};
                            item.editData = res.data;
                            this.setState(item, ()=>{
                                if(this.state.editData.success===1) {
                                    this.closePopup();
                                }
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
            this.props.closeFeedback(this.state.editData);
        }
    }

    render() {
        return (<Container>
            {this.state.editData.id ? 'Edit ' : 'Add'}
            <Form onSubmit={this.handleSubmit}>
                {
                    Countries.Columns.map((column, i) => (
                        <div key={"edd"+i}>
                            {column.editable===true?
                                <TextField
                                    id={column.id}
                                    label={column.label}
                                    variant="outlined"
                                    value={this.state.editData[column.id]||''}
                                    onChange={this.handleChange}
                                    autoComplete='off'
                                    sx={{width: "100%"}}/>:
                                <Input
                                    type="hidden"
                                    id={column.id}
                                    label={column.label}
                                    variant="outlined"
                                    value={this.state.editData[column.id]||''}
                                    onChange={this.handleChange}
                                    sx={{width: "100%"}}/>
                            }
                            <br/>
                            <br/>
                        </div>
                    ))
                }
                <FormGroup>
                    <Button variant="outlined" type="submit">Save</Button>{' '}
                    <Button variant="outlined" onClick={this.closePopup}>Cancel</Button>
                </FormGroup>
            </Form>
            {this.state.message||''}
        </Container>);
    }
}
export default EditCountries;
