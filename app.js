const dotenv = require('dotenv').config();
const express = require('express')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const MongoDBStore = require('connect-mongodb-session')(session);
// DB Connect
require('./src/config/dbConfig');

const app = express()
const port = process.env.PORT

// Router Settings
const mainRouter = require('./src/routers/mainRouter');

app.use(express.urlencoded({ extended: true }));
app.use((error, request, response, next) => {
    response.send(error.message);
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Template Engine Settings
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
app.use(expressLayouts);

const sessionStore = new MongoDBStore({
    uri: process.env.MONGODB_CONNECTION_STRING,
    collection: 'Sessions'
  });
  

app.use(cookieParser());
app.use(session(
    {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        },
        store:sessionStore
    }
));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());





app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Expose-Headers", "X-My-Custom-Header, X-Another-Custom-Header");
    next();
});




app.use('/', mainRouter);


app.use((req, res) => {
    res.status(404).json('Server Error')
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))