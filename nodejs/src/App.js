import {BrowserRouter, Route, Routes} from 'react-router-dom';
import React, {Component} from 'react';
import './App.css';
import Home from "./Home";
import NotFound from "./genericClasses/NotFound";
import GenericTable from "./genericClasses/GenericTable";
import Countries from "./entities/Countries";
import Tests from "./entities/Tests";
import Questions from "./entities/Questions";
import QuestionsOptions from "./entities/QuestionsOptions";
import {Helmet} from "react-helmet";
import Subjects from "./entities/Subjects";

class App extends Component {
  render() {
      return (
          <BrowserRouter>
              <Helmet>
                  <title>Iq test</title>
                  <meta name="description" content="IQ test"/>
                  <meta name="google-site-verification" content="ovqCMnQY9qDGgKVOXY4IsnN_WE9L3QYV7Okn-7H1Bv0" />
              </Helmet>
              <Routes>
                <Route path='/'                             exact={true} element={ <Home/> }/>
                <Route path='/Countries'                    exact={true} element={ <GenericTable config={Countries}/> }/>
                <Route path='/Tests'                        exact={true} element={ <GenericTable config={Tests}/> }/>
                <Route path='/Subjects'                     exact={true} element={ <GenericTable config={Subjects}/> }/>
{/*
                <Route path='/TestsSessions'                exact={true} element={ <GenericTable config={TestsSessions}/> }/>
*/}
                <Route path='/Questions'                    exact={true} element={ <GenericTable config={Questions}/> }/>
                <Route path='/QuestionsOptions'             exact={true} element={ <GenericTable config={QuestionsOptions}/> }/>
                <Route path="/NotFound"                     exact={true} element={ <NotFound/> }/>
                <Route path="*"                             exact={true} element={ <NotFound/> }/>
            </Routes>
          </BrowserRouter>
      );
  }
}
export default App;
