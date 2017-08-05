import log from 'winston';
import config from '../config.json';
import ExtractText from '../models/extractText.js';
import OCRExtractor from '../lib/ocr-extractor.js';
import { writeFile } from '../lib/write-file.js';

let controller = {};
controller.extract = (req, next) => {
    writeFile(req, config.upload, (err, filePath) => {
        if (err !== null) {
            log.error(`[CONTROLLER][extractText.extract] ${err}`);
            next(err, null);
        } else {
            let ocr = new OCRExtractor(filePath);
            ocr.extract(next);
        }
    });
};

export default controller;