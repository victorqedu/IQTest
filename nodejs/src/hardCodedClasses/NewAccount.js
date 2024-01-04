import React, {useEffect, useState} from 'react';
import axios from "axios";
import commonData from "../genericClasses/commonData";
import './Login.css';
import Users from "../entities/Users";
import Countries from "../entities/Countries";
import Languages from "../entities/Languages";

const NewAccount = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [accountCreated, setAccountCreated] = useState(false);

    useEffect(() => {
        // Code inside this block will run when the component mounts
        // You can perform your checks or actions here
        console.log("Start useEffect");
        return () => {
            // Code inside this cleanup function will run when the component unmounts
        };
    }, []);

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        if(commonData.isEmpty(username)) {
            setMessage("Completați emailul");
        } else if(commonData.isEmpty(name)) {
            setMessage("Completați numele");
        } else if(commonData.isEmpty(password)) {
            setMessage("Completați parola");
        } else if(password!==passwordCheck) {
            setMessage("Câmpul confirmare parola nu se potrivește cu câmpul parola");
        } else {
            console.log("Starting save account");
            let country = new Countries();
            country.id = 1;
            let language = new Languages();
            language.id = 1;
            let user = new Users();
            user.username = username;
            user.name = name;
            user.password = password;
            user.idCountries = country;
            user.idLanguages = language;
            user.role = "USER";

            await axios.post(commonData.getApiLink()+"users",
                JSON.stringify(user), commonData.getConfig())
                .then(
                    res => {
                        setMessage("Cont creat cu succes");
                        setAccountCreated(true);
                    }
                )
                .catch(error => {
                    console.log("POST Error");
                    setMessage(commonData.parseError(error));
                });
        }
    };

    return (
        <div className="newAccount-container">
            {
                accountCreated ? <h2 className="h2-login">Cont creat cu succes</h2> :
                    <form className="login-form">
                        <h2 className="h2-login">Creare cont</h2>
                        <label htmlFor="email" className="label-login">Email</label>
                        <input
                            className="input-login"
                            type="text"
                            id="email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <label htmlFor="name" className="label-login">Nume</label>
                        <input
                            className="input-login"
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <label htmlFor="password" className="label-login">Parola</label>
                        <input
                            className="input-login"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="passwordCheck" className="label-login">Verificare parola</label>
                        <input
                            className="input-login"
                            type="password"
                            id="passwordCheck"
                            value={passwordCheck}
                            onChange={(e) => setPasswordCheck(e.target.value)}
                        />

                        <button type="button" onClick={handleCreateAccount} className="button-login">
                            Creare cont
                        </button>
                        <label htmlFor="messageLogin" className="label-login">{message}</label>
                    </form>
            }
        </div>
    );
};
export default NewAccount;
