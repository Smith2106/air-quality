import express from 'express';
const router = express.Router();
import passport from 'passport';

import User from '../models/user';

// Root route
router.get('/', (req, res) => {
    res.render('landing');
});

// ================
// AUTH ROUTES
// ================

// Show register form
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle sign up logic
router.post('/register', (req, res) => {
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
router.get('/login', (req, res) => {
    res.render('login');
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

export default router;