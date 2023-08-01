// Start Server
const app = require('./app');
const pool = require('./db');
app.listen(8080, () => console.log('Successfully listen on port 8080'));


const controller = require("./src/controller");


async function middleware(req, res, next){
    // we can use middleware to implement some function e.g. authentication ...
}

app.post("/:collection",  controller.create);
app.get("/:collection/:id",  controller.get);
app.post("/:collection/:id", controller.update);
app.delete("/:collection/:id",  controller.deleteItem);




