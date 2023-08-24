"use strict"
require('dotenv').config();
const express = require('express');
const app = express();
const cookies = require('cookies');
const fs = require('fs');
const cors = require('cors');


var port = process.env.PORT || 3000;
const file_upload = require('express-fileupload');
const bodyParser = require('body-parser');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors({
    credentials:true
}))
app.use(file_upload());
app.use("/res", express.static((__dirname+'/views/res')));
app.set('views', __dirname+'/views');
app.set('view engine','ejs');
app.engine('ejs', require('ejs').__express);
app.use(cookies.express("a","b","c"));
app.use('/api', require('./api'));

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/dashboard', (req, res) => {
    res.render('dashboard');
})

app.get('*',(req,res)=>{

    res.render('404');

})
app.listen(port,"0.0.0.0",()=>{
    console.log(`Server live on port ${port}`);
})