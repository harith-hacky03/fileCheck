const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

const sql = mysql.createConnection({
    host: 'mys.cjkowvxrkmpy.eu-north-1.rds.amazonaws.com',
    user: 'admin',
    password: 'admin123',
    database: 'gram',
    port: '3306'
});

sql.connect(err => {
    if (err) {
        console.log('connect error');
        console.log(err);
    }
    console.log('Database Connected');
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Use a unique identifier as the filename to prevent conflicts
        const uniqueIdentifier = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueIdentifier + '.' + file.originalname.split('.').pop());
    }
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single('profile'), (req, res) => {
    try {
        const { originalname, filename, path } = req.file;

        // Insert file details into the database
        const sql_query = `INSERT INTO user_auth (user_name, user_pass, profile_pic) VALUES (?, ?, ?)`;
        const values = ['Ha', 'jj', path];

        sql.query(sql_query, values, (err, data) => {
            if (err) {
                console.error('Error inserting file details into the database:', err);
                res.status(500).send('Error inserting file details into the database');
            } else {
                console.log('File details successfully inserted into the database');
                res.send('File successfully uploaded and details inserted into the database.');
            }
        });
    } catch (error) {
        console.error('Error handling file upload:', error);
        res.status(500).send('Error handling file upload');
    }
});

app.listen(8000, () => console.log('Server Started'));
