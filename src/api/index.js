import {version} from '../../package.json';
import {Router} from 'express';
import {toRes} from '../lib/util.js';
import facets from './facets';
import log from 'winston';
import {routes} from '../lib/routes.js';
import routesList from '../routes.json';
import fileUpload from 'express-fileupload';
import multer from 'multer';
import extractText from '../controllers/extractText.js';

export default ({config, db}) => {
    let api = Router();

    // mount the facets resource
    api.use('/facets', facets({config, db}));

    api.use(fileUpload());

    let upload = multer({dest: `${__dirname}/tmp`});
    api.post('/extractText', upload.single('image'), (req, res, next) => {
        extractText.extract(req, (err, result) => {
            console.log(result);
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(result);
            }
        });
    });
    // perhaps expose some API metadata at the root
    api.get('/', (req, res) => {
        res.json({version});
    });

    routes(api, routesList);

    return api;
}
