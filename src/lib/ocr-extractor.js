import async from 'async';
import log from 'winston';
import tesseract from 'node-tesseract';
import nodecr from 'nodecr';

class OCRExtractor {
    constructor(file, config) {
        this.config = config;
        this.file = file;
        this.extracts = {};
    }

    extract(next) {
        console.log('---------- OCR Extraction start');
        async.parallel({
            tesseract: (callback) => {
                this.tesseract(callback);
            },
            ocr: (callback) => {
                this.ocr(callback);
            }
        }, (err, results) => {
            if (err !== null) {
                log.error(`[OCRExtractor.extract] ${err}`);
            }
            next(err, results);
        });
    }

    tesseract(next) {
        nodecr.process(this.file, function(error, text) {
            log.info('[OCR][TESSERACT] Result : ');
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
    }

    ocr(next) {
        nodecr.process(this.file, function(error, text) {
            log.info('[OCR][OCR] Result : ');
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
    }
}

export default OCRExtractor;