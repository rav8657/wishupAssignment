const express = require('express');
var bodyParser = require('body-parser');

const route = require('./routes/route.js');

const app = express();

app.use(bodyParser.json());


const mongoose = require("mongoose")

app.use('/', route);

mongoose.connect("mongodb+srv://sourav:project123@cluster0.hciw4.mongodb.net/wishUp",{useNewUrlParser : true})
    .then(() => console.log('mongodb Rock n Roll on 27017'))
    .catch(err => console.log(err))


app.listen(3000, function(){
    console.log('Express is running on port 3000')
})
