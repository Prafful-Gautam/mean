const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const apiRouter = require('./router/apiRoutes');
const userRouter = require('./router/user');


const app = express();

mongoose.connect(
"mongodb+srv://Prafful:B83r2oxs7yJYkphT@cluster0-txvo9.mongodb.net/mean?retryWrites=true&w=majority",
{ useNewUrlParser: true,useCreateIndex: true, useUnifiedTopology:true, useFindAndModify: false })
    .then(() => {

        console.log('Connected to database');
    })
    .catch((err) => {
        console.log(err)
        console.log('Connection failed!');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); //optional
app.use('/images/', express.static(path.join('backend/images')));
app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept,Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PATCH,PUT,DELETE,OPTIONS"
    );
    next();
});

app.use("/app/posts",apiRouter);
app.use("/app/user", userRouter)

module.exports = app;