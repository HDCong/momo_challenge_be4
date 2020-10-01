var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const PORT = 8888

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient
// base url to database
var url = 'mongodb://localhost:27017/be4';
// Connect to mongodb
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
    
    // handle when user emit login
    socket.on('login', (username) => {

    })

    // when user emit find match
    // find available room, if not exist, create join this user in new room 
    socket.on('find-match',()=>{

    })

    // in game handle
    // user emit chosen, compare and return point for user
    socket.on('result',(chosen)=>{
        console.log(chosen);
    })

    // return 100 highest user
    socket.on('getRanking',()=>{

    })
    
});

http.listen(PORT, () => {
    console.log(`listening on: ${PORT}`);
});
