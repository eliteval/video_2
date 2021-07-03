const AWS = require('aws-sdk');
const { awsConfig } = require('../../../config/vars');

const s3 = new AWS.S3({
  accessKeyId: awsConfig.aws_api_id,
  secretAccessKey: awsConfig.aws_api_secret,
  region: awsConfig.region,
});

exports.uploadFile = async (folder, name, fileContent, metadata , result) => {
  console.log('result')
  console.log(result)
  const params = {
    Bucket: awsConfig.bucket,
    Key: folder + "/" + name,
    Body: fileContent,
    ACL: 'public-read'
  };
  if(metadata["ContentEncoding"]){
    params["ContentEncoding"] = params["ContentEncoding"];
  }
  if(metadata["ContentType"]){
    params["ContentType"] = params["ContentType"];
  }
  s3.upload(params, result);
};

exports.getFile = async (folder, name , result) => {
  const params = {
    Bucket: awsConfig.bucket,
    Key: folder + "/" + name
  };
  s3.getObject(params, result);
};

exports.deleteFile = async (folder, name , result) => {
  const params = {
    Bucket: awsConfig.bucket,
    Key: folder + "/" + name
  };
  s3.deleteObject(params, result);
};


exports.uploadPost = async () => {

};