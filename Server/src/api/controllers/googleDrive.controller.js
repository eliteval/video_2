const httpStatus = require('http-status');
const path = require('path');
const fs = require('fs');

const { emailConfig, smsConfig, culqiConfing } = require("../../config/vars");
const client = require('twilio')(smsConfig.Sid, smsConfig.authToken);
const bcrypt = require('bcryptjs');
const { env, baseUrl } = require('../../config/vars');
const Culqi = require('culqi-node');
const APIError = require('../utils/APIError');
const Template = require('../models/template.model');

const { google } = require('googleapis');
const OAuth2Data = require("./../../../client_secret_google_drive.json");

const GoogleDriveService = require('./../services/googleDriveService');



const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URL = OAuth2Data.web.redirect_uris[0];

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);

const SCOPES =
    "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile";

var authed = false;
var uploadedFileName;

exports.index = async (req, res) => {
    uploadedFileName = req.query.fileName;
    if (!authed) {
        // Generate an OAuth URL and redirect there
        var url = oAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: SCOPES,
        });
        res.status(httpStatus.OK).json({authed, url });
    } else {
        res.status(httpStatus.OK).json({ authed});
    }
}

exports.callback = async (req, res) => {
    const code = req.query.code;
    console.log('code')
    console.log(code)
    if (code) {
        // Get an access token based on our OAuth code
        oAuth2Client.getToken(code, async function (err, tokens) {
            if (err) {
                console.log("Error authenticating");
                console.log(err);
            } else {
                console.log("Successfully authenticated");
                console.log(tokens)
                oAuth2Client.setCredentials(tokens);
                authed = true;
                await fileUpload(oAuth2Client, uploadedFileName)
                res.redirect(process.env.BASE_WEB_URL);
            }
        });
    }
}
exports.upload = async (req, res) => {
    await fileUpload(oAuth2Client, uploadedFileName)
    res.status(httpStatus.OK).json('ok');
}

const fileUpload = async (client, fileName) => {
    console.log('fileName')
    console.log(fileName)


    const googleDriveService = new GoogleDriveService(client);

    const finalPath = path.join(__dirname + `./../../public/editedVideos/${fileName}`);
    const folderName = 'Medias';

    if (!fs.existsSync(finalPath)) {
        throw new Error('File not found!');
    }

    let folder = await googleDriveService.searchFolder(folderName).catch((error) => {
        console.error(error);
        return null;
    });

    if (!folder) {
        folder = await googleDriveService.createFolder(folderName);
    }

    await googleDriveService.saveFile('SpaceX', finalPath, 'video/mp4', folder.id).catch((error) => {
        console.error(error);
    });

    console.info('File uploaded successfully!');

    // Delete the file on the server
    //fs.unlinkSync(finalPath);
    return 'ok';
};







