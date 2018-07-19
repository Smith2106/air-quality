import express from 'express';
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/airports', (req, res) => {
    const airports = [
        {name: 'Indianapolis International Airport (IND)', image: 'http://www.hok.com/uploads/2012/04/10/indy-airport01.jpg'},
        {name: 'Amsterdam Schiphol International Airport (AMS)', image: 'https://amsterdamholland.ca/images/schiphollocation.jpg'},
        {name: 'Boston Logan Internation Airport (BOS)', image: 'http://www.hok.com/uploads/2012/03/28/boston-logan01.jpg'},
    ];

    res.render('airports', { airports });
});

app.listen(3000, () => {
    console.log('Air-Quality server has started!');
});