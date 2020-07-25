import React from 'react';
import ReactDOM from 'react-dom';

function Content(props) {
    return (
        <div>
            <h2 className="content_header">{props.header}</h2>
            {props.contentBody}
        </div>
    );
}

export {
    Content
};
