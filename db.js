const Pool = require('pg').Pool;

const pool = new Pool({
    host: 'localhost',
    database: 'postgres',
    user: 'postgres',
    password: 'mercury',
    port: 5432,
});

module.exports = pool;