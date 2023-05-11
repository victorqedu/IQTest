import React, { Component } from 'react';
import {Checkbox, TableHead, TableRow, TableSortLabel} from "@mui/material";
import commonData from "../genericClasses/commonData";

class EnhancedTableHead extends Component {
    constructor(props) {
        super(props);
        this.handleRequestSort = this.handleRequestSort.bind(this);
    }

    async componentDidMount() {
    }

    handleRequestSort(event) {
        const target = event.currentTarget;
        let newOrderBy = target.getAttribute("id");
        const isAsc = this.props.orderBy === newOrderBy && this.props.order === "asc";
        let newOrder = isAsc ? "desc" : "asc";
        this.props.setOrderData(newOrderBy, newOrder);
    }

    render() {
        console.log("[ETH]render "+this.props.headCells );
        return (
            <TableHead>
                <TableRow>
                    <commonData.StyledSmallTableCell padding="checkbox" sx={{"display":"none"}}>
                        <Checkbox
                            color="primary"
                            inputProps={{
                                'aria-label': 'select all',
                            }}
                        />
                    </commonData.StyledSmallTableCell>
                    <commonData.StyledSmallTableCell align="right">
                        <b>Nr.crt</b>
                    </commonData.StyledSmallTableCell>
                    {
                        Array.isArray(this.props.headCells)?
                            this.props.headCells.map((headCell) => (
                                headCell.size==='regular'?
                                <commonData.StyledTableCell
                                    key={headCell.id}
                                    align={headCell.numeric ? 'right' : 'left'}
                                    padding={headCell.disablePadding ? 'none' : 'normal'}
                                    sortDirection={this.props.orderBy === headCell.id ? this.props.order : false}
                                    sx={{"display": headCell.columnVisible===false?'none':''}}
                                >
                                    <TableSortLabel
                                        id={headCell.id}
                                        active={this.props.orderBy === headCell.id}
                                        direction={this.props.orderBy === headCell.id ? this.props.order : 'asc'}
                                        onClick={this.handleRequestSort}
                                        sx={{"color":"white","&:hover":{color: "white"},"active":{color: "white"}}}
                                    >
                                        <b>{headCell.label}</b>
                                    </TableSortLabel>
                                </commonData.StyledTableCell>:
                                    <commonData.StyledSmallTableCell
                                        key={headCell.id}
                                        align={headCell.numeric ? 'right' : 'left'}
                                        padding={headCell.disablePadding ? 'none' : 'normal'}
                                        sortDirection={this.props.orderBy === headCell.id ? this.props.order : false}
                                        sx={{"display": headCell.columnVisible===false?'none':''}}
                                    >
                                        <TableSortLabel
                                            id={headCell.id}
                                            active={this.props.orderBy === headCell.id}
                                            direction={this.props.orderBy === headCell.id ? this.props.order : 'asc'}
                                            onClick={this.handleRequestSort}
                                            sx={{"color":"white","&:hover":{color: "white"},"&:active":{color: "white"}}}
                                            //sx={{"color":"white",":hover":{color: "white"},":active":{color: "white"},":visited":{color: "white"},":direction":{color: "white"}}}
                                        >
                                            <b>{headCell.label}</b>
                                        </TableSortLabel>
                                    </commonData.StyledSmallTableCell>
                            )):null
                    }
                </TableRow>
            </TableHead>
        );
    }

}
export default EnhancedTableHead;