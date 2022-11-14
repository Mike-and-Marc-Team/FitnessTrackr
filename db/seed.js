const { client } = require('./index')

const { 
    createUser,
    getUser,
    getUserByUsername 
} = require('./users');

async function dropTables() {
    try {
        console.log("Dropping tables...")
        await client.query(`
        DROP TABLE IF EXISTS users;
        `);
        console.log("Finished dropping tables!")
    } catch (error) {
        console.log(error)
    }
}

async function createTables() {
    try {
        console.log("Creating tables...")
        await client.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )`);
        console.log("Finished creating tables!")
    } catch (error) {
        console.log(error)
    }
}

async function rebuildDB(){
    try {
        client.connect();
        await dropTables();
        await createTables();

    } catch (error) {
        console.log("Error during buildDB")
        throw error
    }
}

async function testDB(){
    try {
        console.log("Starting to test database...")
        console.log("Calling username...")
        const users = await getUser();
        console.log("Result:", users)
    } catch (error) {
        throw error
    }
}


rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end())