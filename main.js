const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const path = require('path');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const dotenv = require('dotenv');
const cors = require('cors');

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'local') {
    console.log('LOCAL ENV!!');
    dotenv.config();

} else if (process.env.NODE_ENV === 'dev') {
    console.log('DEV ENV!!');
    dotenv.config({ path: path.resolve(__dirname, '.env.dev') });

} else {
    console.log('PROD ENV!!');
    dotenv.config({ path: path.resolve(__dirname, '.env.prod') });
    
}

app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(process.env.EVENT_IMAGE_PATH));

// session setting START
const maxAge = 1000 * 60 * 30;
const sessionObj = {
    secret: 'green!@#$%^',
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore({checkPeriod: maxAge}),
    cookie: {
        maxAge: maxAge,
    }
};
app.use(session(sessionObj));
// session setting END

app.get('/', (req, res) => {
    console.log('/');
    res.redirect('/home');

});

// router setting START
const homeRouter = require('./routes/homeRouter');
app.use('/home', homeRouter);

const bookRouter = require('./routes/bookRouter');
app.use('/book', bookRouter);

const libraryRouter = require('./routes/libraryRouter');
app.use('/library', libraryRouter);

const eventRouter = require('./routes/eventRouter');
app.use('/event', eventRouter);

app.listen(3000);