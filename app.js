const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const app = express();
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require("./config/passport")(passport)


//mongoose
mongoose.connect('mongodb://node-ispk:node-ispk@node-rest-ispk-shard-00-00.zsowq.mongodb.net:27017,node-rest-ispk-shard-00-01.zsowq.mongodb.net:27017,node-rest-ispk-shard-00-02.zsowq.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-7t3scy-shard-0&authSource=admin&retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
	.then(() => console.log('connected,,'))
	.catch((err) => console.log(err));

//EJS
app.set('view engine', 'ejs');
app.use(expressEjsLayout);

//BodyParser
app.use(express.urlencoded({ extended: false }));

//express session
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

//use flash
app.use(flash());
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
})

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.listen(3000);