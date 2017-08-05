import async from 'async';
import log from 'winston';
import tesseract from 'node-tesseract';
import tesseractjs from 'tesseract.js';

class OCRExtractor {
    constructor(file, config) {
        this.config = config;
        this.file = file;
        this.extracts = {};
    }

    extract(next) {
        console.log('---------- OCR Extraction start');
        async.parallelLimit({
                tesseract: (callback) => {
                    this.tesseract(callback);
                },
                tesseractjs: (callback) => {
                    this.tesseractjs(callback);
                }
            },
            2,
            (err, results) => {
                if (err !== null) {
                    log.error(`[OCRExtractor.extract] ${err}`);
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
                    log.info('Error :');
                    log.info(error);
                } else {
                    text = text.trim();
                    log.info('Success :');
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
        log.info('[OCR][tesseractjs] Result : ');
        tesseractjs.recognize(this.file)
            .progress(function(p) {
            })
            .catch(err => {
                log.info('Error :');
                log.error(err);
                next(err, {err});
            })
            .then(function(result) {
                let text = result.text.trim();
                log.info('Success :');
                log.info(text);
                next(null, {text});
            });
    }
}

export default OCRExtractor;