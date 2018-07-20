import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
const app = express();

mongoose.connect('mongodb://localhost:27017/air-quality', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// Schema Setup
const airportSchema = new mongoose.Schema({
    name: String,
    image: String
});

const Airport = mongoose.model('Airport', airportSchema);

// Airport.create({
//     name: 'Amsterdam Schiphol International Airport (AMS)',
//     image: 'https://amsterdamholland.ca/images/schiphollocation.jpg'
// }, (err, airport) => {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log("NEWLY CREATE AIRPORT: ");
//         console.log(airport);
//     }
// })

const airports = [
    {name: 'Indianapolis International Airport (IND)', image: 'http://www.hok.com/uploads/2012/04/10/indy-airport01.jpg'},
    {name: 'Amsterdam Schiphol International Airport (AMS)', image: 'https://amsterdamholland.ca/images/schiphollocation.jpg'},
    {name: 'Boston Logan Internation Airport (BOS)', image: 'http://www.hok.com/uploads/2012/03/28/boston-logan01.jpg'},
    {name: 'Indianapolis International Airport (IND)', image: 'http://www.hok.com/uploads/2012/04/10/indy-airport01.jpg'},
    {name: 'Amsterdam Schiphol International Airport (AMS)', image: 'https://amsterdamholland.ca/images/schiphollocation.jpg'},
    {name: 'Boston Logan Internation Airport (BOS)', image: 'http://www.hok.com/uploads/2012/03/28/boston-logan01.jpg'},
    {name: 'Indianapolis International Airport (IND)', image: 'http://www.hok.com/uploads/2012/04/10/indy-airport01.jpg'},
    {name: 'Amsterdam Schiphol International Airport (AMS)', image: 'https://amsterdamholland.ca/images/schiphollocation.jpg'},
    {name: 'Boston Logan Internation Airport (BOS)', image: 'http://www.hok.com/uploads/2012/03/28/boston-logan01.jpg'},
];

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
            res.render('airports', { airports });
        }
    });
});

app.post('/airports', (req, res) => {
    // Get data from form and add to airports array
    const name = req.body.name;
    const image = req.body.image;
    const newAirport = {name, image};
    airports.push(newAirport);
    // Redirect to airports page
    res.redirect('/airports');
});

app.get('/airports/new', (req, res) => {
    res.render('new.ejs');
});

app.listen(3000, () => {
    console.log('Air-Quality server has started!');
});