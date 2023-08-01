var express = require('express'),
    app = express(),
    dotEnv = require('dotenv'),
    cors = require('cors'),
    bodyParser = require('body-parser');


dotEnv.config();
app.use(cors());
app.use(bodyParser.json());



module.exports = app;