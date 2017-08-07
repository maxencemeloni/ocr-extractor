import log from 'winston';
import config from '../config.json';
import ExtractText from '../models/extractText.js';
import OCRExtractor from '../lib/ocr-extractor.js';
import {writeFile} from '../lib/write-file.js';
import { generateRandomHash } from '../lib/util.js';

let controller = {};
controller.extract = (req, next) => {
    //writeFile(req, config.upload, (err, filePath) => {
    //if (err !== null) {
    //  log.error(`[CONTROLLER][extractText.extract] ${err}`);
    //  next(err, null);
    //} else {
    //console.log(`${__dirname}/../tmp/${req.files.image.name}`);
    let fileName = `${generateRandomHash()}.jpg`;
    let filePath = `${__dirname}/tmp/${fileName}`;
    req.files.image.mv(filePath, (err, result) => {
        let ocr = new OCRExtractor(`${__dirname}/tmp/${filePath}`);
        ocr.extract(next);
    });
//}
//});
};

export default controller;