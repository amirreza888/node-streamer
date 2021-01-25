const router = require('express').Router();


// Modules
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const mkdirp = require('mkdirp');
const pathExists = require('path-exists');
const uniqueFileNameGenerator = require(config.path.modules.utility.uniqueFilenameGenerator);
const episodeNameGenerator = require(config.path.modules.utility.episodeNameGenerator);
const renderEngine = require(config.path.modules.utility.render);

// multipart-formData config
const uploadVideo = multer();



router.post('/video/term/:termId/:episodeId', uploadVideo.single('episodeFile'), async (req, res, next) => {

    try {

        if ('file' in req && req.file) {

            const originFileNameReg = /[^A-Za-z-1-9]/g;
            const originFileName = (req.file.originalname).split('.')[0];

            // if origin filename is valid
            if (!originFileNameReg.test(originFileName)) {

                if (req.file.fieldname === 'episodeFile') {

                    if (req.file.mimetype === 'video/mp4') {

                        if (req.file.size <= (1073741824 * 2)) {

                            // main path of term files directories
                            const mainPath = path.join(process.cwd(), '/public');

                            // name of term in url params
                            const termId = req.params['termId'];

                            // validation schema for term name
                            const regTermDirValidator = /^term-\d{1,4}$/g;

                            // validation for entered term id in url
                            if (regTermDirValidator.test(termId)) {

                                // path of requested term files directory
                                const termDirPath = path.join(config['path'].public.subDir.video.hf.terms, termId);

                                // status of already uploaded file in existing
                                const termDirExistStatus = await pathExists(termDirPath);


                                // term files directory is exist and we should just add the payload video file to that directory
                                if (!termDirExistStatus) {
                                    // make directory of target term files
                                    await mkdirp(termDirPath);
                                }


                                const episodeId = req.params['episodeId'];

                                // validation schema for term name
                                const regEpisodeIdValidator = /^episode-\d{1,20}$/g;


                                // validation for entered term id in url
                                if (regEpisodeIdValidator.test(episodeId)) {

                                    let episodeDirPath = path.join(termDirPath, episodeId);

                                    const episodeDirExistStatus = await pathExists(episodeDirPath);

                                    // term files directory is exist and we should just add the payload video file to that directory
                                    if (!episodeDirExistStatus) {
                                        await mkdirp(episodeDirPath);
                                    }

                                    // original name of uploaded file
                                    const reqFileName = req.file.originalname;

                                    // fullName of
                                    // const fullFileName = episodeNameGenerator(reqFileName, true);
                                    const fullFileName = await uniqueFileNameGenerator(reqFileName, episodeDirPath);

                                    // unique episode name and directory
                                    const episodePath = path.join(episodeDirPath, fullFileName);

                                    // write the file in storage
                                    await fs.writeFile(episodePath, req.file.buffer);


                                    await renderEngine({
                                        episodeDirPath,
                                        episodePath,
                                        fullFileName
                                    });

                                    return res.status(201).json({
                                        success: true,
                                        msg: 'ویدیوی مورد نظر با موفقیت آپلود شد'
                                    });


                                } else {
                                    return res.status(400).json({
                                        success: false,
                                        msg: 'درخواست نامعتبر است'
                                    });
                                }

                            } else {
                                return res.status(400).json({
                                    success: false,
                                    msg: 'درخواست نامعتبر است'
                                });
                            }

                        } else {
                            return res.status(400).json({
                                success: false,
                                msg: 'حداکثر سایز برای آپلود برابر 2 گیگابایت است'
                            });
                        }


                    } else {
                        return res.status(400).json({
                            success: false,
                            msg: 'فرمت فایل وارد شده اشتباه است'
                        });
                    }

                } else {
                    return res.status(400).json({
                        success: false,
                        msg: 'نوع داده ای فایل آپلود شده غیر مجاز است'
                    });
                }


            } else {
                return res.status(400).json({
                    success: false,
                    msg: 'نام فایل ورودی غیر مجاز است'
                });
            }
        } else {

            return res.status(400).json({
                success: false,
                msg: 'field name of request is not valid'
            });

        }

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            msg: 'internal server error'
        })
    }

});


module.exports = router;
