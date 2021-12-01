const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const {GridFsStorage} = require('multer-gridfs-storage');
require('dotenv').config();

const storage = new GridFsStorage({
    url: process.env.MONGODB_URL,
    // url: "mongodb+srv://ANI791:Prasad252791@cluster0.m8yqt.mongodb.net/fleaFair?retryWrites=true",
    // file:(req,file)=>{
    //     const match = ['image/png','image/jpeg','image/jpg'];
    //     if(match.indexOf(file.mimetype) === -1){
    //         const filename = `${Date.now()}-any-name-${file.originalname}`;
    //         return filename;
    //     }
    //     return {
    //         bucketName: 'profileImages',
    //         filename: `${Date.now()}-any-name-${file.originalname}`,
    //     }
    // }

    file: (req,file)=>{
        return new Promise((resolve,reject)=>{
            crypto.randomBytes(16,(err,buf)=>{
                if(err){
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'profileImages'
                };
                resolve(fileInfo);
            });
        });
    }
});

module.exports = multer({storage});