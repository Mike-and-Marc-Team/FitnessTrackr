//boutta rip this shit cuz

const express = require('express');
const { client } = require('./db/index')
// setting up this express shit
const app = express();

// connect this too, or else
client.connect();

// Set up the damn port so it listens to the server
app.listen(3000, () => {
    console.log('Ripping it up in port 3000');
})