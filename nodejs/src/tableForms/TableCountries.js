import React, {Component} from 'react';
import axios from "axios";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

class TableCountries extends Component {
    emptyTableCountries = {
        countries: []
    };
    config = {
        headers:{
            "Accept": "*/*",
            "Content-Type":"application/json",
        },
        auth: {
            username: 'victor',
            password: 'test'
        }
    };
    constructor(props) {
        super(props);
        this.state = this.emptyTableCountries;
    }

    componentDidMount() {
        let item = {...this.state};
        axios.post('http://caido.ro:8080/api/countries', this.config)
            .then(res => {
                console.log(res.data);
                item.countries = res.data;
                this.setState(item);
            })
            .catch(error => {
                console.log("Eroarea este"+error);
                item.countries = "";
                this.setState(item);
                let extraMessage = "";
                try {
                    extraMessage = error.response.data;
                } catch (e) {
                    console.log(e);
                }
            });
    }

    componentDidUpdate(prevProps) {
    }

    render() {
        let item = {...this.state};
        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nr. crt</TableCell>
                            <TableCell align="right">Id</TableCell>
                            <TableCell align="right">Code</TableCell>
                            <TableCell align="right">Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {item.countries.map((row) => (
                            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row"></TableCell>
                                <TableCell component="th" scope="row">{row.id}</TableCell>
                                <TableCell align="right">{row.code}</TableCell>
                                <TableCell align="right">{row.name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

export default TableCountries;