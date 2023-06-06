import React, {Component} from "react";
import {Box, Button, Input} from "@mui/material";
import {Form} from "reactstrap";
import commonData from "./genericClasses/commonData";
import Questions from "./entities/Questions";
import ShowTestsQuestions from "./hardCodedClasses/ShowTestQuestions";
import bg from './images/bg.jpg';
import { Helmet } from 'react-helmet';

class Home extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            testId: undefined,
            questions: {},
        };
    }

    async handleSubmit(event) {
        event.preventDefault();
        let testId = event.target.test_id.value;
        console.log("Start handleSubmit for test id "+testId);
        if(testId!==undefined && testId!=null && testId!=="") {
            let item = {...this.state};
            item.testId = testId;
            item.questions = await commonData.getDataFromApi(Questions.apiName, testId, Questions.apiPath);
            console.log("questions size is "+item.questions.length);
            this.setState(item);
        }
    }

    render() {
        if(this.state.testId===undefined) {
            return (
                <>
                    <Helmet>
                        <title>Iq test</title>
                        <meta name="description" content="IQ test"/>
                        <meta name="google-site-verification" content="ovqCMnQY9qDGgKVOXY4IsnN_WE9L3QYV7Okn-7H1Bv0" />
                    </Helmet>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={ { backgroundColor: "lightyellow", backgroundImage: `url(${bg})`,backgroundSize: "cover",color: "#ffffff" }}>
                        <Form onSubmit={this.handleSubmit}>
                            <Input type="hidden" name="test_id" id="test_id" value="9"/>
                            <Button variant="outlined" type="submit">Test your IQ</Button>
                        </Form>
                    </Box>
                </>
            );
        } else {
            return(
                <>
                    <Helmet>
                        <title>Iq test</title>
                        <meta name="description" content="IQ test"/>
                        <meta name="google-site-verification" content="ovqCMnQY9qDGgKVOXY4IsnN_WE9L3QYV7Okn-7H1Bv0" />
                    </Helmet>
                    <ShowTestsQuestions questions={this.state.questions} testId={this.state.testId}/>
                </>
            );
        }
    }
}

export default Home;
