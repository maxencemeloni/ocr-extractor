import req from 'request';
import fs from 'fs';
import logger from 'winston';

export function httpClient(settings, next) {

    if (settings.method === 'IMAGES') {
        let formData = {};

        if (settings.files.length === 1) {
            formData.image = fs.createReadStream(settings.files);
        } else {
            formData.attachments = [];
            // TODO : USE ASYNC
            for (let file of settings.files) {
                formData.attachments.push(fs.createReadStream(file));
            }
        }

        formData = Object.assign({}, formData, settings);
        formData.method = "POST";
        req.post({url: settings.url, formData}, function optionalCallback(err, res, body) {
            if (err) {
                logger.error('upload failed:', err);
            }
            next(err, res, body);
        });
    } else {

        req.req(buildRequest(settings), function(error, res, body) {
            if (error) {
                next(error);
            } else {
                next(null, res, body);
            }
        });
    }
}