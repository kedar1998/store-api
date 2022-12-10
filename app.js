require('dotenv').config();

const express = require('express');
const app = express();

const notFoundMiddleware = require('./middleware/not-found');
const connectDB = require('./db/connect');
const productsRouter = require('./routes/products')


// Middleware
app.use(express.json());


// Routes
app.use("/api/v1/products", productsRouter)

app.use(notFoundMiddleware)



const start = async () =>{
    try{
        await connectDB(process.env.DATABASE)

        app.listen(process.env.PORT, async () =>{
            console.log("Running on 3000");
        })
    }
     catch (err){
        console.log(err);
     }
}

start()