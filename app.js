const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const pathExists = require('path-exists');
const config = require('./config');


// application config
global.config = config;




// master router
const mainRouter = require('./routes/masterRouter');

// add an express webserver
const app = express();

// Cookie and Session MD
app.use(cookieParser());
// cookie encryptor MD


// cors policy
app.use(cors());


// routes
app.use(mainRouter);


// index page route
app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '/views/index.html'))
});


// streamer router
app.get('/hf/streams/:term/:videoName', async function (req, res) {

    try {

            const authenticationValidation = true;
            // todo check the username and password with Redis or just check for availability of auth cookie

            // user is valid and can get the video content
            if (authenticationValidation) {

                // name of term in url params
                const termId = req.params['term'];

                // regex for validation term id and term directory
                const regValidator = /^term-\d{1,4}$/g;


                // validation for entered term id in url
                if (regValidator.test(termId)) {

                    const fullFileName = req.params['videoName'];
                    const splitFileName = fullFileName.split('.');

                    const fileName = splitFileName[0];
                    const fileFormat = splitFileName[1];

                    const m3u8_Require = req.accepts('.m3u8') && fileFormat === 'm3u8';
                    const ts_Require = req.accepts('.ts') && fileFormat === 'ts';

                    if (m3u8_Require || ts_Require) {

                        if (ts_Require) {

                            const videoPath = path.join(`${config.path.public.streamSource.main}`, fullFileName);

                            // check file status
                            const stat = fs.statSync(videoPath);

                            // size of file
                            const fileSize = stat.size;

                            // range
                            // const range = req.headers.range;

                            const head = {
                                'Content-Length': fileSize,
                                'Content-Type': 'application/x-mpegURL',
                            };

                            res.writeHead(206, head);
                            fs.createReadStream(videoPath).pipe(res);



                        } else if (m3u8_Require) {

                            // res.cookie('auth',{a:1,b:2}, { maxAge: 900000, httpOnly: true });

                            // path of requested term files directory
                            const termDirPath = path.join(config.path.public.streamSource.main);


                            // check the directory status
                            const termDirExistStatus = await pathExists(termDirPath);


                            if (termDirExistStatus) {

                                // target video name
                                const videoName = req.params['videoName'];

                                // term video path in server
                                const termVideoPath = path.join(termDirPath, videoName);

                                // check the directory status
                                const termEpisodePathStatus = await pathExists(termVideoPath);

                                // check that target status exist status
                                if (termEpisodePathStatus) {

                                    // check file status
                                    const stat = fs.statSync(termVideoPath);

                                    // size of file
                                    const fileSize = stat.size;

                                    // range

                                    // if range is set in request header
                                    // todo m3u8 dont need to range

                                    const head = {
                                        'Content-Length': fileSize,
                                        'Content-Type': 'application/x-mpegURL',
                                    };

                                    res.writeHead(206, head);
                                    fs.createReadStream(termVideoPath).pipe(res);


                                } else {
                                    return res.status(404).send('not found');
                                }

                            } else {
                                return res.status(404).send('not found');
                            }
                        }
                    } else {
                        return res.status(400).json({
                            success: false,
                            message: 'bad request'
                        });
                    }
                } else {
                    return res.status(400).json({
                        success: false,
                        message: 'bad request'
                    });
                }
            } else {
                return res.status(403).send('access denied')
            }

    } catch (e) {
        console.log(e);
        return res.status(500).send('internal server error')
    }

})

const server = app.listen(config.port, () => {
    console.clear();
    console.log('👋🏻 Welcome to Local Hls-server'.blue)
    console.log(`🚀 Server was successful started at 127.0.0.1 with port`.yellow + ` ${server.address().port}`.green);
})

