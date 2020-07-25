import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import { Content } from './content.jsx';

function About(props) {
    return (
        <Content
            header=""
            contentBody={
                <div className="px-2 d-flex flex-column align-items-center">
                    <div className="display-4 mb-3 text-center text-success">Welcome to todoList!</div>
                    <h5 className="text-center">Get organized and manage all your todos here:</h5>
                    <ul>
                        <li><Link to="/active">Maintain a list of active todos</Link></li>
                        <li><Link to="/completed">Review your completed todos</Link></li>
                    </ul>
                </div>
            }/>
    );
}

export {
    About
};
