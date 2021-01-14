const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();
app.use(cors());

const debugHttp = require('debug')('shoes-shop:http')
const debugError = require('debug')('shoes-shop:error')
const passport = require("./config/passport");
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/db');
const route = require('./routes/index')
const {getCart} = require('./app/models/services/cartService');

db.connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// app.use(logger('combined', {stream: {write: msg => debugHttp(msg.trimEnd())}}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Config passport
app.use(session({
    secret: process.env.PASSPORT_SECRET,
    resave: true,
    saveUninitialized: false,
    rolling: true,
    store: new MongoStore({
        url: process.env.DB_URI_V2,
        dbName: process.env.DB_NAME
    }),
    cookie: {
        // sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 ngay
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(async (req, res, next) => {
    res.locals.user = req.user;
    if(req.user){
        res.locals.cart = await getCart(req.user._id);
    }
    next();
});

route(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {

    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    console.log(err);

    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    debugError(err);
    res.render('site/404', {
        title: '404',
        pageName: '404'
    });
});

module.exports = app;