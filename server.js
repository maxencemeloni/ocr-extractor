const express = require('express');
const app = express();
const async = require('async');
const config = require('./config.json');
const fs = require('fs');

app.get('/', (req, res) => {
    res.send();
});

app.post('/extract', (req, res) => {
});

app.use((req, res, next) => {
    res.status(404).send('404');
});

app.listen(3000, () => {
    console.log('')
    console.log('OCR extrection API START');
});


