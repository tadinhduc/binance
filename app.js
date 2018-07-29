const express = require('express');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const apiTrades = require('./api/api.trades');
const app = express();

// //connection to mongodb local
mongoose.connect('mongodb://ductd3:abc12345@ds147181.mlab.com:47181/binancedata');
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error',console.error.bind(console,'error connection'));
db.once('open',()=>{
  console.log('Connection MongoDB Server!');
})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use('/api/v1',apiTrades);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});