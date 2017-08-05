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
        async.waterfall([
            () => {
            this.tesseract(extracts, next);
            },
            OCRExtractor.mySecondFunction,
            OCRExtractor.myLastFunction,
        ], (err, result) => {
            if (err !== null) {
                log.error(`[OCRExtractor.extract] ${err}`);
            }
            next(err, result);
        });
    }

    tesseract(extracts, next) {
        nodecr.process(this.file,function(err, text) {
            log.info('[OCR][TESSERACT] Result : ');
            if (err !== null) {
                log.info('Error :');
                log.info(err);
            } else {
                log.info('Success :');
                log.info(text);
            }
            extracts.tesseract = text;
            next(err, text);
        }, null, 6);
    }

    static mySecondFunction(arg1, arg2, next) {
        // arg1 now equals 'one' and arg2 now equals 'two'
        next(null, 'three');
    }

    static myLastFunction(arg1, next) {
        // arg1 now equals 'three'
        next(null, 'done');
    }
}

export default OCRExtractor;