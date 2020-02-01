console.log('Server-side code running');

const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();

// serve files from the public directory
app.use(express.static('public'));

// connect to the db and start the express server
let db;

const CONNECTION_URL = "mongodb+srv://db_user:sql1server2@cluster0-hdvws.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "rich_db";

MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
  if(error) {
      throw error;
  }
  database = client.db(DATABASE_NAME);
  
  console.log("Connected to `" + DATABASE_NAME + "`!");

  db = database;

  // start the express web server listening on 
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on ' , process.env.PORT || 3000);
  });


});

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// add a document to the DB collection recording the click event
app.post('/clicked', (req, res) => {
  const click = {clickTime: new Date()};
  console.log(click);
  console.log(db);

  db.collection('clicks').save(click, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log('click added to db');
    res.sendStatus(201);
  });
});

// get the click data from the database
app.get('/clicks', (req, res) => {
  db.collection('clicks').find().toArray((err, result) => {
    if (err) return console.log(err);
    res.send(result);
  });
});