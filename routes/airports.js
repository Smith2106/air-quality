import express from 'express';
const router = express.Router();

import Airport from '../models/airport';

// INDEX - show all aiports
router.get('/', (req, res) => {
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

// CREATE - add a new airport to DB
router.post('/', isLoggedIn, (req, res) => {
    // Get data from form and add to airports array
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newAirport = {name, image, author, description};
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

// NEW - show form to create new campground
router.get('/new', isLoggedIn, (req, res) => {
    res.render('airports/new');
});

// SHOW - shows more info about one campground
router.get('/:id', (req, res) => {
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

// EDIT AIRPORT ROUTE
router.get('/:id/edit', checkAirportOwnership, (req, res) => {
    Airport.findById(req.params.id, (err, airport) => {
        res.render('airports/edit', {airport});        
    });
});

// UPDATE AIRPORT ROUTE
router.put('/:id', checkAirportOwnership, (req, res) => {
    Airport.findByIdAndUpdate(req.params.id, req.body.airport, (err, airport) => {
        if (err) {
            res.redirect('/airports');
        } 
        else {
            res.redirect(`/airports/${req.params.id}`);
        }
    });
});

// DESTROY AIRPORT ROUTE
router.delete('/:id', checkAirportOwnership, (req, res) => {
    Airport.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect('/airports');
        }
        else {
            res.redirect('/airports');
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

function checkAirportOwnership(req, res, next) {
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
}

export default router;