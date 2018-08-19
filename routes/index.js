import express from 'express';
const router = express.Router();
import passport from 'passport';
import url from 'url';
import async from 'async';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

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

// Forgot password
router.get('/forgot', (req, res) => {
    res.render('forgot');
});

router.post('/forgot', (req, res, next) => {
    async.waterfall([
        done => {
            crypto.randomBytes(20, (err, buf) => {
                const token = buf.toString('hex');
                done(err, token);
            });
        },
        (err, token) => {
            User.findOne({ email: req.body.email }, (err, user) => {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + (1000 * 60 * 60);
                user.save(err => {
                    done(err, token, user);
                });
            });
        },
        (token, user, done) => {
            const smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'elijahs2106@gmail.com',
                    pass: process.env.GMAILPW
                }
            });

            const mailOptions = {
                to: user.email,
                from: 'elijahs2106@gmail.com',
                subject: 'Air-Quality Password Reset',
                text: 'You are recieving this email because a password reset was requested for an account registered under this email.' +
                    'Please click the following link, or paste it in your browser to reset your password.\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request a password reset, please ignore this message.'
            };
            smtpTransport.sendMail(mailOptions, (err) => {
                console.log('mail sent');
                req.flash('success', `An e-mail has been sent to ${user.email} with further instructions.`);
                done(err, 'done');
            });
        }
    ], (err) => {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});

export default router;