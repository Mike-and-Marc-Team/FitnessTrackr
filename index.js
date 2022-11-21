

const express = require('express');
const { client } = require('./db/index')
require('dotenv').config
const app = express();


client.connect();


app.listen(3000, () => {
    console.log('Ripping it up in port 3000');
})