- This is Wei-Ru Lin's Backend Assessment Project
In this project, I use Node.js, Express, and PostgreSQL. 
The package I use is body-express, cors, dotenv, express, pg, jest, supertest

The configuration to connection to PostgreSQL in db.js. 
    - database is 'postgres'
    - user is 'postgres'
    - password is 'mercury'
I define the modules in app.js

Most logic and function I implment in controller.js.
    get function (GET)      -> check the table exists or not -> no -> create a new table
                            -> get from id

    create function (POST)  -> check the table exists or not -> no -> create a new table
                            -> check each columns exists in this table or not -> no -> add column
                            -> check if the data exists in the table 
                            -> no -> insert the data to the table
    
    update function (POST)  -> check if the data exists in the table or not
                            -> yes -> do update  
    
    deleteItem function (DELETE)    -> check if the data exists in the table or not
                                    -> yes -> do delete

I implement the check is there any existence of the tables in get and create function. 
I implement add/create columns if not detected in create function.

I use PostgreSQL as database, pgAdmin 4 as management tool 

I use supertest, jest to implement unit test

To start the server, open terminal, cd to project folder, type 'npm run devstart'
I use Postman to send get, post, delete request and get response from server to check my operation is correct. 

Consider to run in a concurrent environment, I use async and await to handle running in concurrent environment. 
