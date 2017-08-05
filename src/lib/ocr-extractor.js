import async from 'async';
import log from 'winston';
import tesseract from 'node-tesseract';
import nodecr from 'nodecr';

class OCRExtractor {
    constructor(file, config) {
        this.config = config;
        this.file = file;
    }

    extract(next) {
        console.log('---------- OCR Extraction start');
        let extracts = [];
        async.parallel({
            tesseract: (callback) => {
                this.tesseract(extracts, callback);
            },
            ocr: (callback) => {
                this.ocr(extracts, callback);
            }
        }, (err, results) => {
            if (err !== null) {
                log.error(`[OCRExtractor.extract] ${err}`);
            }
            next(err, results);
        });
    }

    tesseract(extracts, next) {
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
            extracts.tesseract = {text, error};
            next(null, extracts);
        }, null, 6);
    }

    ocr(extracts, next) {
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
            extracts.tesseract = {text, error};
            next(null, extracts);
        }, null, 6);
    }
}

export default OCRExtractor;