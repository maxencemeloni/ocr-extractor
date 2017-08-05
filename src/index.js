import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import json from 'morgan-json';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';
import winston from 'winston';
import path from 'path';
import mkdir from 'mkdir';

let app = express();
if (app.settings.env === 'development') {
    // require('expressjs-api-explorer')(app, express);
} else if (app.settings.env === 'production') {
    // security
    const helmet = require('helmet');
    app.use(helmet(config.helmet));
}

// create tmp dir
mkdir('../tmp');

winston.info('*******************************************************');
winston.info('************* STARTING OCR EXTRACTOR API **************');
winston.info('*******************************************************');

app.server = http.createServer(app);

// logger
const loggerFormat = json({
    short: ':method :url :status',
    length: ':res[content-length]',
    'response-time': ':response-time ms'
});
const loggerConfig = {
    stream: {
        write: function(obj) {
            winston.info(obj);
        }
    }
};
app.use(morgan(loggerFormat, loggerConfig));

// 3rd party middleware
app.use(cors({
    exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
    limit: config.bodyLimit
}));

initializeDb(db => {

    // internal middleware
    app.use(middleware({config, db}));

    require('expressjs-api-explorer')(app, express);
    // api router
    app.use('/api', api({config, db}));

    // display public
    app.use('/', function(req, res) {
        res.sendFile(path.join(__dirname+'/public/index.html'));
    });


    app.server.listen(process.env.PORT || config.port, () => {
        winston.info(`************* Started on port ${app.server.address().port} *************`);
    });
});

export default app;
