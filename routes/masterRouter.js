const router = require('express').Router();



// upload router
const uploadRouter = require('./upload/upload');



// add upload route
router.use('/upload',uploadRouter);




module.exports = router;
