const express  = require('express');
const mongoose  = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const port  = process.env.port || 8080;
const route = require('./router/router')
const {dbStrng} = require('./config/config')

const app = express();

app.use(cors({}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/',route);

app.get('/hello', (req, res)=>{
    res.send('OK');
});

app.listen(port, ()=>{
    console.log('Express is up and running');
    let db = mongoose.connect(dbStrng, {useNewUrlParser:true});
});

mongoose.connection.on('error', (err)=>{
    console.error(err);
})

mongoose.connection.on('open', (err) => {
    if(err){
        console.error(err)
    }else{
        console.log('Mongoose connected successfully');
    }
})

module.exports = app;


