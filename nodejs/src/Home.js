import React, {Component} from "react";
import {
    AppBar,
    Box,
    Button,
    Container, Divider, Icon, IconButton,
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
import GenericTable from "./genericClasses/GenericTable";
import TestsSessionsForConnectedUsers from "./entities/TestsSessionsForConnectedUsers";
import TestsSessions from "./entities/TestsSessions";
import Tests from "./entities/Tests";
import Images from "./entities/Images";
import Users from "./entities/Users";
import Countries from "./entities/Countries";
import GenericEdit from "./genericClasses/GenericEdit";
import TestsImports from "./entities/TestsImports";
import NewAccount from "./hardCodedClasses/NewAccount";
import Groups from "./entities/Groups";
import {ReactComponent as TestDone} from './images/testDone.svg';

class Home extends Component {
    constructor(props) {
        super(props);
        this.handleTestSubmit = this.handleTestSubmit.bind(this);
        this.shuffleArray = this.shuffleArray.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleAccountButtonClick = this.handleAccountButtonClick.bind(this);
        this.handleAccountClose = this.handleAccountClose.bind(this);
        this.updateConnectedState = this.updateConnectedState.bind(this);
        this.handleGroupSubmit = this.handleGroupSubmit.bind(this);

        this.state = {
            selectedSubjectId: undefined, // the selected subject ID
            selectedGroupIndex: undefined,
            selectedTestIndex: undefined,
            action: undefined,
            questions: {},
            subjects: [], // all subjects from the database to be exposed in the main menu
            tests: [], // list with all the tests available for the selected subject from the main menu
            groups: [], // list with all the groups available for the selected subject from the main menu
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
        } else {
            item.action = action;
        }
        this.setState(item);
    }

    async handleMenuClick(event) {
        event.preventDefault();
        let idSubject = event.currentTarget.id;
        let item = {...this.state};
        item.selectedGroupIndex = undefined;
        if(idSubject==="login" || idSubject==="contact" || idSubject === "newAccount") {
            item.action = idSubject;
            item.tests = undefined;
        } else {
            item.action = "testsList";
            //item.tests = (await commonData.getDataFromApi("testsWithSubjectId", idSubject, "testsList")).data;
            item.selectedSubjectId = idSubject;
            item.groups = (await commonData.getDataFromApi("findGroupsWithSubjectId", idSubject, "groupsList")).data;
            item.tests = (await commonData.getDataFromApi("testsWithSubjectIdWithoutGroup", idSubject, "testsList")).data;
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

    async handleTestSubmit(event) {
        event.preventDefault();
        let selectedTestIndex = event.target.selectedTestIndex.value;
        console.log("Start handleTestSubmit for test id "+selectedTestIndex);
        if(selectedTestIndex!==undefined && selectedTestIndex!=null && selectedTestIndex!=="") {
            let item = {...this.state};
            item.selectedTestIndex = selectedTestIndex;
            item.questions = (await commonData.getDataFromApi(Questions.apiName, this.state.tests[selectedTestIndex].id, Questions.apiPath)).data;
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

    async handleGroupSubmit(event) {
        event.preventDefault();
        let selectedGroupIndex = event.target.selectedGroupIndex.value;
        console.log("Start handleGroupSubmit for group id "+selectedGroupIndex);
        if(!commonData.isEmpty(selectedGroupIndex)) {
            let item = {...this.state};
            item.selectedGroupIndex = selectedGroupIndex;
            item.tests = (await commonData.getDataFromApi("testsWithSubjectIdAndGroupId", [item.selectedSubjectId, item.groups[selectedGroupIndex].id], Tests.apiPath)).data;
            console.log("tests size is "+item.tests.length);
            this.setState(item);
        }
    }

    render() {
        console.log("action "+this.state.action);
        /*this.state.tests && console.log("tests are defined");
        console.log(this.state.tests);*/

        const formStyle = { marginBottom: "5px" }; // Adjust the margin as needed
        const testButtonStyle = {
            width: '200px',
            height: '70px',
            backgroundColor: '#f4ede5',
            color: '#000000',
            borderRadius: "10px",
            padding: '30px',
            border: "2px solid #0A0610", // Border styling
        };
        const groupButtonStyle = {
            width: '200px',
            height: '70px',
            backgroundColor: '#eedfcc',
            color: '#000000',
            borderRadius: "10px",
            border: "2px solid #0A0610", // Border styling
        };
        if(this.state.selectedTestIndex===undefined) {
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
                                                !this.state.connected && <Button id="login" key="login" onClick={this.handleMenuClick} sx={{mx: 2, color: "black"}}>Conectare</Button>
                                            }
                                            {
                                                !this.state.connected && <Button id="newAccount" key="newAccount" onClick={this.handleMenuClick} sx={{ mx: 2, color: "black" }}>Cont nou</Button>
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
                                                            {commonData.connectedUserName()}
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
                                                            {
                                                                commonData.connectedUserRole()==="ADMIN" &&
                                                                [
                                                                    <Divider key="dividerMenu"></Divider>,
                                                                    <MenuItem key="manageTestsSessions" id="manageTestsSessions" onClick={this.handleAccountClose}>Log sesiuni de testele</MenuItem>,
                                                                    <MenuItem key="manageTests" id="manageTests" onClick={this.handleAccountClose}>Administrare teste</MenuItem>,
                                                                    <MenuItem key="manageImages" id="manageImages" onClick={this.handleAccountClose}>Administrare imagini</MenuItem>,
                                                                    <MenuItem key="manageUsers" id="manageUsers" onClick={this.handleAccountClose}>Administrare utilizatori</MenuItem>,
                                                                    <MenuItem key="manageSubjects" id="manageSubjects" onClick={this.handleAccountClose}>Administrare subiecte</MenuItem>,
                                                                    <MenuItem key="manageGroups" id="manageGroups" onClick={this.handleAccountClose}>Administrare grupuri</MenuItem>,
                                                                    <MenuItem key="manageCountries" id="manageCountries" onClick={this.handleAccountClose}>Administrare țări</MenuItem>,
                                                                    <MenuItem key="manageTestImports" id="manageTestImports" onClick={this.handleAccountClose}>Import automat teste</MenuItem>,
                                                                ]
                                                            }
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
                                this.state.action==="login"
                                    ?<Login updateConnectedState={this.updateConnectedState}/>
                                    :this.state.action==="newAccount"
                                        ?<NewAccount/>
                                        :this.state.action==="contact"
                                            ?<Contact/>
                                            :this.state.action==="accountTests"
                                                ?<GenericTable key="accountTests" config={TestsSessionsForConnectedUsers} customApiName="getUserTestsSessions"/>
                                                :this.state.action==="manageTestsSessions"
                                                    ?<GenericTable key="manageTestsSessions" config={TestsSessions}/>
                                                    :this.state.action==="manageTests"
                                                        ?<GenericTable key="manageTests" config={Tests}/>
                                                        :this.state.action==="manageImages"
                                                            ?<GenericTable key="manageImages" config={Images}/>
                                                            :this.state.action==="manageUsers"
                                                                ?<GenericTable key="manageUsers" config={Users}/>
                                                                :this.state.action==="manageSubjects"
                                                                    ?<GenericTable key="manageSubjects" config={Subjects}/>
                                                                    :this.state.action==="manageCountries"
                                                                        ?<GenericTable key="manageCountries" config={Countries}/>
                                                                        :this.state.action==="manageTestImports"
                                                                            ?<GenericEdit key="manageTestImports" columns={TestsImports.Columns} apiEditName={TestsImports.apiEditName}/>
                                                                            :this.state.action==="manageGroups"
                                                                                ?<GenericTable key="manageGroups"  config={Groups}/>
                                                                                :this.state.selectedSubjectId !== undefined &&
                                                                                        <>
                                                                                            {this.state.tests && this.state.tests.length > 0 &&
                                                                                                this.state.tests.map((t, i) => (
                                                                                                    <div key={"testID" + t.id} style={formStyle}>
                                                                                                        <Form onSubmit={this.handleTestSubmit} style={formStyle}>
                                                                                                            <Input type="hidden" name="selectedTestIndex" id="selectedTestIndex" value={i} />
                                                                                                            <Button variant="outlined" type="submit" className="test-button" style={testButtonStyle}>
                                                                                                                {
                                                                                                                    !commonData.isEmpty(t.finalizedPercent) &&
                                                                                                                    (t.finalizedPercent===100
                                                                                                                        ? <Icon style={{ position: 'absolute', top: 0, right: 0 }}>
                                                                                                                            <TestDone></TestDone>
                                                                                                                        </Icon>
                                                                                                                        : <label style={{ position: 'absolute', top: 0, right: 0, margin: '3px',fontSize: '12px', }}>{t.finalizedPercent}%</label>
                                                                                                                    )

                                                                                                                }
                                                                                                                {t.description}
                                                                                                            </Button>
                                                                                                        </Form>
                                                                                                    </div>
                                                                                                ))}
                                                                                            {(this.state.groups && this.state.groups.length > 0 && commonData.isEmpty(this.state.selectedGroupIndex)) &&
                                                                                                this.state.groups.map((t, i) => (
                                                                                                    <div key={"groupID" + t.id} style={formStyle}>
                                                                                                        <Form onSubmit={this.handleGroupSubmit} style={formStyle}>
                                                                                                            <Input type="hidden" name="selectedGroupIndex" id="selectedGroupIndex" value={i} />
                                                                                                            <Button variant="outlined" type="submit" className="test-button" style={groupButtonStyle}>
                                                                                                                {t.name}
                                                                                                            </Button>
                                                                                                        </Form>
                                                                                                    </div>
                                                                                                ))}
                                                                                        </>


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
                    <ShowTestsQuestions questions={this.state.questions} test={this.state.tests[this.state.selectedTestIndex]}/>
                </>
            );
        }
    }
}

export default Home;
