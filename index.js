var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const PORT = 8888
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient

var url = 'mongodb://localhost:27017/be4';

MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);
    db.close();
  }
});

app.get('/', (req, res) => {
    console.log('get request')
    res.json(
        'Backend BE4'
    )
});

io.on('connection', (socket) => {
  console.log(`user with id ${socket.id} connected`);

});

http.listen(PORT, () => {
  console.log(`listening on: ${PORT}`);
});
