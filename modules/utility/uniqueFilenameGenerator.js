const path = require('path');
const pathExists = require('path-exists');
const genRndInt = require('./genRndInt');


const uniqueFilenameGenerator = async (reqFileName, fileDirPath, existName = false) => {

    // date object for using in name of uploaded file
    const date = new Date();

    const splitFileName = reqFileName.split('.');

    // generate a new fileName from origin filename
    const fileName = !existName ? splitFileName[0] + `-${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}` : reqFileName.split('.')[0] + `-${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}-${genRndInt(1000, 999999)}`;

    // full name of new uploaded episode file
    const fullFileName = `${fileName}.${splitFileName[1]}`;

    // directory path of fileName for checking the exist the
    const fullAddressOfFilename = path.join(fileDirPath, fullFileName);


    // check for duplicate filename for uploaded video
    const fullAddressOfFilenameExistStatus = await pathExists(fullAddressOfFilename);

    // already a file with this name is exist in server
    if (fullAddressOfFilenameExistStatus) {
        return (await uniqueFilenameGenerator(reqFileName, fileDirPath, true));
    } else {
        return fullFileName
    }


};


module.exports = uniqueFilenameGenerator;
