import log from 'winston';
import config from '../config.json';
import ExtractText from '../models/extractText.js';
import OCRExtractor from '../lib/ocr-extractor.js';
import {writeFile} from '../lib/write-file.js';

let controller = {};
controller.extract = (req, next) => {
    //writeFile(req, config.upload, (err, filePath) => {
    //if (err !== null) {
    //  log.error(`[CONTROLLER][extractText.extract] ${err}`);
    //  next(err, null);
    //} else {
    //console.log(`${__dirname}/../tmp/${req.files.image.name}`);
    req.files.image.mv(`${__dirname}/../tmp`, (err, result) => {
        console.log(err);
        console.log(result);
        let ocr = new OCRExtractor(`${__dirname}/../tmp/${req.files.image.name}`);
        ocr.extract(next);
    });
//}
//});
};

export default controller;