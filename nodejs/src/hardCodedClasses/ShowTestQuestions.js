import React, {Component} from "react";
import {
    Box,
    Button,
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow
} from "@mui/material";
import commonData from "../genericClasses/commonData";
import QuestionsOptions from "../entities/QuestionsOptions";
import bg from "../images/bg.jpg";
import GenericEdit from "../genericClasses/GenericEdit";
import TestsSessions from "../entities/TestsSessions";
import axios from "axios";
import { Helmet } from 'react-helmet';

class ShowTestsQuestions extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheckSubmit = this.handleCheckSubmit.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleAnswer = this.handleAnswer.bind(this);
        this.answerCell = this.answerCell.bind(this);
        this.openAreYouSureDialog = this.openAreYouSureDialog.bind(this);
        this.getData = this.getData.bind(this);

        this.state = {
            questions: this.props.questions,
            questionsAnswers: [],
            currentQuestionOptions: {},
            currentQuestion: 0,
            isAreYouSureOpen: false,
            isPopupEditorOpened: false,
            result: undefined,
        };
    }

    async handleSubmit(event) {
        console.log("Start handleSubmit");
        this.setState({isPopupEditorOpened: true, isAreYouSureOpen:false});
    }

    async handleCheckSubmit(event) {
        console.log("Start handleCheckSubmit");
        let allQuestionsHaveAnswers = true;
        for(let i=0;i<this.state.questions.length;i++) {
            if(this.state.questionsAnswers[i]===undefined) {
                allQuestionsHaveAnswers = false;
            }
        }
        console.log("handleCheckSubmit allQuestionsHaveAnswers "+allQuestionsHaveAnswers);
        if(!allQuestionsHaveAnswers) {
            this.setState({isAreYouSureOpen: true});
        } else {
            await this.handleSubmit(null);
        }
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

    openAreYouSureDialog(event) {
        let item = {...this.state};
        item.isAreYouSureOpen = true;
        this.setState(item);
    }

    getData() {
        console.log("getData "+this.props.testId);

        let row = {};
        let objTest = {};
        objTest["id"] =  this.props.testId;
        row["idTests"] = objTest;
        row["testsSessionsAnswers"] = [];
        for(let i=0;i<this.state.questions.length;i++) {
            if(this.state.questionsAnswers[i]!==undefined) {
                let tsa = {};
                tsa["idQuestions"] = {id: this.state.questions[i]["id"]};
                tsa["idQuestionsOptions"] = {id: this.state.questionsAnswers[i]};
                row["testsSessionsAnswers"].push(tsa);
            }
        }

        console.log("getData "+JSON.stringify(row));
        return row;
    }

    render() {
        const handleCloseAreYouSure = () => {
            this.setState({isAreYouSureOpen: false});
        };
        const handleClose = (editData, success) => {
            if(success) {
                axios.get(commonData.getApiLink()+"testssessionpoints/"+editData.id, commonData.config)
                    .then(res => {
                        console.log(res.data);
                        let item = {...this.state};
                        item.isPopupEditorOpened = false;
                        item.result = res.data;
                        this.setState(item);
                    })
                    .catch(error => {
                        console.log("Error is"+error);
                    });
            }
        };

        console.log("current q: "+this.state.currentQuestion+" currentQuestionOptions.size "+this.state.currentQuestionOptions.length+" isAreYouSureOpen "+this.state.isAreYouSureOpen);
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={ { backgroundColor: "lightyellow", backgroundImage: `url(${bg})`,backgroundSize: "cover",color: "#ffffff" }}>
                <Helmet>
                    <title>Iq test</title>
                    <meta name="description" content="IQ test"/>
                    <meta name="google-site-verification" content="ovqCMnQY9qDGgKVOXY4IsnN_WE9L3QYV7Okn-7H1Bv0" />
                </Helmet>
                <Dialog
                    open={this.state.isAreYouSureOpen}
                    onClose={handleCloseAreYouSure}
                >
                    <DialogTitle id="alert-dialog-title">{"Are you sure?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">Not all questions have answers, are you sure you want to submit? Questions that do not have answers are marked with red text color.</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAreYouSure}>Cancel</Button>
                        <Button onClick={this.handleSubmit} autoFocus>Submit</Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={this.state.isPopupEditorOpened}
                    onClose={handleClose}
                    fullScreen={false}
                    fullWidth
                    maxWidth="sm">
                    <div>
                        <GenericEdit
                            id={undefined}
                            noRows={true}
                            parentSelectedRowId={undefined}
                            closeFeedback={handleClose}
                            selectedRowData={this.getData}
                            apiEditName="testssessions"
                            columns={TestsSessions.Columns}
                            tabLinkColumn={undefined}
                        />
                    </div>
                </Dialog>
                {
                    this.state.result===undefined?
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
                                <Button id="submit" key="submit" variant="outlined" sx={{width: 200}} onClick={this.handleCheckSubmit}>Submit answers</Button>
                            </Box>
                        </Paper> :
                        <Paper sx={{ width: '750px', mb: 2, padding: 1}}>
                            <br/>
                            <br/>
                            <br/>
                            <h1 align="center">Your Iq is {this.state.result}</h1>
                            <br/>
                            <br/>
                            <br/>
                        </Paper>
                }

            </Box>
        );
    }
}

export default ShowTestsQuestions;
