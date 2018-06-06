const knex = require('knex');
const dotenv = require('dotenv').config()

module.exports = function (app) {
    //   const { client, connection } = app.get('postgres');
    let client = 'pg'
    let connection = process.env.DATABASE_URL
    console.log('DB : ' + connection)

    const db = knex({ client, connection });

    app.set('knexClient', db);
};
