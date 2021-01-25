const path = require('path');
const mainDirPath = process.cwd();


module.exports = {
    secretKey: 'awsexrctvybunjmk#$%^lmnubyvtcr5678xecfvghbnjk',
    port: 80,
    path: {
        public: {
            main: path.join(mainDirPath, 'public'),
            streamSource: {
                main: path.join(mainDirPath, 'public/videos/hf/terms/term-2/episode-1/saleh-2021-0-24-hls/v0')
            },
            subDir: {
                video: {
                    main: path.join(mainDirPath, 'public/videos'),
                    hf: {
                        main: path.join(mainDirPath, 'public/videos/hf'),
                        terms: path.join(mainDirPath, 'public/videos/hf/terms')
                    },
                }
            },
        },
        routes: {
            main: path.join(mainDirPath, 'routes')
        },
        models: {
            main: path.join(mainDirPath, 'model')
        },
        controllers: {
            main: path.join(mainDirPath, 'controller')
        },
        modules: {
            main: path.join(mainDirPath, 'modules'),
            utility: {
                main: path.join(mainDirPath, 'modules/utility/'),
                uniqueFilenameGenerator: path.join(mainDirPath, 'modules/utility/uniqueFilenameGenerator.js'),
                episodeNameGenerator: path.join(mainDirPath, 'modules/utility/episodeFilenameGenerator.js'),
                render: path.join(mainDirPath, 'modules/utility/render.js')
            }
        }
    },


};
