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
app.use('/product',require('./routes/products'));
app.get('/',(req,res)=>{
    res.send({
        "message":"Hello From Flea Fair"
    });
})

try{
    app.listen(Port,()=>{
        console.log(`Server is running on Port ${Port}`);
    });
}catch(e){
    console.log(e);
}
