import express from 'express';
const router = express.Router();
import passport from 'passport';
import url from 'url';

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
    res.render('register', {page: 'register', username: req.query.username, adminCode: req.query.adminCode});
});

// Handle sign up logic
router.post('/register', (req, res) => {
    if (req.body.passwordVerify !== req.body.password) {
        req.flash('error', 'Passwords do not match. Please try again');
        return res.redirect(url.format({
            pathname: '/register',
            query: {
                "username": req.body.username,
                "adminCode": req.body.adminCode
            }
        }));
    }

    const newUser = new User({username: req.body.username});
    if (req.body.adminCode === process.env.ADMIN_CODE) newUser.isAdmin = true;

    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/register');
        }

        passport.authenticate('local')(req, res, () => {
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

export default router;