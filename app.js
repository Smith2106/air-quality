import express from 'express';
const app = express();

app.get('/', (req, res) => {
    res.send('This will be the landing page.')
});

app.listen(3000, () => {
    console.log('Air-Quality server has started!');
});