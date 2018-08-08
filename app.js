import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import LocalStrategy from 'passport-local';

import Airport from './models/airport';
import Comment from './models/comment';
import User from './models/user';
import seedDB from './seeds';

const app = express();

mongoose.connect('mongodb://localhost:27017/air-quality', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`))
seedDB();

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

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/airports', (req, res) => {
    // Get all airports from the db
    Airport.find({}, (err, airports) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('airports/index', { airports });
        }
    });
});

app.post('/airports', (req, res) => {
    // Get data from form and add to airports array
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description
    const newAirport = {name, image, description};
    // Create a new campground and save to DB
    Airport.create(newAirport, (err, newlyCreate) => {
        if (err) {
            console.log(err);
        }
        else {
            // Redirect to airports page
            res.redirect('/airports');
        }
    });
});

app.get('/airports/new', (req, res) => {
    res.render('airports/new');
});

app.get('/airports/:id', (req, res) => {
    // Find the aiport with the provided ID
    Airport.findById(req.params.id).populate("comments").exec((err, airport) => {
        if (err) {
            console.log(err);
        }
        else {
            // Render show template with that airport
            res.render('airports/show', {airport});
        }
    });
});

// =========================
// COMMENT ROUTES
// =========================

app.get('/airports/:id/comments/new', (req, res) => {
    Airport.findById(req.params.id, (err, airport) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('comments/new', {airport});
        }
    });
});

app.post('/airports/:id', (req, res) => {
    // Lookup campground using ID
    Airport.findById(req.params.id, (err, airport) => {
        if (err) {
            console.log(err);
            res.redirect('/airports');
        }
        else {
            // Create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                }
                else {
                    // Connect new comment to campground
                    airport.comments.push(comment);
                    airport.save();
                    // Redirect campground show page
                    res.redirect(`/airports/${airport._id}`);
                }
            });
        }
    });    
});

// ================
// AUTH ROUTES
// ================

// Show register form
app.get('/register', (req, res) => {
    res.render('register');
});

// Handle sign up logic
app.post('/register', (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('register');
        }

        passport.authenticate('local')(req, res, () => {
            res.redirect('/airports');
        });
    });
});

// Show login form
app.get('/login', (req, res) => {
    res.render('login');
})

// Handle sign in login
app.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/airports',
        failureRedirect: '/login'
    }), (req, res) => {
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/airports');
});

app.listen(3000, () => {
    console.log('Air-Quality server has started!');
});