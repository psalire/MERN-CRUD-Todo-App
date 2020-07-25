import React from 'react';
import ReactDOM from 'react-dom';
import { ReloadMark, Trash } from './icons.jsx';
import { isEqual } from 'lodash';
import { Content } from './content.jsx';
import { API } from './API.jsx';

function Completed(props) {
    const [completes, setCompletes] = React.useState(JSON.parse(sessionStorage.getItem('completes')));

    function reload_completes() {
        API.fetch_todos({
            table: 'completes_table',
            reload: 'reload_completes',
            icon: 'reload_completes_icon'
        }, 'completes', !!completes, setCompletes, 'done');
    }

    React.useEffect(() => {
        !completes && reload_completes();
    }, []);

    return (
        <Content
            header={
                <span>
                    Completed Todos <ReloadMark
                                        id="reload_completes"
                                        iconId="reload_completes_icon"
                                        color="#0275d8"
                                        onClick={reload_completes} />
                </span>
            }
            contentBody={
                <table id="completes_table" className="text-center">
                    <thead>
                        <tr>
                            <th>Todo Description</th>
                            <th>Due Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {completes && completes.length ? completes.map((complete) => {
                            return (
                                <tr key={complete['key']} id={complete['key']}
                                    onMouseEnter={() => {
                                        document.getElementById(complete['key']+'_comp_dm').style.visibility = 'initial';
                                    }}
                                    onMouseLeave={() => {
                                        document.getElementById(complete['key']+'_comp_dm').style.visibility = 'hidden';
                                    }}>
                                    <td>{complete['desc']}</td>
                                    <td>
                                        {complete['date']}
                                        <Trash
                                            id={complete['key']+'_comp_dm'}
                                            color="#d9534f"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                API.delete_todo(complete['key'], reload_completes);
                                            }} />
                                    </td>
                                </tr>
                            );
                        }): <tr><td colSpan='2'>No todos compeleted yet!</td></tr>}
                    </tbody>
                </table>
            }/>
    );
}

export {
    Completed
};
