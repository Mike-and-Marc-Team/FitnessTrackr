const client = require('./index');
const { rebuildDB } = require('./seedData');
const { testDB } = require('./seedData')
rebuildDB()
.then(testDB)
  .catch(console.error)
  .finally(() => client.end());