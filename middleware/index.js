import Airport from '../models/airport';
import Comment from '../models/comment';

const middlewareObj = {
    checkAirportOwnership(req, res, next) {
        // Is user logged in
        if (req.isAuthenticated()) {
            Airport.findById(req.params.id, (err, airport) => {
                if (err) {
                    res.redirect('back');
                }
                else {
                    // Does user own the campground
                    if (airport.author.id.equals(req.user._id)) {
                        next();
                    }
                    else {
                        res.redirect('back');
                    }
                }
            });
        }
        else {
            res.redirect('back');
        }
    },
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    },
    checkCommentOwnership(req, res, next) {
        // Is user logged in
        if (req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, (err, comment) => {
                if (err) {
                    res.redirect('back');
                }
                else {
                    // Does user own the campground
                    if (comment.author.id.equals(req.user._id)) {
                        next();
                    }
                    else {
                        res.redirect('back');
                    }
                }
            });
        }
        else {
            res.redirect('back');
        }
    }
};

export default middlewareObj;