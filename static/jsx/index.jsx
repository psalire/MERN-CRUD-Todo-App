import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
    Link
} from "react-router-dom";
import '../scss/bs.scss';
import 'react-datepicker/dist/react-datepicker.css';
import { Active } from './active.jsx';
import { About } from './about.jsx';
import { Completed } from './completed.jsx'

function NavLinkItem(props) {
    return (
        <div className={"navlink_container"+(props.borderRight ? " border-right":"")}>
            <NavLink exact to={props.path} activeClassName="font-weight-bold" className="navlink">
                {props.anchor}
            </NavLink>
        </div>
    );
}

function App(props) {
    return (
        <Router>
            <nav className="text-center border-bottom border-top text-light py-1 d-flex"
                style={{'backgroundColor':'#ececec'}}>
                <NavLinkItem
                    path="/"
                    borderRight={true}
                    anchor="About" />
                <NavLinkItem
                    path="/active"
                    borderRight={true}
                    anchor="Active Todos" />
                <NavLinkItem
                    path="/completed"
                    borderRight={false}
                    anchor="Completed Todos" />
            </nav>
            <Switch>
                <Route exact sensitive path="/">
                    <About />
                </Route>
                <Route exact path="/active">
                    <Active />
                </Route>
                <Route exact sensitive path="/completed">
                    <Completed />
                </Route>
            </Switch>
        </Router>
    );
}

document.getElementById('spinner').style.display = 'none';
document.getElementById('main').style.opacity = 1;
sessionStorage.clear();
ReactDOM.render(
    <App />,
    document.getElementById('root')
);
