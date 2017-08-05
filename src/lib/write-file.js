import fs from 'fs';
import { generateRandomHash } from '../lib/util.js';

export function writeFile(req, config, next) {
    let base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
    let fileName = `${generateRandomHash()}.png`;
    let filePath = `${config.path}/${fileName}`;
    fs.writeFile(filePath, base64Data, 'base64', function(err) {
        next(err, filePath);
    });
}