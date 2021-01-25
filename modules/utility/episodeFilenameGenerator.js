const episodeNameGenerator = (originalFullName, extension = false) => {

    // date object for using in name of uploaded file
    const date = new Date();

    const splitOriginalName = originalFullName.split('.');
    const orgFileName = splitOriginalName[0];
    const orgExtName = splitOriginalName[1];

    // original name of uploaded file
    const reqFileName = extension === true && orgFileName || originalFullName;

    // name of new uploaded episode file
    const fileName = reqFileName + `-${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;

    // full name of new uploaded episode file
    return `${fileName}.${orgExtName}`;

};



module.exports = episodeNameGenerator;
