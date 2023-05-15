import React, {Component} from "react";
import {Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow} from "@mui/material";
import commonData from "../genericClasses/commonData";
import QuestionsOptions from "../entities/QuestionsOptions";
import bg from "../images/bg.jpg";

class ShowTestsQuestions extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleAnswer = this.handleAnswer.bind(this);
        this.answerCell = this.answerCell.bind(this);

        this.state = {
            testId: undefined,
            questions: this.props.questions,
            questionsAnswers: [],
            currentQuestionOptions: {},
            currentQuestion: 0,
        };
    }

    async handleSubmit(event) {
        console.log("Start handleSubmit");

    }

    async componentDidMount() {
        console.log("StartcomponentDidMount");
        let item = {...this.state};
        item.currentQuestionOptions = await commonData.getDataFromApi(QuestionsOptions.apiName, item.questions[0]["id"], QuestionsOptions.apiPath);
        this.setState(item);
    }

    async handleQuestionChange(event) {
        let page = event.currentTarget.id;
        let item = {...this.state};
        switch (page) {
            case "firstPage": {
                item.currentQuestion = 0;
                break;
            }
            case "lastPage": {
                item.currentQuestion = item.questions.length-1;
                break;
            }
            default: {
                item.currentQuestion = parseInt(page);
                break;
            }
        }
        console.log("item.currentQuestion "+item.currentQuestion+" page "+page);
        item.currentQuestionOptions = await commonData.getDataFromApi(QuestionsOptions.apiName, item.questions[item.currentQuestion]["id"], QuestionsOptions.apiPath);
        this.setState(item);
    }

    async handleAnswer(event) {
        event.preventDefault();
        let id = event.currentTarget.id;
        let item = {...this.state};
        item.questionsAnswers[item.currentQuestion] = item.currentQuestionOptions[id]["id"];
        if(item.currentQuestion<item.questions.length-1) {
            item.currentQuestion++;
        }
        item.currentQuestionOptions = await commonData.getDataFromApi(QuestionsOptions.apiName, item.questions[item.currentQuestion]["id"], QuestionsOptions.apiPath);
        this.setState(item);
    }

    answerCell(answerNumber) {
        return <TableCell sx={{padding: 0}} align="center">
            <Box sx={{ border: 2, padding:0, borderColor: this.state.currentQuestionOptions[answerNumber]["id"]===this.state.questionsAnswers[this.state.currentQuestion]?"#DDAAAA":"white" }}>
                {answerNumber+1}
                <Button id={answerNumber} key={"page"+answerNumber} variant="" onClick={this.handleAnswer}>
                    <img src={`${this.state.currentQuestionOptions[answerNumber]["image"]}`} width={100} sx={{border: 1, padding:"2px"}} alt="..."/>
                </Button>
            </Box>
        </TableCell>
    }

    render() {
        console.log("current q: "+this.state.currentQuestion+" currentQuestionOptions.size "+this.state.currentQuestionOptions.length);
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={ { backgroundColor: "lightyellow", backgroundImage: `url(${bg})`,backgroundSize: "cover",color: "#ffffff" }}>
            <Paper sx={{ width: '750px', mb: 2, padding: 1}}>
                <br/>
                <br/>
                <br/>
                    {
                        Array.isArray(this.state.currentQuestionOptions) &&
                        <TableContainer component={Paper} >
                            <Table border={0} >
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={{padding: 0}} align="center">
                                            <b>{this.state.questions[this.state.currentQuestion]["description"]}</b>
                                            <br/>
                                            <img src={`${this.state.questions[this.state.currentQuestion]["image"]}`} width={300} sx={{border: 1, padding:"2px"}} alt="..."/>
                                        </TableCell>
                                        <TableCell>
                                            <TableContainer component={Paper}>
                                                <Table sx={{width:300}} border={0}>
                                                    <TableBody>
                                                        <TableRow>
                                                            {this.answerCell(0)}
                                                            {this.answerCell(1)}
                                                            {this.answerCell(2)}
                                                        </TableRow>
                                                        <TableRow>
                                                            {this.answerCell(3)}
                                                            {this.answerCell(4)}
                                                            {this.answerCell(5)}
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                <br/>
                <Box align="center">
                    {/*<Button id="firstPage" key="firstPage" variant="outlined" sx={{width: 100}} onClick={this.handleQuestionChange}>First</Button>*/}
                    {
                        Array.isArray(this.state.questions) &&
                        this.state.questions.map((row, index) => {
                            let variant = "outlined";
                            let color = "error";
                            if(this.state.currentQuestion===index) {
                                variant = "contained";
                            }
                            if(this.state.questionsAnswers[index]!==undefined) {
                                color = "success";
                            }
                            console.log("index "+index+" color "+color);
                            return (
                                <Button id={index} key={"page"+index} variant={variant} onClick={this.handleQuestionChange} color={color}><b>{index+1}</b></Button>
                            )
                        })
                    }
                    {/*<Button id="lastPage" key="lastPage" variant="outlined" sx={{width: 100}} onClick={this.handleQuestionChange}>Last</Button>*/}
                    <Button id="submit" key="submit" variant="outlined" sx={{width: 200}} onClick={this.handleSubmit}>Submit answers</Button>
                </Box>
            </Paper>
            </Box>
        );
    }
}

export default ShowTestsQuestions;
