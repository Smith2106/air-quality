import express from 'express';
const router = express.Router({mergeParams: true});

import Airport from '../models/airport';
import Comment from '../models/comment';
import middleware from '../middleware';

// Comments new
router.get('/new', middleware.isLoggedIn, (req, res) => {
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
router.post('/', middleware.isLoggedIn, (req, res) => {
    // Lookup airport using ID
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
                    // Add user and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    airport.comments.push(comment);
                    airport.save();
                    // Redirect airport show page
                    res.redirect(`/airports/${airport._id}`);
                }
            });
        }
    });    
});


// EDIT COMMENT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    const airport_id = req.params.id;
    Comment.findById(req.params.comment_id, (err, comment) => {
        if (err) {
            res.redirect('back');
        }
        else {
            res.render('comments/edit', { airport_id, comment });
        }
    });
});

// UPDATE COMMENT ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
        if (err) {
            res.redirect('back');
        }
        else {
            res.redirect(`/airports/${req.params.id}`);
        }
    });
});

// DESTROY COMMENT ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect('back');
        }
        else {
            res.redirect(`/airports/${req.params.id}`);
        }
    });
});

export default router;