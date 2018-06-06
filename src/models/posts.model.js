/* eslint-disable no-console */

// posts-model.js - A KnexJS
// 
// See http://knexjs.org/
// for more of what you can do here.
module.exports = function (app) {
    const db = app.get('knexClient');
    const tableName = 'posts';
    db.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            db.schema.createTable(tableName, table => {
                table.increments('id');
                table.string('title');
                table.string('content');
                table.string('link');
                table.integer('author_id');
            })
                .then(() => console.log(`Created ${tableName} table`))
                .catch(e => console.error(`Error creating ${tableName} table`, e));
        }
    });


    return db;
};
