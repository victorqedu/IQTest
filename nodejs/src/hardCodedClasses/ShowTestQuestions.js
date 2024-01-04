import React, {Component} from "react";
import {
    Box,
    Button, CircularProgress,
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer, TableHead,
    TableRow, TextField
} from "@mui/material";
import commonData from "../genericClasses/commonData";
import QuestionsOptions from "../entities/QuestionsOptions";
import bg from "../images/bg3.jpg";
import GenericEdit from "../genericClasses/GenericEdit";
import TestsSessions from "../entities/TestsSessions";
import axios from "axios";
import { Helmet } from 'react-helmet';
import ResponsiveData from "../genericClasses/ResponsiveData";
import Timer from "../genericClasses/Timer";
import '../App.css';
import Countdown from "react-countdown";

class ShowTestsQuestions extends Component {
    constructor(props) {
        super(props);
        this.startSubmitProcess = this.startSubmitProcess.bind(this);
        this.handleCheckSubmit = this.handleCheckSubmit.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleAnswer = this.handleAnswer.bind(this);
        this.answerCell = this.answerCell.bind(this);
        this.openAreYouSureDialog = this.openAreYouSureDialog.bind(this);
        this.prepareTestDataToSave = this.prepareTestDataToSave.bind(this);
        this.nextQuestionWhenTimerHasExpired = this.nextQuestionWhenTimerHasExpired.bind(this);
        this.shuffleArray = this.shuffleArray.bind(this);
        this.answerSection = this.answerSection.bind(this);
        this.handleResponseChange = this.handleResponseChange.bind(this);
        this.checkIfTheCurrentQuestionHasBeenAnsweredCorrectly = this.checkIfTheCurrentQuestionHasBeenAnsweredCorrectly.bind(this);
        this.saveCurrentQuestionData = this.saveCurrentQuestionData.bind(this);
        this.genericNextQuestion = this.genericNextQuestion.bind(this);
        this.showErrorAndMoveToNextQuestion = this.showErrorAndMoveToNextQuestion.bind(this);
        this.randomImage = this.randomImage.bind(this);
        this.setNextQuestionData = this.setNextQuestionData.bind(this);

        this.state = {
            questions: this.props.questions,
            questionsOptions: [], // list of all the QuestionOptions for all the questions that have been displayed
            questionsAnswers: [], // saves objects of the type QuestionOptions for every question answered by the user, here are saved only the QuestionOptions that have been selected as a correct answer by the user
            questionsTextAnswers: [], // saves the text value as a response to every question that is not a question with options to answer but a text to input
            questionsCorrect: [], // saves if the question has been answered correctly
            correct: undefined, // if the current question has been answered correctly
            currentQuestionOptions: {}, // the list of QuestionOptions for the current question
            currentQuestion: 0,
            isAreYouSureOpen: false, // the variable that will display the dialog that will ask the user if is sure that he wants to submit the results to the API as long as not all the questions are answered
            isPopupEditorOpened: false,
            result: undefined, // this is the final result like "Your IQ is..." or "The final result is..."
            is800w: true,
            isPortrait: false,
            isTabletOrMobile: false,
            hasTimers: false,
            test: this.props.test,
            loadingNextQuestion: true, // when true I will display a special windows that says loading next question
            endTime: undefined, //the time when this test will end because of the time restriction per test
            theResponse: "", // this is the respone in text format, when the user inputs the data in a TextField
            buttonStyleBase: {
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
                borderBottomLeftRadius: "15px",
                borderBottomRightRadius: "15px",
                border: "0px solid #0d0610",
                backgroundColor: "#FFFFFF",
                color: "#000000",
                margin: '1px',
                '&:hover': {
                    backgroundColor: '#dacdbd', // Change this to the desired hover color
                    border: "0px solid #0d0610",
                },
            },
            buttonStyleAnswered: {
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
                borderBottomLeftRadius: "15px",
                borderBottomRightRadius: "15px",
                border: "0px solid #0d0610",
                backgroundColor: "#e8cf00",
                color: "#000000",
                margin: '1px',
                '&:hover': {
                    backgroundColor: '#e8cf00', // Change this to the desired hover color
                    border: "0px solid #0d0610",
                },
            },
            buttonStyleCurrent: {
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
                borderBottomLeftRadius: "15px",
                borderBottomRightRadius: "15px",
                border: "2px solid #e9ccb8",
                backgroundColor: "#e9ccb8",
                color: "#000000",
                margin: '2px',
                '&:hover': {
                    backgroundColor: '#e9ccb8', // Change this to the desired hover color
                    border: "3px solid #FFAAAA",
                },
            },
            buttonStyleWrong: {
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
                borderBottomLeftRadius: "15px",
                borderBottomRightRadius: "15px",
                border: "2px solid #e9ccb8",
                backgroundColor: "#faa0a0",
                color: "#000000",
                margin: '2px',
                '&:hover': {
                    backgroundColor: '#faa0a0', // Change this to the desired hover color
                    border: "2px solid #e9ccb8",
                },
            },
        };
        this.state.questions.map((q,i)=>{
            if(q["maxTime"]!==null) {
                console.log("Found maxtime not null");
                this.state.hasTimers = true;
            }
            return "";
        });
    }

    /**
     * This function starts the submit process but actually the only thing it's doing is to open the popup editor that will collect the data about the person that completed the test.
     * So it  will collect data as name, age and sex
     * @param event
     * @returns {Promise<void>}
     */
    async startSubmitProcess(event) {
        console.log("Start handleSubmit");
        let item = {...this.state};
        item.isPopupEditorOpened = true;
        item.isAreYouSureOpen = false;
        this.setState(item);
    }

    /**
     * The function executes only when the user manually clicks on the Submit answers button
     * The function check if all questions have answers and if the proceeds to handleSubmit
     * @param event
     * @returns {Promise<void>}
     */
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
            let item = {...this.state};
            item.isAreYouSureOpen = true;
            if(this.state.test.detailedResults===1) { // if not all questions have answers it means that we could have questions for wich we have not yet downloaded the options list and if detailedResults===1 than we willo neede all the options to print them in the final screen
                for(let i=0;i<this.state.questions.length;i++) {
                    let data = (await commonData.getDataFromApi(QuestionsOptions.apiName, this.state.questions[i]["id"], QuestionsOptions.apiPath)).data;
                    let item = {...this.state};
                    item.questionsOptions[i] = data;
                    this.setState(item);
                }
            }
            this.setState(item);
        } else {
            await this.startSubmitProcess(null);
        }
    }

    /**
     * After render this function executes and retrieves the current question options from the database and proceeds to shuffle them
     * @returns {Promise<void>}
     */
    async componentDidMount() {
        console.log("StartcomponentDidMount");
        let data = (await commonData.getDataFromApi(QuestionsOptions.apiName, this.state.questions[0]["id"], QuestionsOptions.apiPath)).data;
        //console.log("ComponentDidMount "+JSON.stringify(item.currentQuestionOptions));
        let item = {...this.state};
        item.currentQuestionOptions = data;
        if(item.currentQuestionOptions!==undefined && item.currentQuestionOptions.length>0) {
            this.shuffleArray(item.currentQuestionOptions);
        }
        await this.randomImage(item, 0);
        item.loadingNextQuestion = false;
        this.setState(item);
    }

    /**
     * This function executes only when the user clicks on a question number to skip to a specific question
     * @param event
     * @returns {Promise<void>}
     */
    async handleQuestionChange(event) {
        let questionIndex = event.currentTarget.id;
        let item = {...this.state};
        await this.saveCurrentQuestionData(item, undefined);
        switch (questionIndex) {
            case "firstPage": {
                questionIndex = 0;
                break;
            }
            case "lastPage": {
                questionIndex = item.questions.length-1;
                break;
            }
            default: {
                questionIndex = parseInt(questionIndex);
                break;
            }
        }
        await this.genericNextQuestion(item, questionIndex);
        this.setState(item);
    }

    /**
     * Checks if the current question has been correctly answered
     * @returns {Promise<void>}
     */
    checkIfTheCurrentQuestionHasBeenAnsweredCorrectly(indexAnswer) {
        console.log("Start checkIfTheCurrentQuestionHasBeenAnsweredCorrectly");
        if(this.state.test.options===1) { // if options = 1 than the answer can be a single response from the list of answers, the rest are wrong
            if(indexAnswer!==undefined && this.state.currentQuestionOptions[indexAnswer]["id"]===this.state.questions[this.state.currentQuestion]["idQuestionsOptionsCorrect"]["id"]) {
                console.log("Correct answer");
                return true;
            } else {
                console.log("Incorrect answer");
                return false;
            }
        } else { // if option != 1 than all the answers from the list of answers are correct and I need to check is the answer matches any (on this else branch I will only have the text answers)
            const isCorrect = this.state.currentQuestionOptions.some((o) => {
                console.log("Current option description " + o.description);
                if (o.description.toLowerCase() === this.state.theResponse.toLowerCase()) {
                    console.log("Correct text answer");
                    return true;
                }
                console.log("Incorrect text answer");
                return false;
            });
            return isCorrect;
        }
    }

    /**
     * Saves the data of the current question, e.g.:
     * - the response(text or option)
     * - the general status(correct or incorrect)
     * @returns {Promise<void>}
     */
    async saveCurrentQuestionData(item, indexAnswer) {
        console.log("Start saveCurrentQuestionData");
        item.correct = this.checkIfTheCurrentQuestionHasBeenAnsweredCorrectly(indexAnswer);
        console.log("saveCurrentQuestionData item.correct "+item.correct);
        item.questionsCorrect[item.currentQuestion] = item.correct;
        item.questionsOptions[item.currentQuestion] = item.currentQuestionOptions;

        if(this.state.test.options===1) { // if options = 1 than the answer can be a single response from the list of answers, the rest are wrong
            if(indexAnswer!==undefined) { // if the timer expires without selecting one answer than I will have no indexAnswer
                item.questionsAnswers[item.currentQuestion] = item.currentQuestionOptions[indexAnswer];
            }
        } else { // if option != 1
            item.questionsTextAnswers[item.currentQuestion] = item.theResponse;
        }
    }

    /**
     * This function executes in 2 cases:
     * 1) When a set of options is presented to the user and the user picks one of the options
     * 2) When the test's answer if of type text and the user clicks on the "Next" question
     * The function checks if the answer is correct and displays Correct or incorrect on the screen for 1 second and
     * then proceeds to the next question or submits the answers if we are at the last question
     * @param event
     * @returns {Promise<void>}
     */
    async handleAnswer(event) {
        console.log("Start handleAnswer");
        event.preventDefault();

        let indexAnswer = event.currentTarget.id; // "indexAnswer" is the answer index(0,1,2,3,4,5...) in the array of possible answers, is not the indexAnswer from the database
        let item = {...this.state};
        await this.saveCurrentQuestionData(item, indexAnswer);
        await this.saveCurrentQuestionData(item, indexAnswer);
        if(item.currentQuestion<item.questions.length-1) { // if I'm not at the last question
            await this.genericNextQuestion(item);
        } else { // this is the last question, start the process of submitting the data to the API
            await this.startSubmitProcess(null);
        }
    }

    async randomImage(item, currentQuestion) {
        if(this.state.test.randomImages===1) {
            if(item.questions[currentQuestion]["image"]===undefined || item.questions[currentQuestion]["image"]===null) {
                item.questions[currentQuestion]["image"] = (await commonData.getDataFromApi("getRandomImage", undefined, "image")).data;
                if(item.questions[currentQuestion]["imageWidth"]===null || item.questions[currentQuestion]["imageWidth"]===undefined) {
                    item.questions[currentQuestion]["imageWidth"] = 400;
                }
            }
        }
    }

    /**
     Displays if the current answer is correct/incorrect and goes to the next question
     * @returns {Promise<void>}
     */
    async genericNextQuestion(item, nextQuestionIndex) {
        console.log("Start genericNextQuestion");
        let currentQuestion = item.currentQuestion+1
        if(nextQuestionIndex!==undefined) {
            currentQuestion = nextQuestionIndex;
        }
        console.log("in genericNextQuestion current q font is "+item.questions[currentQuestion]?.fontSize);
        await this.showErrorAndMoveToNextQuestion(item, currentQuestion);
    }

    async showErrorAndMoveToNextQuestion(item, currentQuestion) {
        /**
         * I set the state and show if the answer is correct/incorrect and in the callback, after 1 second I move to the next question
         */
        item.loadingNextQuestion = true;
        await this.setState(item);
        let currentQuestionOptions = item.questionsOptions[currentQuestion];
        if(commonData.isEmpty(currentQuestionOptions)) {
            currentQuestionOptions = (await commonData.getDataFromApi(QuestionsOptions.apiName, item.questions[currentQuestion]["id"], QuestionsOptions.apiPath)).data;
            await this.randomImage(item,currentQuestion);
        }
        item.loadingNextQuestion = false;

        if(this.state.test.detailsPerQuestion===0) {
            await this.setNextQuestionData(item, currentQuestion, currentQuestionOptions);
        } else {
            let ti = setInterval(() => {
                this.setNextQuestionData(item, currentQuestion, currentQuestionOptions);
                clearInterval(ti);
            }, 1000);
        }
    }

    async setNextQuestionData(item, currentQuestion, currentQuestionOptions) {
        item.currentQuestion = currentQuestion;
        item.theResponse = item.questionsTextAnswers[item.currentQuestion]||"";
        item.currentQuestionOptions = currentQuestionOptions;
        item.correct = item.questionsCorrect[item.currentQuestion];

        if(item.currentQuestionOptions!==undefined && item.currentQuestionOptions.length>0) {
            this.shuffleArray(item.currentQuestionOptions);
        }
        this.setState(item);
        console.log("this.timerRef "+this.timerRef);
        if(!commonData.isEmpty(this.timerRef)) {
            this.timerRef.resetTimer();
        }
    }

    /**
     * generic function to shuffle any array, I use it to shuffle the questions when no order is required and to shuffle the answers
     * @param array
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * Skips to the next question or submits the data
     * This function is called only when questions where the field maxTime is defined and the timer is available and the timer has expired, e.g. the user hasn't answered int the required time.
     * @returns {Promise<void>}
     */
    async nextQuestionWhenTimerHasExpired() {
        let item = {...this.state};
        await this.saveCurrentQuestionData(item, undefined);
        if(item.currentQuestion<item.questions.length-1) {
            await this.genericNextQuestion(item);
        } else {
            await this.startSubmitProcess(null);
        }
    }

    /**
     * This function displays the answers sections, eg:
     * - the list of options
     * - or a text field when the user must mannually insert the answer
     * @param dimFactor
     * @returns {JSX.Element}
     */
    answerSection(dimFactor) {
        if(this.state.test.options===1) {
            let questionsLen = this.state.currentQuestionOptions.length;
            if(questionsLen<=4) {
                return <TableBody>
                    <TableRow>
                        {questionsLen>0 && this.answerCell(0, dimFactor)}
                        {questionsLen>1 && this.answerCell(1, dimFactor)}
                    </TableRow>
                    <TableRow>
                        {questionsLen>2 && this.answerCell(2, dimFactor)}
                        {questionsLen>3 && this.answerCell(3, dimFactor)}
                    </TableRow>
                </TableBody>;
            } else {
                return <TableBody>
                    <TableRow>
                        {questionsLen>0 && this.answerCell(0, dimFactor)}
                        {questionsLen>1 && this.answerCell(1, dimFactor)}
                        {questionsLen>2 && this.answerCell(2, dimFactor)}
                    </TableRow>
                    <TableRow>
                        {questionsLen>3 && this.answerCell(3, dimFactor)}
                        {questionsLen>4 && this.answerCell(4, dimFactor)}
                        {questionsLen>5 && this.answerCell(5, dimFactor)}
                    </TableRow>
                </TableBody>;
            }

        } else {
            return <TableBody>
                <TableRow>
                    <TableCell sx={{padding: 1, width: '33%'}} align="center">
                        <TextField
                            id="theResponse"
                            variant="outlined"
                            value={this.state.theResponse}
                            autoComplete='off'
                            sx={{width: "90%"}}
                            onChange={this.handleResponseChange}/>
                        <Button variant="contained" sx={{width: "90%", height: "80px", margin:"15px", ...this.state.buttonStyleCurrent}} onClick={this.handleAnswer}>Next</Button>
                    </TableCell>
                </TableRow>
            </TableBody>;
        }
    }

    /**
     * The function executes only if the answer is of type text(the user must not select an option from a list but he must insert mannually the answer from the keyboard)
     * theResponse variable is a special variable used to save the input of the user.
     * @param event
     * @returns {Promise<void>}
     */
    async handleResponseChange(event) {
        const target = event.currentTarget;
        let item = {...this.state};
        item.theResponse = target.value||"";
        this.setState(item, () => {
            let item = {...this.state};
            item.correct = this.checkIfTheCurrentQuestionHasBeenAnsweredCorrectly(undefined);;
            this.setState(item);
        });
    }

    /**
     * Creates a button to be clicked by the user for the tests that use a list of options
     * @param answerNumber
     * @param dimFactor
     * @returns {JSX.Element}
     */
    answerCell(answerNumber, dimFactor) {
        return <TableCell sx={{padding: 0, width: '33%'}} align="center">
                    <Button id={answerNumber} key={"page"+answerNumber} variant="" onClick={this.handleAnswer}
                            sx={{ width: '97%', height: '100px', ...this.state.buttonStyleCurrent,
                                fontSize: this.state.currentQuestionOptions[answerNumber]?.fontSize+"px",
                                border: 3, padding:0.3, borderColor: this.state.currentQuestionOptions[answerNumber]["id"]===this.state.questionsAnswers[this.state.currentQuestion]?.id?"#FFAAAA":"white"
                            }}
                            className="glowing-text-button">
                        {
                            this.state.currentQuestionOptions[answerNumber]["image"]===null?
                                this.state.currentQuestionOptions[answerNumber]["description"]:
                                <img src={`${this.state.currentQuestionOptions[answerNumber]["image"]}`} width={100*dimFactor} sx={{border: 1, padding:"2px"}} alt="..."/>
                        }
                    </Button>
            </TableCell>
    }

    /**
     * Openes the dialog that asks the user if the applications should really submit the test results to the API, even if not all the questions have been answered
     * @param event
     */
    openAreYouSureDialog(event) {
        let item = {...this.state};
        item.isAreYouSureOpen = true;
        this.setState(item);
    }

    /**
     * Creates the JSON necessary to send to the API in order to sate the test session data
     * This contains all the data about the user that taok the test and about the answers he provided
     * This data will be sent to the GenericEdit class that will send it to the API
     * @returns {{}}
     */
    prepareTestDataToSave() {
        let row = {};
        let objTest = {};
        objTest["id"] =  this.props.test.id;
        row["idTests"] = objTest;
        row["testsSessionsAnswers"] = [];
        for(let i=0;i<this.state.questions.length;i++) {
            if(this.state.test.options===1 && this.state.questionsAnswers[i]!==undefined) {
                let tsa = {};
                tsa["idQuestions"] = {id: this.state.questions[i]["id"]};
                row["testsSessionsAnswers"].push(tsa);
                tsa["idQuestionsOptions"] = {id: this.state.questionsAnswers[i]?.id};
            } else if(this.state.test.options!==1) {
                let tsa = {};
                tsa["idQuestions"] = {id: this.state.questions[i]["id"]};
                tsa["textResponse"] = this.state.questionsTextAnswers[i];
                row["testsSessionsAnswers"].push(tsa);
            }
        }
        console.log("getData "+JSON.stringify(row));
        return row;
    }

    /**
     * renders the data to be displayed
     * @returns {JSX.Element}
     */
    render() {
        if(this.state.test===undefined) {
            return "Se incarca datele...";
        }
        console.log("this.state.test.maxTime "+this.state.test.maxTime+"this.state.loadingNextQuestion "+this.state.loadingNextQuestion);
        const renderer = ({ hours, minutes, seconds, completed }) => {
            if (completed) {
                this.startSubmitProcess(null);
                return <span>Timpul a expirat!</span>;
            } else {
                return (
                    <span>
                        Timp rămas <br/>{hours}:{minutes}:{seconds}
                    </span>
                );
            }
        };


        //console.log("Render this.state.resultsText  is "+this.state.resultsText );
        const updateResponsiveData = (is800w, isPortrait, isTabletOrMobile) => {
            if(this.state.is800w!==is800w || this.state.isPortrait!==isPortrait || this.state.isTabletOrMobile!==isTabletOrMobile) {
                console.log("is800w "+is800w+" isPortrait "+isPortrait);
                let item = {...this.state};
                item.is800w = is800w;
                item.isPortrait = isPortrait;
                item.isTabletOrMobile = isTabletOrMobile;
                this.setState(item);
            }
        }

        const handleCloseAreYouSure = () => {
            let item = {...this.state};
            item.isAreYouSureOpen = false;
            this.setState(item);
        };

        const handleClose = (editData, success) => {
            if(success) {
                axios.get(commonData.getApiLink()+"testssessionpoints/"+editData.id, commonData.getConfig())
                    .then(res => {
                        let points = res.data;
                        axios.get(commonData.getApiLink()+"testsMaxPoints/"+this.state.test.id, commonData.getConfig())
                            .then(res => {
                                let maxPoints = res.data;
                                let item = {...this.state};
                                item.isPopupEditorOpened = false;
                                item.result = item.test.resultsText+" "+points+"/"+maxPoints;
                                this.setState(item);
                            }).catch(error => {
                            console.log("Error is"+error);
                        });
                    }).catch(error => {
                        console.log("Error is"+error);
                    });
            }
        };

        let dimFactor = 1;
        if(!this.state.is800w) {
            dimFactor=0.7;
        } else if(this.state.isTabletOrMobile) {
            dimFactor=0.7;
        }
        //console.log("current q: "+this.state.currentQuestion+" currentQuestionOptions.size "+this.state.currentQuestionOptions.length+" isAreYouSureOpen "+this.state.isAreYouSureOpen);
        const handleTimerEnd = () => {
            this.nextQuestionWhenTimerHasExpired();
        };

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
                        <Button onClick={this.startSubmitProcess} autoFocus>Submit</Button>
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
                            selectedRowData={this.prepareTestDataToSave}
                            apiEditName="testssessions"
                            columns={TestsSessions.Columns}
                            tabLinkColumn={undefined}
                        />
                    </div>
                </Dialog>
                <ResponsiveData updateResponsiveData={updateResponsiveData}/>
                {
                    this.state.result===undefined?
                        <Paper sx={{ width: '750px', mb: 2, padding: 1, margin: "15px",borderRadius: "10px", border: "2px solid #0A0610",backgroundColor: '#f4ede5', color: '#000000',}}>
                            <TableContainer component={Paper} sx={{
                                borderTopLeftRadius: "10px", // Set this to 0 to keep the top left corner straight
                                borderTopRightRadius: "10px", // Set this to 0 to keep the top right corner straight
                                borderBottomLeftRadius: "0px", // Adjust the value for rounded bottom left corner
                                borderBottomRightRadius: "0px", // Adjust the value for rounded bottom right corner
                                border: "1px solid #0A0610",backgroundColor: '#f4ede5', color: '#000000',}}>

                                <Table border={0}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell sx={{padding: 1, width: '33%'}} align="left">
                                                <a href="/"><Button sx={{color: '#000000',}}>HOME</Button></a>
                                            </TableCell>
                                            <TableCell sx={{padding: 1, width: '33%'}} align="center">
                                                {
                                                    (this.state.correct===undefined || this.state.test.detailsPerQuestion===0)?
                                                        "":
                                                        this.state.correct?
                                                            <Button variant="contained" color="success">CORRECT</Button>:
                                                            <Button variant="contained" color="error">INCORRECT</Button>
                                                }
                                            </TableCell>
                                            <TableCell sx={{padding: 1, width: '33%'}} align="right">
                                                {
                                                    this.state.test.maxTime>0
                                                        ?<Countdown date={this.state.endTime} renderer={renderer}/>
                                                        :(this.state.questions[this.state.currentQuestion]["maxTime"]>0 && !this.state.loadingNextQuestion)
                                                            ?<Timer initialTime={this.state.questions[this.state.currentQuestion]["maxTime"]} onTimerEnd={handleTimerEnd} ref={(ref) => (this.timerRef = ref)}/>
                                                            :""
                                                }
                                            </TableCell>
                                        </TableRow>
                                        {
                                            !commonData.isEmpty(this.state.test.text) &&
                                            <TableRow>
                                                <TableCell sx={{padding: 0}} align="left" colSpan={3}>
                                                    <div dangerouslySetInnerHTML={{ __html: this.state.test.text }} />
                                                </TableCell>
                                            </TableRow>
                                        }

                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {
                                this.state.loadingNextQuestion
                                    ?<Box sx={{
                                        display: 'flex',
                                        padding: "20px",
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        minHeight: '200px',
                                    }}>
                                        <CircularProgress color="inherit"/>
                                    </Box>
                                    :this.state.isPortrait
                                        ?Array.isArray(this.state.currentQuestionOptions) &&
                                        <TableContainer component={Paper}>
                                            <Table border={0} >
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell sx={{border: 0,padding: 0}} align="center">
                                                            <Table border={0} sx={{border: 0,padding: 0,}} >
                                                                <TableBody>
                                                                    <TableRow sx={{border: 0,padding: 0,}}>
                                                                        <TableCell sx={{padding: 0,border: 0, fontSize: this.state.questions[this.state.currentQuestion]?.fontSize+"px"}} align="left">
                                                                            <div>
                                                                                {
                                                                                    this.state.questions[this.state.currentQuestion]["description"].split('\n').map((line, index) => (
                                                                                        <React.Fragment key={index}>
                                                                                            {line}<br/>
                                                                                        </React.Fragment>
                                                                                    ))
                                                                                }
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    <TableRow sx={{border: 0,padding: 0,}}>
                                                                        <TableCell sx={{padding: 0,border: 0, fontSize: this.state.questions[this.state.currentQuestion]?.fontSize+"px"}} align="center">
                                                                            {
                                                                                commonData.isEmpty(this.state.questions[this.state.currentQuestion]["image"])
                                                                                    ?""
                                                                                    :<img src={`${this.state.questions[this.state.currentQuestion]["image"]}`}
                                                                                          width={commonData.isEmpty(this.state.questions[this.state.currentQuestion]["imageWidth"])
                                                                                              ?300
                                                                                              :this.state.questions[this.state.currentQuestion]["imageWidth"]*dimFactor}
                                                                                          className="roundedImage" alt="i1"/>
                                                                            }
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableBody>
                                                            </Table>
                                                        </TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell sx={{padding: 0}} align="center">
                                                            <TableContainer component={Paper}>
                                                                <Table border={0}>
                                                                    {this.answerSection(dimFactor)}
                                                                </Table>
                                                            </TableContainer>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        :Array.isArray(this.state.currentQuestionOptions) &&
                                        <TableContainer component={Paper} >
                                        <Table border={0} >
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell sx={{padding: 0}} align="center">
                                                        <Table border={0} >
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell sx={{padding: 0, fontSize: this.state.questions[this.state.currentQuestion]?.fontSize+"px"}} align="left">
                                                                        <div>
                                                                            {
                                                                                this.state.questions[this.state.currentQuestion]["description"].split('\n').map((line, index) => (
                                                                                    <React.Fragment key={index}>
                                                                                        {line} <br/>
                                                                                    </React.Fragment>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                        <div align="center">
                                                                            {
                                                                                commonData.isEmpty(this.state.questions[this.state.currentQuestion]["image"])
                                                                                    ?""
                                                                                    :<img src={`${this.state.questions[this.state.currentQuestion]["image"]}`}
                                                                                          width={commonData.isEmpty(this.state.questions[this.state.currentQuestion]["imageWidth"])
                                                                                              ?300
                                                                                              :this.state.questions[this.state.currentQuestion]["imageWidth"]*dimFactor}
                                                                                          className="roundedImage" alt="i1"/>
                                                                            }
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                    </TableCell>
                                                    <TableCell style={{ verticalAlign: 'bottom' }}>
                                                        <TableContainer component={Paper}>
                                                            <Table sx={{width:300}} border={0}>
                                                                {this.answerSection(dimFactor)}
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
                                    this.state.hasTimers===true?<Box align="left">{"At question "+(this.state.currentQuestion+1)+"/"+this.state.questions.length}</Box>:
                                        Array.isArray(this.state.questions) && this.state.questions.map((row, index) => {
                                            let variant = "outlined";
                                            if(this.state.currentQuestion===index) {
                                                variant = "contained";
                                            }
                                            const buttonStyle =
                                                (this.state.test.detailsPerQuestion === 1 && this.state.questionsCorrect[index]===false)?this.state.buttonStyleWrong:
                                                    this.state.currentQuestion===index?
                                                        this.state.buttonStyleCurrent:
                                                        (
                                                            (this.state.questionsAnswers[index]===undefined || this.state.questionsAnswers[index]==='')
                                                            &&
                                                            (this.state.questionsTextAnswers[index]===undefined || this.state.questionsTextAnswers[index]==='')
                                                        ) ?
                                                            this.state.buttonStyleBase : this.state.buttonStyleAnswered;
                                            return (
                                                <Button
                                                    id={index} key={"page"+index}
                                                    variant={variant}
                                                    onClick={this.handleQuestionChange}
                                                    sx={buttonStyle}
                                                ><b>{index+1}</b></Button>
                                            )
                                        })
                                }
                                {/*<Button id="lastPage" key="lastPage" variant="outlined" sx={{width: 100}} onClick={this.handleQuestionChange}>Last</Button>*/}
                                <br/>
                                {
                                    this.state.hasTimers===true?"":<Button id="submit" key="submit" variant="outlined" sx={{width: 200, ...this.state.buttonStyleCurrent}} onClick={this.handleCheckSubmit}>Submit answers</Button>
                                }

                            </Box>
                        </Paper> :
                        <Paper sx={{ width: '750px', mb: 2, padding: 1, margin:1,
                            borderTopLeftRadius: "0px", // Set this to 0 to keep the top left corner straight
                            borderTopRightRadius: "0px", // Set this to 0 to keep the top right corner straight
                            borderBottomLeftRadius: "10px", // Adjust the value for rounded bottom left corner
                            borderBottomRightRadius: "10px", // Adjust the value for rounded bottom right corner
                            border: "1px solid #0A0610",backgroundColor: '#f4ede5', color: '#000000',}}>
                            <br/>
                            <a href="/"><Button sx={{color: '#000000',}}>HOME</Button></a>
                            <br/>
                            <br/>
                            <h1 align="center">{this.state.result}</h1>
                            <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left"><b>Nr.</b></TableCell>
                                            <TableCell align="left"><b>Question</b></TableCell>
                                            <TableCell align="left"><b>Status</b></TableCell>
                                            <TableCell align="left"><b>Correct answer</b></TableCell>
                                            <TableCell align="left"><b>Your answer</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.test.detailedResults === 1 && this.state.questions.map((q, i) => {
                                            const isCorrect = this.state.test.options === 1
                                                ? this.state.questionsAnswers[i]?.id === q["idQuestionsOptionsCorrect"]["id"]
                                                : this.state.questionsCorrect[i] === true;

                                            return (
                                                <TableRow key={i} className={isCorrect ? 'normalCell' : 'highlightedCell'}>
                                                    <TableCell align="left">{i + 1}.</TableCell>
                                                    <TableCell align="left">{q.description}</TableCell>
                                                    <TableCell align="left">{isCorrect ? 'Correct' : 'Incorrect'}</TableCell>
                                                    <TableCell align="left">{this.state.test.options === 1
                                                        ? q["idQuestionsOptionsCorrect"]["description"]
                                                        : this.state.questionsOptions[i].map((qo, j) => (<div key={j}>{qo.description}</div>))
                                                    }</TableCell>
                                                    <TableCell align="left">{this.state.test.options === 1
                                                        ? this.state.questionsAnswers[i]?.description
                                                        : this.state.questionsTextAnswers[i]
                                                    }</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
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
