import async from 'async';
import log from 'winston';
import tesseract from 'node-tesseract';
import tesseractjs from 'tesseract.js';
import {httpClient} from './http-client.js';
import config from '../config.json';

class OCRExtractor {
    constructor(file) {
        this.file = file;
        this.extracts = {};
    }

    extract(next) {
        log.info('---------- OCR Extraction start');
        async.parallelLimit({
                tesseract: (callback) => {
                    this.tesseract(callback);
                },
                tesseractjs: (callback) => {
                    this.tesseractjs(callback);
                },
                ocrapiservice: (callback) => {
                    this.ocrapiservice(callback);
                }
            },
            2,
            (err, results) => {
                if (err !== null) {
                    log.info(`[OCRExtractor.extract] ${err}`);
                } else {
                    log.info(results);
                }
                next(err, results);
            });
    }

    tesseract(next) {
        if (process.env.OS !== 'Windows_NT') {
            tesseract.process(this.file, function(error, text) {
                log.info('[OCR][tesseract] Result : ');
                if (error !== null) {
                    log.info('[OCR][tesseract] Error :');
                    log.info(error);
                } else {
                    text = text.trim();
                    log.info('[OCR][tesseract] Success :');
                    log.info(text);
                }
                next(null, {text, error});
            }, null, 6);
        } else {
            log.info('[OCR][tesseract] Skyped');
            next(null, {});
        }
    }

    tesseractjs(next) {
        if (process.env.OS !== 'Windows_NT') {
            log.info('[OCR][tesseractjs] Result : ');
            tesseractjs.recognize(this.file)
                .catch((err) => {
                    log.info('[OCR][tesseractjs] Error :');
                    log.error(err);
                    next(err, {err});
                })
                .then(function(result) {
                    let text = result.text.trim();
                    log.info('[OCR][tesseractjs] Success :');
                    log.info(text);
                    next(null, {text});
                });
        } else {
            log.info('[OCR][tesseractjs] Skyped');
            next(null, {});
        }
    }

    ocrapiservice(next) {
        if (process.env.OS !== 'Windows_NT') {
            log.info('[OCR][ocrapiservice] Result : ');
            let settings = config.ocrapiservice;
            settings.files = this.file;
            httpClient(settings, (err, res, text) => {
                if (err !== null) {
                    log.info('[OCR][ocrapiservice] Error :');
                    log.info(err);
                } else {
                    text = text.trim();
                    log.info('[OCR][ocrapiservice] Success :');
                    log.info(text);
                }
                next(err, {text, err});
            });
        } else {
            log.info('[OCR][ocrapiservice] Skyped');
            next(null, {});
        }
    }

}

export default OCRExtractor;