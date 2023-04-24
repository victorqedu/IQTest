import {BrowserRouter, Route, Routes} from 'react-router-dom';
import React, {Component} from 'react';
import './App.css';
import Home from "./Home";
import TableCountries from "./tableForms/TableCountries";
import NotFound from "./genericClasses/NotFound";

class App extends Component {
  render() {
      return (
          <BrowserRouter>
            <Routes>
              <Route path='/'                 exact={true} element={ <Home/> }/>
              <Route path='/TableCountries'   exact={true} element={ <TableCountries/> }/>
              <Route path="/Home"             exact={true} element={ <Home/> }/>
              <Route path="/NotFound"         exact={true} element={ <NotFound/> }/>
              <Route path="*"                 exact={true} element={ <NotFound/> }/>
            </Routes>
          </BrowserRouter>
      );
  }
}
export default App;
