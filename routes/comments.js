import express from 'express';
const router = express.Router({mergeParams: true});

import Airport from '../models/airport';
import Comment from '../models/comment';

// Comments new
router.get('/new', isLoggedIn, (req, res) => {
    Airport.findById(req.params.id, (err, airport) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('comments/new', {airport});
        }
    });
});

// Comments create
router.post('/', isLoggedIn, (req, res) => {
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

// Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

export default router;