import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Airport from './models/airport';
import seedDB from './seeds';
const app = express();

mongoose.connect('mongodb://localhost:27017/air-quality', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
seedDB();

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/airports', (req, res) => {
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

app.post('/airports', (req, res) => {
    // Get data from form and add to airports array
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description
    const newAirport = {name, image, description};
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

app.get('/airports/new', (req, res) => {
    res.render('airports/new');
});

app.get('/airports/:id', (req, res) => {
    // Find the aiport with the provided ID
    Airport.findById(req.params.id).populate("comments").exec((err, airport) => {
        console.log(err);
        if (err) {
            console.log(err);
        }
        else {
            // Render show template with that airport
            res.render('airports/show', {airport});
        }
    });
});

// =========================
// COMMENT ROUTES
// =========================

app.get('/airports/:id/comments/new', (req, res) => {
    Airport.findById(req.params.id, (err, airport) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('comments/new', {airport});
        }
    });
});

app.listen(3000, () => {
    console.log('Air-Quality server has started!');
});