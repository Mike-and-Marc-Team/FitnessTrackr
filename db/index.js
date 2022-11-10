//pg.client go here

//1: Import pg
const pg = require('pg');

//2: Make a new pg.client instance
const client = new pg.Client(`postgres://localhost:5432/fitness-dev`);

//3: Export the db client
module.exports = {
    client
}