const router = require('express').Router();

const mysql = require('mysql').createConnection({
    host: process.env.dbhost,
    database: process.env.dbname,
    port: process.env.dbport,
    user: process.env.dbuser,
    password: process.env.dbpassword,
    charset: process.env.dbcharset
})

mysql.connect((err) => {
    if(err) throw err;
})




module.exports = router;