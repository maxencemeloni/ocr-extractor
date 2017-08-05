import req from 'request';
import fs from 'fs';
import logger from 'winston';

export function httpClient(settings, next) {

    if (settings.method === 'IMAGES') {
        let r = req.post(settings.url, (err, res, body) => {
            if (err) {
                logger.error('upload failed:', err);
            }
            next(err, res, body);
        });
        let form = r.form();
        form.append('apikey', settings.body.apikey);
        form.append('language', settings.body.language);
        form.append('my_field', 'image');
        form.append('image', fs.createReadStream(settings.files));
        form.append('my_buffer', new Buffer([1, 2, 3]));
        form.append('custom_file', fs.createReadStream(settings.files));
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