import { Component } from 'react';
import {styled, Table, TableCell, tableCellClasses, TableRow} from "@mui/material";

class commonData extends Component {
    static username = 'victor';
    static password = 'test';
    static basicAuth = 'Basic ' + btoa(this.username + ':' + this.password);

    static config = {
        withCredentials: true,
        //withCredentials: false,
        headers: {
            "Accept": "*/*",
            "Content-Type": "application/json",
            //"Authorization": +this.basicAuth,
            //credentials: 'same-origin',
        },
        //mode: 'no-cors',
        /*auth: {
            username: "victor",
            password: "test",
        },*/
        //params: this.username

    };

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

    static StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            /*backgroundColor: theme.palette.action.hover,*/
        },

    }));

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
            //backgroundColor: "#6d6b6a",
            backgroundColor: "#736FF7",
            //backgroundColor: "#F76F73",
            color: theme.palette.common.white,
            fontSize: 14,
            width: '45px',
            maxWidth: '45px',
            overflow: "hidden",
            textOverflow: "ellipsis",
            borderStyle: "border-box",
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
            width: '45px',
            maxWidth: '45px',
            overflow: "hidden",
            textOverflow: "ellipsis",
            borderStyle: "border-box",
        },
    }));

    static StyledTable = styled(Table)(({ theme }) => ({
        "& .MuiTableCell-root": {
            border: '0px solid black',
            "borderBottom": '1px solid #aaaaaa',
            "tableLayout": 'fixed',
        }
    }));

/*    static StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
        "& .MuiTableSortLabel-root": {"color": "white","&:hover":{color: "white"},"&:active":{color: "white"},"hover":{color: "white"},"active":{color: "white"},":hover":{color: "white"},":active":{color: "white"},},
        "& .Mui-active": {"color": "white","&:hover":{color: "white"},"&:active":{color: "white"},"hover":{color: "white"},"active":{color: "white"},":hover":{color: "white"},":active":{color: "white"},},
        "& .MuiTableSortLabel-icon": {"color": "white","&:hover":{color: "white"},"&:active":{color: "white"},"hover":{color: "white"},"active":{color: "white"},":hover":{color: "white"},":active":{color: "white"},},
        "& 	.MuiTableSortLabel-iconDirectionDesc": {"color": "white","&:hover":{color: "white"},"&:active":{color: "white"},"hover":{color: "white"},"active":{color: "white"},":hover":{color: "white"},":active":{color: "white"},},
        "& .MuiTableSortLabel-iconDirectionAsc": {"color": "white","&:hover":{color: "white"},"&:active":{color: "white"},"hover":{color: "white"},"active":{color: "white"},":hover":{color: "white"},":active":{color: "white"},},
        "& root": {"color": "white","&:hover":{color: "white"},"&:active":{color: "white"},"hover":{color: "white"},"active":{color: "white"},":hover":{color: "white"},":active":{color: "white"},},
        "& active": {"color": "white","&:hover":{color: "white"},"&:active":{color: "white"},"hover":{color: "white"},"active":{color: "white"},":hover":{color: "white"},":active":{color: "white"},},
        "& icon": {"color": "white","&:hover":{color: "white"},"&:active":{color: "white"},"hover":{color: "white"},"active":{color: "white"},":hover":{color: "white"},":active":{color: "white"},},

    }));
    static theme = createTheme({
        components: {
            // Name of the component
            TableSortLabel: {
                styleOverrides: {
                    root: {
                        "color": "white",
                        "&:hover":{color: "white"},
                        "&:active":{color: "white"},
                        "hover":{color: "white"},
                        "active":{color: "white"},
                        ":hover":{color: "white"},
                        ":active":{color: "white"},
                    },
                },
            },
        },
    });*/

    static parseError(error) {
        let message = "";
        if(typeof error.response !== 'undefined') {
            message = "Error processing data "+JSON.stringify(error.response.data);
        } else {
            message = "Error processing data "+JSON.stringify(error);
        }
        return message;
    }
}

export default commonData;
