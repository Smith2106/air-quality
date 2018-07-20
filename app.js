import express from 'express';
import bodyParser from 'body-parser';
const app = express();

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

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/airports', (req, res) => {
    res.render('airports', { airports });
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