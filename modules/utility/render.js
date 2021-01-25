const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const color = require('colors');
const path = require('path');
const fs = require('fs');
const pathExists = require('path-exists');
const mkdirp = require('mkdirp');


ffmpeg.setFfmpegPath(ffmpegPath);


const renderEngine = async (episodeOptions) => {

    const ffPromises = [];

    const walkSync = async function (episodeOptions) {

        const {

            episodeDirPath,
            fullFileName,
            episodePath

        } = episodeOptions;

        const dirExistStatus = await pathExists(episodeDirPath);

        if (dirExistStatus) {

            const episodeDirExistStatus = await pathExists(episodePath);

            if (episodeDirExistStatus) {

                if (fs.statSync(episodePath).isFile()) {

                    // const episodeFileContent = await fs.readFile(episodePath);

                    // const fileName = fullFileName.replace(/\.mp4/, '');
                    const splitEpisodeFileName = fullFileName.split('.');

                    // todo an async function in promise constructor callback function
                    ffPromises.push(new Promise( (resolve) => {

                        const renderedVideoDirName = `${splitEpisodeFileName[0]}-hls`

                        // const renderVideoPath = path.join(episodeDirPath,)
                        const renderedVideoDirPath = path.join(episodeDirPath, renderedVideoDirName, 'v%v');
                        const renderedVideoOutputPath = path.join(renderedVideoDirPath, `${splitEpisodeFileName[0]}.m3u8`);

                        // await mkdirp(renderedVideoDirPath);

                        // fs.mkdir(`public/streams/${fileName}`, (err) => {

                        const infs = new ffmpeg

                        infs.addInput(episodePath).outputOptions([

                            // '-start_number 0',
                            // '-hls_time 10',
                            // '-hls_list_size 0',
                            // '-f hls',
                            // '-hls_segment_filename', 'v%v/fileSequence%d.ts',
                            '-profile:v baseline', // baseline profile (level 3.0) for H264 video codec
                            '-level 3.0',
                            '-start_number 0',     // start the first .ts segment at index 0
                            '-hls_time 10',        // 10 second segment duration
                            '-hls_list_size 0',    // Maxmimum number of playlist entries (0 means all entries/infinite)
                            '-f hls',        // HLS format
                            // '-hls_key_info_file', 'enc.keyinfo'


                            // ]).output('./v%v/output.m3u8')
                        ]).output(`${renderedVideoOutputPath}`)
                            .on('start', function (commandLine) {
                                console.log('Spawned Ffmpeg with command: ' + commandLine);
                            })
                            .on('error', function (err, stdout, stderr) {
                                console.log('An error occurred: ' + err.message, err, stderr);
                            })
                            .on('progress', function (progress) {
                                console.log('Processing: ' + progress.percent + '% done')
                            })
                            .on('end', function (err, stdout, stderr) {
                                console.log('🚛 Hls compilation complete:'.green)
                                // todo set url to db
                                // console.log(`✅\thttp://127.0.0.1:8000/stream/vod/term/${fileName}/${splitEpisodeFileName[0]}.m3u8`.red)
                                resolve();
                            })
                            .run()
                    }))

                }

            }

        }

    }

    await walkSync(episodeOptions);

    console.log('👨\tIn progress...'.blue);

    Promise.all(ffPromises).then(() => {
        console.log('All videos was successful converted\n\n\n'.green)
        // process.exit()
    });

};


module.exports = renderEngine;
