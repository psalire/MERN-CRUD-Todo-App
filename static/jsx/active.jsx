import React from 'react';
import ReactDOM from 'react-dom';
import { ReloadMark, CancelMark, CheckMark, Trash } from './icons.jsx';
import { Content } from './content.jsx';
import { API } from './API.jsx';
import DatePicker from 'react-datepicker';

function AddTodoRow(props) {
    const [startDate, setStartDate] = React.useState(new Date()),
          [msg, setMsg] = React.useState(null),
          description_ref = React.useRef(null),
          ERR_MSG = <span className="text-danger pt-1">Failed to add todo. Try again?</span>;

    function handle_date_change(date) {
        setStartDate(date);
    }
    function Msg() {
        return msg ?
            (<tr>
                <td colSpan="2">
                    {msg}
                </td>
            </tr>) : null
        ;
    }

    return props.isAddingTodo ? (
        /* Add todo row active */
        <React.Fragment>
            <tr>
                <td>
                    <input
                        type="text"
                        placeholder="Description"
                        className="form-control w-100"
                        ref={description_ref} />
                </td>
                <td>
                    <DatePicker
                        id="calendar"
                        selected={startDate}
                        onChange={handle_date_change}
                        name="date"
                        className="form-control" />
                    <CheckMark color="#5cb85c" onClick={async (e) => {
                        e.preventDefault();
                        await API.create_todo(startDate, description_ref.current.value, 'reload_todo') ?
                            setMsg(null) : setMsg(ERR_MSG);
                        }
                    } />
                    <CancelMark
                        color="#d9534f"
                        onClick={(e) => {
                            e.preventDefault();
                            props.setIsAddingTodo(false);
                        }
                    } />
                </td>
            </tr>
            <Msg />
        </React.Fragment>
    ) : (
        /* Add todo row not active */
        <React.Fragment>
            <Msg />
            <tr>
                <td colSpan="2">
                    <a href="" onClick={(e) => {
                            e && e.preventDefault();
                            props.setIsAddingTodo(!props.isAddingTodo);
                        }
                    }>
                        Add a new todo <span className="font-weight-bold text-success">+</span>
                    </a>
                </td>
            </tr>
        </React.Fragment>
    );
}

function Active(props) {
    const [todos, setTodos] = React.useState(JSON.parse(sessionStorage.getItem('todos'))),
          [isAddingTodo, setIsAddingTodo] = React.useState(false);

    function reload_todos(clearAddRow) {
        clearAddRow && setIsAddingTodo(false);
        API.fetch_todos({
            table: 'todos_table',
            reload: 'reload_todo',
            icon: 'reload_todo_icon'
        }, 'todos', !!todos, setTodos);
    }

    React.useEffect(() => {
        !todos && reload_todos();
    }, []);

    return (
        <Content
            header={
                <span>
                    Active Todos <ReloadMark
                                    id="reload_todo"
                                    iconId="reload_todo_icon"
                                    color="#0275d8"
                                    onClick={reload_todos} />
                </span>
            }
            contentBody={
                todos?
                (<table id="todos_table" className="text-center">
                    <thead>
                        <tr>
                            <th>Todo Description</th>
                            <th>Due Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todos && todos.length ? todos.map((todo) => {
                            return (
                                <tr key={todo['key']} id={todo['key']}
                                    onMouseEnter={() => {
                                        /* Show icons on hover */
                                        document.getElementById(todo['key']+'_todo_cm').style.visibility = 'initial';
                                        document.getElementById(todo['key']+'_todo_dm').style.visibility = 'initial';
                                    }}
                                    onMouseLeave={() => {
                                        /* Hide icons on leave */
                                        document.getElementById(todo['key']+'_todo_cm').style.visibility = 'hidden';
                                        document.getElementById(todo['key']+'_todo_dm').style.visibility = 'hidden';
                                    }}>
                                    <td>{todo['desc']}</td>
                                    <td>
                                        {todo['date']}
                                        <CheckMark
                                            id={todo['key']+'_todo_cm'}
                                            color="#5cb85c"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                API.update_todo(todo['key'], ()=>{reload_todos(true)});
                                            }}
                                            addClass="done" />
                                        <Trash
                                            id={todo['key']+'_todo_dm'}
                                            color="#d9534f"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                API.delete_todo(todo['key'], reload_todos);
                                            }} />
                                    </td>
                                </tr>
                            );
                        }): <tr><td colSpan="2">Nothing to do!</td></tr>}
                        <AddTodoRow
                            isAddingTodo={isAddingTodo}
                            setIsAddingTodo={setIsAddingTodo} />
                    </tbody>
                </table>) : null
            } />
    );
}

export {
    Active
};
