import React, {Component} from "react";
import {
    AppBar,
    Box,
    Button,
    Container, IconButton,
    Input, Menu, MenuItem,
    Toolbar,
} from "@mui/material";
import {Form} from "reactstrap";
import commonData from "./genericClasses/commonData";
import Questions from "./entities/Questions";
import ShowTestsQuestions from "./hardCodedClasses/ShowTestQuestions";
import bg from './images/bg3.jpg';
import { Helmet } from 'react-helmet';
import './App.css';
import Subjects from "./entities/Subjects";
import Contact from "./hardCodedClasses/Contact";
import Login from "./hardCodedClasses/Login";
import {AccountCircle} from "@mui/icons-material";

class Home extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.shuffleArray = this.shuffleArray.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleAccountButtonClick = this.handleAccountButtonClick.bind(this);
        this.handleAccountClose = this.handleAccountClose.bind(this);
        this.updateConnectedState = this.updateConnectedState.bind(this);

        this.state = {
            testId: undefined,
            action: undefined,
            questions: {},
            subjects: [], // all subjects from the database to be exposed in the main menu
            tests: [], // list with all the tests available for the selected subject from the main menu
            anchorEl: null,
            connected: commonData.connected(),
        };
    }

    updateConnectedState(connected) {
        let item = {...this.state};
        item.connected = connected;
        this.setState(item);
    }
    handleAccountButtonClick(event) {
        let item = {...this.state};
        item.anchorEl = event.currentTarget;
        this.setState(item);
    }

    handleAccountClose(event) {
        let item = {...this.state};
        item.anchorEl = null;
        //console.log("event name: "+event.currentTarget.id);
        let action = event.currentTarget.id;
        if(action==="accountExit") {
            item.connected = false;
            item.action = "";
            commonData.logout();
        }
        this.setState(item);
    }

    async handleMenuClick(event) {
        event.preventDefault();
        let idSubject = event.currentTarget.id;
        let item = {...this.state};
        if(idSubject==="login" || idSubject==="contact") {
            item.action = idSubject;
            item.tests = undefined;
        } else {
            item.tests = (await commonData.getDataFromApi("testsWithSubjectId", idSubject, "testsList")).data;
            item.anchorEl = event.currentTarget;
            console.log("tests are");
            console.log(item.tests);
        }
        this.setState(item);
    }

    componentDidMount() {
        commonData.getDataFromApi(Subjects.apiName, undefined, Subjects.apiPath)
            .then(response => {
                console.log(response);
                if(response.success) {
                    this.setState({ subjects: response.data });
                } else {
                    if(response.status===401) {
                        console.log("login");
                        this.setState({ connected: false, action: "login" });
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching subjects:', error);
            });
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        let testId = event.target.test_id.value;
        console.log("Start handleSubmit for test id "+testId);
        if(testId!==undefined && testId!=null && testId!=="") {
            let item = {...this.state};
            item.testId = testId;
            item.questions = (await commonData.getDataFromApi(Questions.apiName, testId, Questions.apiPath)).data;
            console.log(item.questions[0].orderq);
            if(item.questions[0].orderq===null) {
                console.log("Shuffling");
                this.shuffleArray(item.questions);
            } else {
                console.log("Not shuffling");
            }

            console.log("questions size is "+item.questions.length);
            this.setState(item);
        }
    }

    render() {
        /*console.log("action "+this.state.action);
        this.state.tests && console.log("tests are defined");
        console.log(this.state.tests);*/

        const formStyle = { marginBottom: "5px" }; // Adjust the margin as needed
        const buttonStyle = {
            width: '200px',
            height: '70px',
            backgroundColor: '#f4ede5',
            color: '#000000',
            borderRadius: "10px",
            border: "2px solid #0A0610", // Border styling
        };
        if(this.state.testId===undefined) {
            return (
                <>
                    <Helmet>
                        <title>Iq test</title>
                        <meta name="description" content="IQ test"/>
                        <meta name="google-site-verification" content="ovqCMnQY9qDGgKVOXY4IsnN_WE9L3QYV7Okn-7H1Bv0"/>
                    </Helmet>
                    <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="center"
                         minHeight="100vh"
                         sx={{
                             backgroundColor: "lightyellow",
                             backgroundImage: `url(${bg})`,
                             backgroundSize: "cover",
                             color: "#ffffff"
                         }}>
                        <Box id="box1" display="flex" flexDirection="column" justifyContent="flex-start"
                             alignItems="center">
                            <AppBar position="static" sx={{
                                borderRadius: "10px", // Adjust the value for round corners
                                borderTopLeftRadius: "0px", // Set this to 0 to keep the top left corner straight
                                borderTopRightRadius: "0px", // Set this to 0 to keep the top right corner straight
                                borderBottomLeftRadius: "10px", // Adjust the value for rounded bottom left corner
                                borderBottomRightRadius: "10px", // Adjust the value for rounded bottom right corner
                                border: "2px solid #0A0610", // Border styling
                                backgroundColor: "#f4ede5",
                                }}>
                                <Container maxWidth="xl">
                                    <Toolbar disableGutters>
                                        <Box sx={{ flexGrow: 1 }}>
                                            {
                                                !this.state.connected
                                                    && <Button id="login" key="login" onClick={this.handleMenuClick} sx={{ mx: 2, color: "black" }}>Conectare</Button>
                                            }
                                            {this.state.subjects.map((s, i) => (
                                                <Button id={s.id} key={s.id} onClick={this.handleMenuClick} sx={{ mx: 2, color: "black" }}>{s.name}</Button>
                                            ))}
                                            <Button id="contact" key="contact" onClick={this.handleMenuClick} sx={{ mx: 2, color: "black" }}>Contact</Button>
                                            {
                                                this.state.connected
                                                    &&
                                                    <>
                                                        <IconButton size="small"
                                                                    id="basic-button"
                                                                    aria-controls={Boolean(this.state.anchorEl) ? 'basic-menu' : undefined}
                                                                    aria-haspopup="true"
                                                                    aria-expanded={Boolean(this.state.anchorEl) ? 'true' : undefined}
                                                                    onClick={this.handleAccountButtonClick}>
                                                            <AccountCircle />
                                                        </IconButton>

                                                        <Menu
                                                            id="demo-positioned-menu"
                                                            aria-labelledby="demo-positioned-button"
                                                            anchorEl={this.state.anchorEl}
                                                            open={Boolean(this.state.anchorEl)}
                                                            onClose={this.handleAccountClose}
                                                        >
                                                            <MenuItem id="accountTests" onClick={this.handleAccountClose}>Testele mele</MenuItem>
                                                            <MenuItem id="accountSettings" onClick={this.handleAccountClose}>Setări cont</MenuItem>
                                                            <MenuItem id="accountExit" onClick={this.handleAccountClose}>Ieșire</MenuItem>
                                                        </Menu>
                                                    </>
                                            }
                                        </Box>
                                    </Toolbar>
                                </Container>
                            </AppBar>
                        </Box>

                        <Box id="box2" display="flex" flexDirection="column" justifyContent="flex-start"
                             alignItems="center" marginTop={10}>
                            {
                                (this.state.tests && this.state.tests.length>0)
                                    ?this.state.tests.map((t, i) => {
                                            return (<div key={"testID" + t.id} style={formStyle}>
                                                <Form onSubmit={this.handleSubmit} style={formStyle}>
                                                    <Input type="hidden" name="test_id" id="test_id" value={t.id}/>
                                                    <Button variant="outlined" type="submit" className="glowing-text-button"
                                                            style={buttonStyle}>{t.description}</Button>
                                                </Form>
                                            </div>);
                                        })
                                    :this.state.action==="login"
                                        ?<Login updateConnectedState={this.updateConnectedState}/>
                                        :this.state.action==="contact"
                                            ?<Contact/>
                                            :""
                            }
                        </Box>
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
