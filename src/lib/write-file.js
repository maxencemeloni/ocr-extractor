import fs from 'fs';
import { generateRandomHash } from '../lib/util.js';

export function writeFile(req, config, next) {
    //let base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
    let fileName = `${generateRandomHash()}.jpg`;
    let filePath = `${config.path}/${fileName}`;
    fs.writeFile(filePath, req.files.image, 'binary', function(err) {
        next(err, filePath);
    });	
}