import express from 'express';
const router = express.Router();

import Airport from '../models/airport';
import middleware from '../middleware';
import moment from 'moment';

// INDEX - show all aiports
router.get('/', (req, res) => {
    // Get all airports from the db
    Airport.find({}, (err, airports) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('airports/index', { airports, page: 'airports' });
        }
    });
});

// CREATE - add a new airport to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
    // Get data from form and add to airports array
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const traffic = req.body.traffic;
    const updatedAt = Date.now();
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newAirport = {name, image, author, description, traffic, updatedAt};
    // Create a new campground and save to DB
    Airport.create(newAirport, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        }
        else {
            // Redirect to airports page
            req.flash('success', 'Successfully created airport');
            res.redirect('/airports');
        }
    });
});

// NEW - show form to create new campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('airports/new');
});

// SHOW - shows more info about one campground
router.get('/:id', (req, res) => {
    // Find the aiport with the provided ID
    Airport.findById(req.params.id).populate("comments").exec((err, airport) => {
        if (err || !airport) {
            req.flash('error', 'Airport not found');
            res.redirect('back');
        }
        else {
            // Render show template with that airport
            res.render('airports/show', {airport, moment});
        }
    });
});

// EDIT AIRPORT ROUTE
router.get('/:id/edit', middleware.checkAirportOwnership, (req, res) => {
    Airport.findById(req.params.id, (err, airport) => {
        res.render('airports/edit', {airport});        
    });
});

// UPDATE AIRPORT ROUTE
router.put('/:id', middleware.checkAirportOwnership, (req, res) => {
    const newAirport = req.body.airport;
    newAirport.updatedAt = Date.now();
    Airport.findByIdAndUpdate(req.params.id, newAirport, (err, airport) => {
        if (err) {
            res.redirect('/airports');
        } 
        else {
            res.redirect(`/airports/${req.params.id}`);
        }
    });
});

// DESTROY AIRPORT ROUTE
router.delete('/:id', middleware.checkAirportOwnership, (req, res) => {
    Airport.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect('/airports');
        }
        else {
            req.flash('success', 'Successfully deleted airport');
            res.redirect('/airports');
        }
    });
});

export default router;