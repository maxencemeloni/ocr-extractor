import log from 'winston';
import extractText from '../controllers/extractText';

let upload = null;

export function routes(api, routesList) {
    log.info('------------------------');
    log.info('--- Loading routes : ---');
    log.info('------------------------');

    for (let name in routesList) {
        let routes = routesList[name];
        for (let route of routes) {
            const isActive = route.active ? 'ON' : 'OFF';
            log.info(`[ROUTE][${isActive}] ${name}${route.args} ${route.method} `);
            let response = {"status": 400, "result": route.description};
            if (route.active) {
                if (route.method === 'GET') {
                    api.get(`/${name}${route.args}`, (req, res) => {
                        if (route.args !== "") {
                            let collection = require(`../controllers/${route.controller}.js`);
                            collection.find(req.params.id, toRes(res));
                        } else {
                            res.status(response.status).json(response.result);
                        }
                    });
                } else if (route.method === 'POST') {
                    api.post(`/${name}`, (req, res) => {
                        let args = req.params;
                        res.status(200).json({"description": route.description, "args": args});
                    });
                } else if (route.method === 'FILES') {
                    //let upload = multer({dest: `${__dirname}/../tmp`});
                    //api.post(`/${name}`, upload.single('image'), (req, res) => {
                    //    extractText.extract(req, (err, result) => {
                    //        if (err) {
                    //            res.status(500).send(err);
                    //        } else {
                    //            res.status(200).send(result);
                    //        }
                    //    });
                    //});
                    /*
                    api.post(`/${name}`, (req, res) => {


                        if (!req.files)
                            return res.status(400).send('No files were uploaded.');

                        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
                        let sampleFile = req.files.sampleFile;

                        // Use the mv() method to place the file somewhere on your server
                        sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
                            if (err)
                                return res.status(500).send(err);

                            res.status(200).json({result: 'File uploaded!'});

                        });

                    });
                    */
                }
            }
        }
    }
}