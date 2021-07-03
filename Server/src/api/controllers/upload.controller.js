const httpStatus = require('http-status');
const path = require('path');

const nodemailer = require("nodemailer");
const { emailConfig, smsConfig, culqiConfing } = require("../../config/vars");
const client = require('twilio')(smsConfig.Sid, smsConfig.authToken);
const bcrypt = require('bcryptjs');
const { env, baseUrl } = require('../../config/vars');
const Culqi = require('culqi-node');
const APIError = require('../utils/APIError');
const Template = require('../models/template.model');

const formidable = require('formidable');



/**
 * Load user and append to req.
 * @public
 */


exports.fileUpload = async (req, res) => {

    const file = req.files.myfile;
    console.log('file')
    console.log(file)
    var rand_no = Date.now();
    const fileName = rand_no + file.name;
    const filePath = path.join(__dirname + './../../public/uploadedVideos/');
    file.mv(filePath + fileName, function (error) {
        if (error) {
            console.log("file upload error", error)
        } else {
            res.status(httpStatus.CREATED).json(fileName);
        }
    });


};
exports.youtube = async (req, res) => {

    try {
        const videoPath = path.join(__dirname + './../../public/uploadedVideos/');
        const videoUrl = req.query.clipUrl;
        console.log(req.params.clipUrl)
        // Create WriteableStream
        var rand_no = Date.now();
        const fileName = rand_no + 'yt-video.mp4';
        const writeableStream = fs.createWriteStream(videoPath+fileName);

        // Listening for the 'finish' event
        writeableStream.on('finish', () => {
            console.log(`yt-video downloaded successfully`);
            res.status(httpStatus.CREATED).json(fileName);
        });

        ytdl(`${videoUrl}`, {
            format: "mp4",
        }).pipe(writeableStream);
    } catch (error) {
        return next(error);
    }

};
exports.fb = async (req, res) => {



};
exports.twitch = async (req, res) => {


};





