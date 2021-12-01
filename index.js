const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
require('dotenv').config();
const connection = require('./db');

// const connection = mongoose.connection;

const app = express();
const Port = process.env.PORT || 3000;

// Init gfs
let gfs;

connection();
mongoose.Promise = global.Promise;

const conn = mongoose.connection;
conn.once("open",function(){
    gfs = Grid(conn.db,mongoose.mongo);
    gfs.collection("profileImages");
})

// Body Parser
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/user',require('./routes/users'));
app.get('/',(req,res)=>{
    res.send({
        "message":"Hello From Flea Fair"
    });
})
app.get('/files',(req,res)=>{
    gfs.files.find().toArray((err,files)=>{
        // if(!files || files.length === 0){
        //     return res.status(404).send({
        //         error: "No files exists",
        //     });
        // }
        return res.json(files);
    });
});

app.get('/file/:filename',async (req,res)=>{
    try {
        gfs.files.find({filename: req.params.filename})
        .toArray((err,files)=>{
            if(!files[0] || files.length === 0){
                return res.status(200).json({
                    success: false,
                    message: "No files available",
                });
            }
            if(files[0].contentType === 'image/jpeg'
                || files[0].contentType === 'image/png'
                || files[0].contentType === 'image/jpg'){
                    
                    gfs.openDownloadStreamByName(files[0].filename).pipe(res);

            }else{
                res.status(404).json({
                    err:'Not an image',
                });
            }
        });

    } catch (error) {
        res.send({
            error: error.message,
        });
        console.log(error);
    }
});

try{
    app.listen(Port,()=>{
        console.log(`Your Server is running on Port ${Port}`);
    });
}catch(e){
    console.log(e);
}
