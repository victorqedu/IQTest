import React, { Component } from 'react';
import {Button} from "@mui/material";

class Timer extends Component {
    constructor(props) {
        super(props);
        console.log("Timer constructor");
        this.state = {
            time: this.props.initialTime,
        };
        this.timerInterval = null;
    }

    componentDidMount() {
        this.startTimer();
    }

    componentWillUnmount() {
        this.clearTimer();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.setState((prevState) => ({
                time: prevState.time - 1,
            }), () => {
                if (this.state.time <= 0) {
                    this.clearTimer();
                    this.props.onTimerEnd();
                }
            });
        }, 1000);
    }

    clearTimer() {
        clearInterval(this.timerInterval);
    }

    resetTimer() {
        this.clearTimer();
        this.setState({ time: this.props.initialTime }, () => {
            this.startTimer();
        });
    }

    render() {
        return <Button sx={{color: '#000000',}}><font size={3}>{this.state.time} seconds </font></Button>;
    }
}

export default Timer;
