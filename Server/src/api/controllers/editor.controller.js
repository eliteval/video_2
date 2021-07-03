const httpStatus = require('http-status');
const path = require('path');
const nodemailer = require("nodemailer");
const { emailConfig, smsConfig, culqiConfing } = require("../../config/vars");
const client = require('twilio')(smsConfig.Sid, smsConfig.authToken);
const bcrypt = require('bcryptjs');
const { env, baseUrl } = require('../../config/vars');
const Culqi = require('culqi-node');
const APIError = require('../utils/APIError');
var ffmpeg = require('fluent-ffmpeg');
const editly = require('editly');

ffmpeg.setFfmpegPath('C:/ffmpeg/bin/ffmpeg.exe');
const ffmpegOnProgress = require('ffmpeg-on-progress')

var fs = require('fs');
const ytdl = require('ytdl-core');

let clients = [];
let facts = [];

var progressStatus = 0;


/**
 * Load user and append to req.
 * @public
 */
exports.youtube = async (req, res, next) => {
    try {
        const videoPath = path.join(__dirname + './../../public/videos/');
        const videoUrl = "https://www.youtube.com/watch?v=2IW5gFKdsvw";
        // Create WriteableStream
        const writeableStream = fs.createWriteStream(`yt-video.mp4`);

        // Listening for the 'finish' event
        writeableStream.on('finish', () => {
            console.log(`yt-video downloaded successfully`);
        });

        ytdl(videoUrl, {
            format: "mp4",
        }).pipe(writeableStream);
    } catch (error) {
        return next(error);
    }
};
exports.thumbnail = async (req, res, next) => {

    // estimated duration of output in milliseconds
    const durationEstimate = 1000

    const logProgress = (progress,event) => {
        // progress is a floating point number from 0 to 1
        console.log('progress',event.percent);
        exports.progressStatus = Math.floor(event.percent);
    }

    const videoPath = path.join(__dirname + './../../public/videos/');
    const videoFilePath = req.body.videoFilePath
    const template = req.body.template
    console
    const faceVideo = req.body.faceVideo
    const mainVideo = req.body.mainVideo

    const editedVideoPath = path.join(__dirname + './../../public/editedVideos/');
    const editedVideoName = Date.now() + 'Edited.mp4';

    if (template.name == 'split') {
        var padding = mainVideo.height / (1 - template.gamerVideo.height);
        var increasedPadding = padding - mainVideo.height;

        var ratio = mainVideo.width / faceVideo.width;
        var rescaledFaceVideoWidth = faceVideo.width * ratio;
        var rescaledFaceVideoHeight = faceVideo.height * ratio;
        ffmpeg()
            .input(videoFilePath)
            .complexFilter([
                {
                    filter: 'split', options: 2,
                    outputs: ['a', 'b']
                },
                {
                    filter: "crop", options: { w: mainVideo.width, h: mainVideo.height, x: mainVideo.x, y: mainVideo.y },
                    inputs: 'a', outputs: 'main'
                },
                {
                    filter: 'pad', options: `${mainVideo.width}:${padding}:0:${increasedPadding}`,
                    inputs: 'main', outputs: 'padded'
                },
                {
                    filter: "crop", options: { w: faceVideo.width, h: faceVideo.height, x: faceVideo.x, y: faceVideo.y },
                    inputs: 'b', outputs: 'tempface'
                },
                {
                    filter: "scale", options: { w: rescaledFaceVideoWidth - 1, h: rescaledFaceVideoHeight },
                    inputs: 'tempface', outputs: 'face'
                },
                {
                    filter: 'overlay', options: { x: template.gamerVideo.x, y: template.gamerVideo.y },
                    inputs: ['padded', 'face'], outputs: 'output'
                },

            ])

            .output(editedVideoPath + editedVideoName)
            .map('output')
            .on("error", function (er) {
                console.log("error occured: " + er.message);
            })
            .on('progress', ffmpegOnProgress(logProgress, durationEstimate))
            .on("end", function () {
                res.status(httpStatus.OK).json(editedVideoName);
                console.log("success");
            })
            .run();
    }
    if (template.name == "fullscreen") {
        ffmpeg()
            .input(videoFilePath)
            .complexFilter([
                {
                    filter: "crop", options: { w: mainVideo.width, h: mainVideo.height, x: mainVideo.x, y: mainVideo.y },
                    outputs: 'main'
                }
            ])

            .output(editedVideoPath + editedVideoName)
            .map('main')
            .on("error", function (er) {
                console.log("error occured: " + er.message);
            })
            .on('progress', ffmpegOnProgress(logProgress, durationEstimate))
            .on("end", function () {
                res.status(httpStatus.OK).json(editedVideoName);
                console.log("success");
            })
            .run();
    }
    if (template.name == 'smallfacecam' || template.name == 'square') {
        var widthRatio = mainVideo.width / faceVideo.width;
        var heightRatio = mainVideo.height / faceVideo.height;
        var rescaledFaceVideoWidth = faceVideo.width * widthRatio * template.gamerVideo.width;
        var rescaledFaceVideoHeight = faceVideo.height * heightRatio * template.gamerVideo.height;
        ffmpeg()
            .input(videoFilePath)
            .complexFilter([
                {
                    filter: 'split', options: 2,
                    outputs: ['a', 'b']
                },
                {
                    filter: "crop", options: { w: mainVideo.width, h: mainVideo.height, x: mainVideo.x, y: mainVideo.y },
                    inputs: 'a', outputs: 'main'
                },
                {
                    filter: "crop", options: { w: faceVideo.width, h: faceVideo.height, x: faceVideo.x, y: faceVideo.y },
                    inputs: 'b', outputs: 'tempface'
                },
                {
                    filter: "scale", options: { w: rescaledFaceVideoWidth, h: rescaledFaceVideoHeight },
                    inputs: 'tempface', outputs: 'face'
                },
                {
                    filter: 'overlay', options: { x: template.gamerVideo.x * mainVideo.width, y: template.gamerVideo.y * mainVideo.height },
                    inputs: ['main', 'face'], outputs: 'output'
                },

            ])

            .output(editedVideoPath + editedVideoName)
            .map('output')
            .on("error", function (er) {
                console.log("error occured: " + er.message);
            })
            .on('progress', ffmpegOnProgress(logProgress, durationEstimate))
            .on("end", function () {
                res.status(httpStatus.OK).json(editedVideoName);
                console.log("success");
            })
            .run();
    }

};
exports.twitch = async (req, res, next) => {
    const videoPath = path.join(__dirname + './../../public/videos/');

    const logProgress = (progress, event) => {

        // progress is a floating point number from 0 to 1
        console.log('progress', (progress * 100).toFixed());
        progressStatus = progress * 100;

    }

    // estimated duration of output in milliseconds
    const durationEstimate = 100

    const cmd = ffmpeg(videoPath + 'first.mp4')
        .output(videoPath + 'output.mp4')
        .on('progress', ffmpegOnProgress(logProgress, durationEstimate))
        .on('end', function () {
            console.log('sdfsdf')
        })
        .run()


};

exports.makeVideo = async (req, res, next) => {
    try {
        const videoPath = path.join(__dirname + './../../public/videos/');
        const editSpec = {
            outPath: videoPath + 'Editly.mp4',
            width: 600,
            height: 1000,
            // audioFilePath:videoPath+'output.mp3',
            fps: 10,
            allowRemoteRequests: true,
            clips: [
                {
                    layers: [
                        { type: 'video', path: videoPath + 'movie.mp4' },
                        { type: 'video', path: videoPath + 'movie.mp4', height: 0.3 },
                    ]
                },
            ],
        }
        await editly(editSpec)
            .catch(console.error);
        res.send('ok')
    } catch (error) {
        return next(error);
    }
};


exports.muteVideo = async (req, res, next) => {
    try {
        const videoPath = path.join(__dirname + './../../public/videos/');
        var url = videoPath + 'output.mp4';
        console.log(url)
        fs.exists(url, function (exists) {
            if (exists) {
                fs.unlink(url, function (err, data) {
                    if (!err)
                        console.log("Existing File Deleted . . . ");
                });
            }
        });

        ffmpeg('http://localhost:3000/videos/movie.mp4') //Input Video File
            .output(videoPath + 'mute-movie.mp4') // Output File
            .noAudio().videoCodec('copy')
            .on('end', function (err) {
                if (err)
                    console.log(err)
                else if (!err) {

                    console.log("Conversion Done");
                    res.send('Remove Audio is Done');

                }

            })
            .on('error', function (err) {
                console.log('error: ', +err);

            }).run();
    } catch (error) {
        return next(error);
    }
};


exports.removeVideo = async (req, res, next) => {
    try {
        const videoPath = path.join(__dirname + './../../public/videos/');
        var url = videoPath + 'output.mp3';
        fs.exists(url, function (exists) {
            if (exists) {
                fs.unlink(url, function (err, data) {
                    if (!err) {
                        console.log("Existing File Deleted . . . ");
                    }
                });
            }
        });
        ffmpeg(videoPath + 'input.mp4') // Input Video File
            .output(videoPath + 'output.mp3') // Output  File
            .on('end', function (err) {
                if (!err) {
                    console.log("Remove video is done");
                    res.send('Remove Video is Done');

                }

            })
            .on('error', function (err) {
                console.log('error: ' + err);
            }).run();
    } catch (error) {
        return next(error);
    }
};

exports.fb = async (req, res, next) => {
    const videoFilePath = req.body.videoFilePath
    const template = req.body.template
    const faceVideo = req.body.faceVideo
    const mainVideo = req.body.mainVideo


    try {
        const videoPath = path.join(__dirname + './../../public/videos/');

        function videoCropCenterFFmpeg(
            video,
            w,
            h,
            x,
            y,
            tempFile
        ) {
            return new Promise((res, rej) => {
                ffmpeg()
                    .input(video)
                    .videoFilters([
                        {
                            filter: "crop",
                            options: {
                                w,
                                h,
                                x,
                                y
                            },
                        },
                    ])
                    .output(tempFile)
                    .on("start", function (commandLine) {
                        console.log("Spawned FFmpeg with command: " + commandLine);
                        console.log("Start videoCropCenterFFmpeg:", video);
                    })
                    // .on("progress", function(progress) {
                    //   console.log(progress);
                    // })
                    .on("error", function (err) {
                        console.log("Problem performing ffmpeg function");
                        rej(err);
                    })
                    .on("end", function () {
                        console.log("End videoCropCenterFFmpeg:", tempFile);
                        res(tempFile);
                    })
                    .run();
            });
        }
        if (faceVideo) {
            var faceVideoPath = await videoCropCenterFFmpeg(
                videoFilePath,
                faceVideo.width,
                faceVideo.height,
                faceVideo.x,
                faceVideo.y,
                videoPath + 'faceOutput.mp4'
            );
        }


        var mainVideoPath = await videoCropCenterFFmpeg(
            videoFilePath,
            mainVideo.width,
            mainVideo.height,
            mainVideo.x,
            mainVideo.y,
            videoPath + 'mainOutput.mp4'
        );
        var layers = [];

        if (faceVideo) {
            layers = [
                {
                    type: 'video',
                    path: mainVideoPath,
                },

                {
                    type: 'video',
                    path: faceVideoPath,
                    width: template.gamerVideo.width,
                    height: template.gamerVideo.height,
                    position: {
                        x: template.gamerVideo.x,
                        y: template.gamerVideo.y
                    },
                },
            ]
        } else {
            layers = [
                { type: 'video', path: mainVideoPath },
            ]
        }
        const editedVideoPath = path.join(__dirname + './../../public/editedVideos/');
        const editedVideoName = Date.now() + 'Edited.mp4';

        const editSpec = {
            outPath: editedVideoPath + editedVideoName,
            width: template.mainVideo.width,
            height: template.mainVideo.height,
            // audioFilePath:videoPath+'output.mp3',
            fps: 2,
            allowRemoteRequests: true,
            keepSourceAudio: true,
            defaults: {
                layer: {
                    type: 'video', path: mainVideoPath
                }
            },
            clips: [
                { layers },
            ],
        }

        await editly(editSpec)
            .catch(console.error);

        res.status(httpStatus.OK).json(editedVideoName);

    } catch (error) {
        return next(error);
    }
};

exports.videoInfo = async (req, res, next) => {
    try {
        const videoPath = path.join(__dirname + './../../public/videos/');

        ffmpeg.ffprobe(videoPath + 'movie.mp4', function (err, metadata) {
            if (err) {
                console.log("MetaData not Found. " + err);
            } else {
                res.send(metadata);
            }
        });
    } catch (error) {
        return next(error);
    }
};