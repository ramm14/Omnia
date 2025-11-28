
const methodOverride = require('method-override');

const express = require("express");

const mongoose = require("mongoose");

const session = require('express-session')

const path = require("path");

const passport = require("passport");

const LocalStrategy = require("passport-local");

const engine = require('ejs-mate');

const flash = require('connect-flash');

const MongoStore = require('connect-mongo');

const sanitizeV5 = require('./utils/mongoSanitizeV5.js');

const { connectDB } = require('./utils/dbConnection');

const ExpressError = require('./utils/ExpressError');

const { User } = require("./models/users");

const postRoutes = require("./routes/posts");

const userRoutes = require("./routes/users");

const movieRoutes = require("./routes/movies");

app = express();

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, "public")));

app.use(sanitizeV5({ replaceWith: '_' }));

app.set('views', path.join(__dirname, 'views'));

app.set('query parser', 'extended');

app.use(express.urlencoded({extended : true}));

app.set('view engine', 'ejs');

app.engine('ejs', engine);


app.use(express.json())

app.use(express.static('static'));

const sessionstorage = MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      dbName: "OmniaDB",       
      collectionName: "usersessions",  
      ttl: 14 * 24 * 60 * 60,      
      autoRemove: "native"   
});

const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionstorage,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

connectDB().then(() => console.log("DB Connected")).catch((err) => console.log("DB Connection Error: ", err));


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    console.log(res.locals.currentUser);
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.dbConnected = true;
    next();
})




app.use('/', postRoutes);

app.use('/', userRoutes);

app.use("/", movieRoutes);


app.use((req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('errorPage', { err });
});

app.listen(3000, ()=>{
    console.log("Server is running...");
})

// module.exports = app;

