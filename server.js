const express = require('express'),
      app = express(),
      session = require('express-session'),
      mongo_store = require('connect-mongo')(session),
      csrf = require('csurf'),
      ejs = require('ejs'),
      mongoose = require('mongoose'),
      PORT = 8001;

/******** Configure MongoDB ********/
let todo_db = require('./todo_schema.js');

mongoose.connect('mongodb://127.0.0.1:27017/todo_lists', { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

/******** Configure Server ********/
const todo_API = express.Router();
app.use(session({
    secret: 'jg)Wjhmy3@zx',
    store: new mongo_store({mongooseConnection: db}),
    cookie: {
        sameSite: true
    }
}));
app.use(csrf());
app.use(express.json());
app.engine('html', ejs.renderFile);
app.set('views', __dirname+'/static/html');
app.use('/js', express.static('static/js'));
app.use('/todo', todo_API);

/******** Set Server Routes ********/
/* Main page */
app.get(/^\/(active|completed)?\/?$/, (req, res) => {
    res.render('index.html', {csrf_token: req.csrfToken()});
});
/* API endpoints */
todo_API.route('/insert').post(async (req, res) => {
    return res.status(200).json({
        success: await todo_db.insert(req.body)
    });
});
todo_API.route('/retrieve/:done?').get(async (req, res) => {
    console.log(req.params.done);
    return res.status(200).json(await todo_db.retrieve(req.params.done=='done'));
});
todo_API.route('/delete').post(async (req, res) => {
    return res.status(200).json({
        success: (await todo_db.delete(req.body)).deletedCount == 1
    });
});
todo_API.route('/done').post(async (req, res) => {
    return res.status(200).json({
        success: await todo_db.done(req.body)
    });
});

/******** Start Server ********/
var server = app.listen(PORT, () => {
    let host = server.address();
    console.log('Server is running at %s:%s', host.address, host.port);
});
