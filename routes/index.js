import express from 'express';
const router = express.Router();
import passport from 'passport';
import url from 'url';

import User from '../models/user';
import Airport from '../models/airport';

// Root route
router.get('/', (req, res) => {
    res.render('landing');
});

// ================
// AUTH ROUTES
// ================

// Show register form
router.get('/register', (req, res) => {
    const pageInfo = Object.assign({}, req.query);
    pageInfo.page = 'register';
    res.render('register', pageInfo);
});

// Handle sign up logic
router.post('/register', (req, res) => {
    const userProps = Object.assign({}, req.body);
    delete userProps.password;
    delete userProps.passwordVerify;

    if (req.body.passwordVerify !== req.body.password) {
        req.flash('error', 'Passwords do not match. Please try again');
        console.log(userProps);
        return res.redirect(url.format({
            pathname: '/register',
            query: userProps
        }));
    }

    delete userProps.adminCode;

    const newUser = new User(userProps);
    if (req.body.adminCode === process.env.ADMIN_CODE) newUser.isAdmin = true;

    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        
        passport.authenticate('local')(req, res, () => {
            console.log(user);
            console.log(err);
            req.flash('success', `Welcome to Air-Quality ${user.isAdmin ? 'admin ' : ''}${user.username}`);
            res.redirect('/airports');
        });
    });
});

// Show login form
router.get('/login', (req, res) => {
    res.render('login', {page: 'login'});
})

// Handle sign in login
router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/airports',
        failureRedirect: '/login'
    }), (req, res) => {
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out!');
    res.redirect('/airports');
});

// USER PROFILE
router.get('/users/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/airports');
        }

        Airport.find().where('author.id').equals(user._id).exec((err, airports) => {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('/airports');
            }
            res.render('users/show', {user, airports});
        });
    });
});

export default router;