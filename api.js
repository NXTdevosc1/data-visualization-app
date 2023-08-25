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


router.get('/api/auth', (req, res) => {
    res.render("topbar");
})

router.post('/api/upload', (req, res) => {
    const accid = req.cookies.get('accid');
    if(typeof req.body.displayname != 'string' ||
    req.body.displayname.length > 60 ||
    !req.files || !req.files.content || typeof accid != "string"
    ) return res.send('Unauthorized');
    
    const file = req.files.content;

    let type;
    if(file.name.endsWith('.csv')) {
        type = 0;
    } else if(file.name.endsWith('.json')) {
        type = 1;
    } else {
        return res.send("Invalid file type.");
    }

    const displayname = req.body.displayname;
    mysql.query('INSERT INTO data (account_id, type, displayname) VALUES(?, ?, ?)', [accid, type, displayname], (err, result) => {
        if(err) throw err;
        console.log("insert id", result.insertId);
        file.mv(`./uploads/${result.insertId}`, (err) => {
            if(err) throw err;

            res.redirect('/dashboard');
        })
    });

})

/**
 * 
 * @param {Request} req 
 */
function CheckPostHeader(req, res) {
    if(req.get('content-type') != 'application/json') {
        res.status(401);
        res.send("Invalid headers");
    }
}

const fs = require('fs');

router.post("/api/open", (req, res) => {
    CheckPostHeader(req, res);
    const accid = req.cookies.get("accid");
    const fileid = req.body.fileid;
    if(typeof fileid != 'number' || typeof accid != 'string') {
        res.status(401);
        return res.send("401");
    }

    mysql.query("SELECT * FROM data WHERE ID=? LIMIT 1", [fileid], (err, [result]) => {
        if(result.account_id != accid) {
            res.status(401);
            return res.send('401');
        }
        console.log(result);
        res.json({settings: result, file: fs.readFileSync(`./uploads/${result.ID}`).toString()});
    })
})

router.get('/dashboard', (req, res) => {
    if(typeof req.cookies.get('accid') != 'string') return res.redirect('/disconnect');

    mysql.query("SELECT * FROM data WHERE account_id=?", [req.cookies.get("accid")], (err, result) => {
        if(err) throw err;
        console.log(result);        
        res.render('dashboard', {
            files: result
        });

    })

})

module.exports = router;