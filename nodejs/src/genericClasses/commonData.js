import { Component } from 'react';
import {createTheme, styled, TableCell, tableCellClasses} from "@mui/material";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
/*import { ThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';*/

class commonData extends Component {
    static username = 'victor';
    static password = 'test';
    static basicAuth = 'Basic ' + btoa(this.username + ':' + this.password);
    static API_PROTOCOL = "https";
    static API_HOST = "www.iqtest.caido.ro";
    static API_PORT = "8443";
    static API_PATH = "api/"

    static getApiLink() {
        return this.API_PROTOCOL+"://"+this.API_HOST+":"+this.API_PORT+"/"+this.API_PATH;
    }

    static connected() {
        const connectedUserData = localStorage.getItem('connectedUserData');
        console.log("connected "+localStorage.getItem('connectedUserData')+" connectedUserData "+connectedUserData);
        return !commonData.isEmpty(connectedUserData);
    }

    static connectedUserName() {
        if(!commonData.isEmpty(localStorage.getItem('connectedUserData'))) {
            let userData = JSON.parse(localStorage.getItem('connectedUserData'));
            return userData.name;
        }
    }

    static connectedUserId() {
        if(!commonData.isEmpty(localStorage.getItem('connectedUserData'))) {
            let userData = JSON.parse(localStorage.getItem('connectedUserData'));
            return userData.id;
        }
    }

    static connectedUser() {
        if(!commonData.isEmpty(localStorage.getItem('connectedUserData'))) {
            let userData = JSON.parse(localStorage.getItem('connectedUserData'));
            return userData;
        }
    }

    static logout() {
        localStorage.removeItem('connectedUserData');
        localStorage.removeItem('jwtToken');
    }

    static getConfig() {
        let config =  {
            timeout: 60000,
            //withCredentials: true,
            //withCredentials: false,
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json",
                "observe": 'response',
                //"Authorization": "",
//            credentials: 'same-origin',
            },
            //mode: 'no-cors',
            /*        auth: {
                        username: "victor",
                        password: "test",
                    },*/
            //params: this.username
        }
        //console.log("jwtToken "+jwtToken);
        const jwtToken = localStorage.getItem('jwtToken');
        if(!commonData.checkJWTokenExpired()) {
            config.headers["Authorization"] = jwtToken;
        }
        return config;
    }
    static isEmpty(value) {
        if(value===undefined || value===null || value==="") {
            return true;
        } else {
            return false;
        }
    }
    static descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    static getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => this.descendingComparator(a, b, orderBy)
            : (a, b) => -this.descendingComparator(a, b, orderBy);
    }

    static sort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) {
                return order;
            }
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

  /*  static StyledTable = styled(Table)(({ theme }) => ({
        "& .MuiTableCell-root": {
            border: '0px solid black',
            "borderBottom": '1px solid #aaaaaa',
            "tableLayout": 'fixed',
        },
        "& .Mui-selected": {
            backgroundColor: "#FF0000",
        },
        "& .MuiTableRow-hover": {
            backgroundColor: "#FF0000",
        },
        /!*"&$tableRowSelected, &$tableRowSelected:hover": {
            backgroundColor: "#FF0000"
        },*!/
    }));*/

    /*static StyledTableRow = styled(TableRow)(({ theme }) => ({
/!*
        '&:nth-of-type(odd)': {
            /!*backgroundColor: theme.palette.action.hover,*!/
            /!*backgroundColor: "#FF0000",*!/
        },
*!/
        "& .MuiTableRow-root": {
            backgroundColor: "#FF0000",
        },
        "& .Mui-selected": {
            backgroundColor: "#FF0000",
        },
        "& .MuiTableRow-hover": {
            backgroundColor: "#FF0000",
        },
    }));
*/
    static StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            //backgroundColor: theme.palette.common.black,
            //backgroundColor: "#6d6b6a",
            backgroundColor: "#736FF7",
            //backgroundColor: "#F76F73",
            color: theme.palette.common.white,
            //"&:hover":{color: "white"},
            //"&:active":{color: "white"},
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },

    }));

    static StyledSmallTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: "#736FF7",
            color: theme.palette.common.white,
            fontSize: 14,
            width: '50px',
            maxWidth: '50px',
            overflow: "hidden",
            textOverflow: "ellipsis",
            borderStyle: "border-box",
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
            width: '50px',
            maxWidth: '50px',
            overflow: "hidden",
            textOverflow: "ellipsis",
            borderStyle: "border-box",
        },
    }));

    static theme = createTheme({
        components: {
            // Name of the component
            TableRow: {
                defaultProps: {
                    backgroundColor: "#FF0000",
                },
                styleOverrides: {
                    root: {
                        fontSize: '1rem',
                    },
                },
            },
        },
        tableRowRoot: {
            "&$tableRowSelected, &$tableRowSelected:hover": {
                backgroundColor: "#FF0000"
            }
        },
        tableRowSelected: {
            backgroundColor: "#FF0000"
        },
    });
    static parseError(error) {
        let message = "";
        if(typeof error.response !== 'undefined') {
            message = "Error processing data "+JSON.stringify(error.response.data);
        } else {
            message = "Error processing data "+JSON.stringify(error);
        }
        return message;
    }

    static checkJWTokenExpired() {
        let jwtToken = localStorage.getItem('jwtToken');
        if(commonData.isEmpty(jwtToken)) {
            return true;
        } else if(jwtToken.startsWith("Basic")) { // this is no JWT toke, is the initial basic auth
            return false;
        } else {
            const decodedToken = jwtDecode(jwtToken);
            // Check if the token is expired
            if (decodedToken.exp < Date.now() / 1000) {
                return true;
            } else {
                return false;
            }
        }
    }

    static async getDataFromApi(apiName, filterParameter, apiPath) {
        console.log("Start getDataFromApi "+apiPath);
        let url = this.getApiLink()+apiName;
        if(filterParameter!==undefined) {
            url+="/"+filterParameter;
        }
        return await axios.get(url, commonData.getConfig())
            .then(res => {
                let data;
                if(res.data["_embedded"]!==undefined) {
                    console.log("_embedded is defined");
                    data = res.data["_embedded"][apiPath];
                } else {
                    console.log("_embedded is undefined");
                    data = res.data[apiPath];
                }
                console.log("data is "+data);
                return {data: data, status:200, success: true};
                //console.log(res);
            })
            .catch(error => {
                console.log("Error is "+error);
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log("Response data:", error.response);
                    console.log("response.status "+error.response.status);
                    if(error.response.status===401) {
                        commonData.logout();
                    }
                    return {data: null, status:error.response.status, success: false, error: error.response.data};
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log("No response received:", error.request);
                    return {data: null, status:null, success: false, error: error.request};
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error during request setup:", error.message);
                    return {data: null, status:null, success: false, error: error.message};
                }

            });
    }

}

export default commonData;
