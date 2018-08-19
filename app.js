import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import methodOverride from 'method-override';
import flash from 'connect-flash';

import Airport from './models/airport';
import Comment from './models/comment';
import User from './models/user';
import seedDB from './seeds';

// Import routes
import commentRoutes from './routes/comments';
import airportRoutes from './routes/airports';
import indexRoutes from './routes/index';
const dbURL = process.env.DATABASEURL || "mongodb://localhost:27017/air-quality";

const app = express();
mongoose.connect(dbURL, {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method'));
app.use(flash());
//seedDB(); // Seed the database

// PASPORT CONFIGURATION
app.use(require('express-session')({
    secret: 'Done cases remove hand oppressed after racing nervously intact through.',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use('/', indexRoutes);
app.use('/airports/', airportRoutes);
app.use('/airports/:id/comments', commentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, process.env.IP, () => {
    console.log('Air-Quality server has started!');
});