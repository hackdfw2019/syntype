import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Link} from 'react-router-dom';
import "./index.css";
import App from "./App";
import Demo from "./Demo";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.css";

ReactDOM.render(<div><App/> <BrowserRouter>
    <div>
    <Link to="/demo"></Link>
    <Route exact path="/demo" component={Demo}/>
    </div>
    </BrowserRouter></div>, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
