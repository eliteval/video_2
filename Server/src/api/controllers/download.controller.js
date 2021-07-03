const httpStatus = require('http-status');
const path = require('path');
const fs = require('fs');

const Culqi = require('culqi-node');
const APIError = require('../utils/APIError');
const mime = require('mime');

/**
 * Load user and append to req.
 * @public
 */


exports.download = async (req, res) => {
    console.log(req.params.fileName)
    const videoPath = path.join(__dirname + './../../public/editedVideos/');
    const filename = req.params.fileName;
    const file = videoPath + filename;
    if (fs.existsSync(file)) {
      const mimetype = mime.lookup(file);
  
      res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      res.setHeader('Content-type', mimetype);
  
      var filestream = fs.createReadStream(file);
      filestream.pipe(res);
    } else {
      console.log('There is no such files');
    }
  
};







