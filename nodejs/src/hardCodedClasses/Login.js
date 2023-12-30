import React, {useEffect, useState} from 'react';
import axios from "axios";
import commonData from "../genericClasses/commonData";
import './Login.css';

const Login = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // Code inside this block will run when the component mounts
        // You can perform your checks or actions here
        console.log("Start useEffect");
        if(commonData.isEmpty(localStorage.getItem('connectedUserData'))) {
            console.log("useEffect - I'm offline");
            setConnected(false);
        } else {
            console.log("useEffect - I'm online");
            setConnected(true);
            setMessage("Conectare cu succes");
        }
        return () => {
            // Code inside this cleanup function will run when the component unmounts
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            if(commonData.isEmpty(username)) {
                setMessage("Completați utilizatorul");
            } else if(commonData.isEmpty(password)) {
                setMessage("Completați parola");
            } else {
                console.log("Starting authentication");
                const basicAuth = 'Basic ' + btoa(username + ':' + password);
                localStorage.setItem('jwtToken', basicAuth);
                const response = await axios.get(commonData.getApiLink()+'login', commonData.getConfig());
                console.log(response);
                console.log("auth JWT "+response.headers.authorization);
                localStorage.setItem('jwtToken', response.headers.authorization);
                localStorage.setItem('connectedUserData', JSON.stringify(response.data));
                setMessage("Conectare cu succes");
                setConnected(true);
                props.updateConnectedState(true);
            }
        } catch (error) {
            commonData.logout();
            setConnected(false);
            props.updateConnectedState(false);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("Response data:", error.response.data);
                const errorMessage = error.response.data.message;
                let message = "Utilizator sau parola gresite ";
                if(!commonData.isEmpty(errorMessage)) {
                    message+=" "+errorMessage;
                }
                setMessage(message);
            } else if (error.request) {
                // The request was made but no response was received
                console.log("No response received:", error.request);
                setMessage("Nu s-a primit nici un răspuns "+error);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error during request setup:", error.message);
                setMessage("Eroare la comunicare "+error);
            }
        }
    };

    return (
        <div className="login-container">
            {
                connected ? <h2 className="h2-login">{message}</h2> :
                    <form className="login-form">
                        <h2 className="h2-login">Login</h2>
                        <label htmlFor="username" className="label-login">Username</label>
                        <input
                            className="input-login"
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <label htmlFor="password" className="label-login">Password</label>
                        <input
                            className="input-login"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button type="button" onClick={handleLogin} className="button-login">
                            Conectare
                        </button>
                        <label htmlFor="messageLogin" className="label-login">{message}</label>
                    </form>
            }
        </div>
    );
};
export default Login;
