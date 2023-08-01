const pool = require('../db');
const queries = require('./controller')

const get = async function(request, response){
    const params = request.params;
    const collection = params.collection;
    const id = parseInt(params.id);

    checkThenCreateTable(collection)

    setTimeout(()=>{
        (async function(collection, id){
            const statement = `SELECT * FROM ${collection} WHERE id = ${id}`;
            var result = await pool.query(statement, (err, res)=>{
                if(err) throw err
                else if(!res.rows.length){
                    response.status(404)
                    response.send(`The item does not exist in ${collection} table`);
                    
                }
                else{
                    console.log(`Success to get id = ${id}`);
                    response.status(200).json(res.rows);
                }
            })
        })(collection, id);
    }, 100);
}

async function checkThenCreateTable(collection){
    setTimeout(()=>{
        (async function(collection){
            const statement = `
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_name = '${collection}'
            );
            `
            var result = await pool.query(statement, (err, res)=>{
                if(err) throw err;
                else{
                    // table exists
                    if(res.rows[0].exists) console.log(`The ${collection} table exists in database`);
                    // not
                    else{
                        // Create new Table
                        const statement2 = `CREATE TABLE ${collection} (
                            id SERIAL PRIMARY KEY
                            );`

                        pool.query(statement2, (err, res)=>{
                            if(err) throw err;
                            else console.log('Successfully create');
                        })
                    }
                }
            })
        })(collection);
    }, 0);
}



const create = async function(request, response) { 
    const body = request.body
    const params = request.params;
    const collection = params.collection;

    const keys = Object.keys(body)
    // check and create table
    checkThenCreateTable(collection);

    // create columns for the table
    checkThenCreateColumns4Table(collection, body);

    (async function(collection, keys, body){
        var statement = `SELECT * FROM ${collection}`;
        var s = '';
        for(let i = 0; i<keys.length; i++){
            let key = keys[i];
            s+=key + " = "; 
            if(Number.isInteger(body[key])) s+=body[key]
            else s+=`'${body[key]}'`;
            if(i!=keys.length-1) s+=' and ';
        }
        statement += ' WHERE ' + s;
        console.log(statement);
        var result = await pool.query(statement, (err, res)=>{
            console.log(res);
            if(err) throw err
            else if(res.rowCount){
                console.log(`Please do not add existed item in ${collection} database`);
                response.send(`Please do not add existed item in ${collection} database`);
            }
            else{
                // start to create
                var statement = `INSERT INTO ${collection} (`;
                for(let i = 0; i<keys.length; i++){
                    let key = keys[i];
                    statement+=key
                    if(i!=keys.length-1) statement+=',';
                }
                statement += ') VALUES (';
                for(let i = 0; i<keys.length; i++){
                    let key = keys[i];
                    if(Number.isInteger(body[key])) statement+=body[key]
                    else statement+=`'${body[key]}'`;
                    if(i!=keys.length-1) statement+=',';
                }
                statement += ')';
    
                console.log(statement);
                pool.query(statement, (err, res) => {
                    if (err) throw err
                    else response.status(201).send(`Success created`);
                })
            }
        })    
    })(collection, keys, body);
}


async function checkThenCreateColumns4Table(collection, body){
        const keys = Object.keys(body);
        for(let key of keys){
            setTimeout(function(){
                var statement = `SELECT COLUMN_NAME 
                    FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE 
                    TABLE_NAME = '${collection}' 
                    AND COLUMN_NAME='${key}'`;
        
                console.log(statement);
                pool.query(statement, (err, res)=>{
                    if(err) throw err;
                    if(res.rowCount) console.log(`${key} exist in this table`);
                    else{
                        var statement = `ALTER TABLE ${collection} `
                        if(Number.isInteger(body[key])) statement += `ADD COLUMN ${key} INTEGER;`;
                        else if(!!(body[key] % 1)) statement += `ADD COLUMN ${key} FLOAT;`;
                        else statement += `ADD COLUMN ${key} VARCHAR;`;
                        pool.query(statement, (err, res)=>{
                            console.log(statement);
                            if(err) throw err;
                            else console.log(`Success to add new column -> ${key}`);    
                        })
                    }
                })
            }, 0);
        }
}



const update = async function(request, response){
    const params = request.params;
    const collection = params.collection
    const id = parseInt(params.id);
    const body = request.body;
    
    const keys = Object.keys(body)

    
    var statement = `UPDATE ${params.collection} SET `;
    for(let i = 0; i<keys.length; i++){
        let key = keys[i];
        statement+=key + " = "; 
        if(Number.isInteger(body[key])) statement+=body[key]
        else statement+=`'${body[key]}'`;
        if(i!=keys.length-1) statement+=', ';
    }

    statement += ` WHERE id = ${id}`;
    console.log(statement);
    const result = await pool.query(statement, (err, res) => {
        console.log(res);
        if (err) throw err
        else if(res.rowCount === 0)response.send(`The item with id=${id} does not exist in ${collection} database`);
        else response.status(201).send(`Successfully update id=${id} in ${collection} database`);
    })
}



const deleteItem = async function(request, response){
    const params = request.params;
    const id = parseInt(params.id);
    const collection = params.collection
    
    const statement = `DELETE FROM ${params.collection} WHERE id = ${params.id}`;
    const result = await pool.query(statement, (err, res)=>{
        if (err) throw err;
        else if(!res.rowCount) response.send(`The item with id=${id} does not exist in ${collection} database`);
        else response.status(200).send(`Successfully delete id = ${id} in ${collection} database`);
    })

}


module.exports = {
    get,
    create,
    update,
    deleteItem,
}

