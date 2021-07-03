const fs=require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { google } = require('googleapis');

/**
 * Browse the link below to see the complete object returned for folder/file creation and search
 *
 * @link https://developers.google.com/drive/api/v3/reference/files#resource
 */



class GoogleDriveService {
  constructor(client) {
    this.driveClient = this.createDriveClient(client);
    console.log('this.driveClient')
    console.log(this.driveClient)
  }

  createDriveClient(client) {

    return google.drive({
      version: 'v3',
      auth: client,
    });
  }

  createFolder(folderName) {
    return this.driveClient.files.create({
      resource: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id, name',
    });
  }

  searchFolder(folderName){
    return new Promise((resolve, reject) => {
      this.driveClient.files.list(
        {
          q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
          fields: 'files(id, name)',
        },
        (err, res) => {
          if (err) {
            return reject(err);
          }

          return resolve(res.data.files ? res.data.files[0] : null);
        },
      );
    });
  }

  saveFile(fileName, filePath, fileMimeType, folderId) {
    return this.driveClient.files.create({
      requestBody: {
        name: fileName,
        mimeType: fileMimeType,
        parents: folderId ? [folderId] : [],
      },
      media: {
        mimeType: fileMimeType,
        body: fs.createReadStream(filePath),
      },
    });
  }
}

module.exports = GoogleDriveService;