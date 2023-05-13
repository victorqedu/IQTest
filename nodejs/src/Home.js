import React, {Component} from "react";
import {Button} from "@mui/material";
import {Form} from "reactstrap";

class Home extends Component {
    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Button variant="outlined" type="submit">Take the test</Button>
            </Form>
        );
    }
}

export default Home;
