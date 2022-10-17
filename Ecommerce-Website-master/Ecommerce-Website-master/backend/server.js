const app = require("./app");

const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

//Handling Uncought Exception

process.on("uncaughtException",(err)=>{
    console.log(`Error ${err.message}`);
    console.log(`Shutting down the server due to Uncought Exception`);
    process.exit(1);
})

//config

dotenv.config({path:"backend/config/config.env"});

// Connectiong to database

connectDatabase()


const server =app.listen(process.env.PORT,()=>{
    console.log(`server is working on http://localhost: ${process.env.PORT}`)
})

// unhandled  promise Rejexctions

process.on("unhandledRejection",err=>{
    console.log(`error: ${err.message}`);
    console.log(`shutting down the serverdue to Unhandled Promise Rejection`);

    server.close(()=>{
        process.exit(1);
    });

});