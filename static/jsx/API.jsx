import { isEqual } from 'lodash';
import { CSRF_TOKEN } from './csrf_token.jsx';

var API = {
    create_todo: async (startDate, descriptionValue, reload_id) => {
        return await fetch('/todo/insert', {
            method: 'POST',
            headers: {
                'CSRF-TOKEN': CSRF_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description: descriptionValue,
                date: startDate.toDateString(),
                done: false
            })
        }).then((res) => {
            if (res.status != 200) {
                return Promise.reject(false);
            }
            return res.json();
        }).then((res) => {
            if (res['success']) {
                document.getElementById(reload_id).click();
            }
            else {
                return Promise.reject(false);
            }
            return true;
        }, (error) => {
            console.log(error);
            return false;
        });
    },
    update_todo: (elem_id, reload_fun) => {
        fetch('/todo/done', {
            method: 'POST',
            headers: {
                'CSRF-TOKEN': CSRF_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: elem_id
            })
        }).then((res) => {
            if (res.status != 200) {
                return Promise.reject(false);
            }
            return res.json();
        }).then((res) => {
            if (!res['success']) {
                return false;
            }
            reload_fun();
            return true;
        }, (error) => {
            console.log(error);
            return false;
        });
    },
    delete_todo: (elem_id, reload_fun) => {
        fetch('/todo/delete', {
            method: 'POST',
            headers: {
                'CSRF-TOKEN': CSRF_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: elem_id
            })
        }).then((res) => {
            if (res.status != 200) {
                return Promise.reject(false);
            }
            return res.json();
        }).then((res) => {
            if (!res['success']) {
                return false;
            }
            reload_fun();
            return true;
        }, (error) => {
            console.log(error);
            return false;
        });
    },
    fetch_todos: async (ids, storage_id, table, setValue, path_params) => {
        let e_table = document.getElementById(ids.table),
            e_reload_btn = document.getElementById(ids.reload),
            e_reload_icon = document.getElementById(ids.icon),
            e_spinner = document.getElementById('spinner');
        /* Show loading screen */
        if (table && e_table) {
            e_table.style.visibility = 'hidden';
        }
        e_reload_btn.innerText = 'Loading...';
        e_reload_icon.style.display = 'none';
        e_spinner.style.display = 'initial';
        /* Retrieve data */
        var res = await fetch('/todo/retrieve'+(path_params ? `/${path_params}`:'')),
            retrieved_data = await res.json(),
            vals_arr = [];
        for (let obj in retrieved_data) {
            if (obj == 'success') {
                continue;
            }
            let date_field = retrieved_data[obj]['date'] ?
                                (retrieved_data[obj]['date']).match(/^(\d{4}-\d{2}-\d{2})/)[0]
                                : null;
            vals_arr.push({
                desc: retrieved_data[obj]['description'],
                date: date_field,
                key: retrieved_data[obj]['_id']
            });
        }
        if (!isEqual(JSON.parse(sessionStorage.getItem(storage_id)), vals_arr)) {
            setValue(vals_arr);
            sessionStorage.setItem(storage_id, JSON.stringify(vals_arr));
        }
        /* End loading screen */
        e_spinner.style.display = 'none';
        e_reload_btn.innerText = 'Reload';
        e_reload_icon.style.display = 'initial';
        if (e_table) {
            e_table.style.visibility = 'visible';
        }
    }
}

export {
    API
};
