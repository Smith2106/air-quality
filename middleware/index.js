import Airport from '../models/airport';
import Comment from '../models/comment';

const middlewareObj = {
    checkAirportOwnership(req, res, next) {
        // Is user logged in
        if (req.isAuthenticated()) {
            Airport.findById(req.params.id, (err, airport) => {
                if (err || !airport) {
                    req.flash('error', 'Airport not found');
                    res.redirect('back');
                }
                else {
                    // Does user own the campground
                    if (airport.author.id.equals(req.user._id)) {
                        next();
                    }
                    else {
                        req.flash('error', "You don't have permission to do that");
                        res.redirect('back');
                    }
                }
            });
        }
        else {
            req.flash('error', 'You need to be logged in to do that')
            res.redirect('back');
        }
    },
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('/login');
    },
    checkCommentOwnership(req, res, next) {
        // Is user logged in
        if (req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, (err, comment) => {
                if (err || !comment) {
                    req.flash('error', 'Comment not found');
                    res.redirect('back');
                }
                else {
                    // Does user own the campground
                    if (comment.author.id.equals(req.user._id)) {
                        next();
                    }
                    else {
                        req.flash('error', "You don't have permission to do that");
                        res.redirect('back');
                    }
                }
            });
        }
        else {
            req.flash('error', 'You need to be logged in to do that')
            res.redirect('back');
        }
    }
};

export default middlewareObj;