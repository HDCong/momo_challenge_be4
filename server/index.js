var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const PORT = 8888
var url = 'mongodb://localhost:27017';
const e = require('express');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient
var dbController = require('./db/dbController')

var dbConn;

var ListRooms = []
var countIdRoom = 0

// base url to database
// Connect to mongodb
MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        console.log('Connection established to', url);
        dbConn = db
    }
});

io.on('connection', (socket) => {
    console.log(`user with id ${socket.id} connected`);

    console.log('get top 100 ');
    dbController.get_top_users(100, dbConn).then((result) => {
        socket.emit('top100', result)
        console.log('get the result')
        console.log(result.length)
    }).catch((err) => {
        throw new Error(err)
    })
    
    // handle when user emit login
    socket.on('login', (username) => {
        // insert to mongodb
        // after insert emit to client
        console.log('user emit login: ' + username.toString());
        dbController.add_user(username, dbConn).then((result) => {
            socket.emit('user-details', result)
            console.log(result)
        }).catch((err) => {
            throw new Error(err)
        })
    })


    // when user emit find match
    // find available room, if not exist, create join this user in new room 
    // emit back to client state: 1 (mean to wait) or 0 (mean to play)
    socket.on('find-match', () => {
        // find available room in list room
        let roomID = findRoomAvailable()
        // if have available room    
        if (roomID != null) {
            // update number of player of room
            ListRooms[roomID] = 2
            socket.join(roomID)
            io.to(roomID).emit('0')
        }
        // If cannot find any available room
        else {
            roomID = `room${countIdRoom++}`
            ListRooms[roomID] = 1
            socket.join(roomID)
            io.to(roomID).emit('1')
        }
    })


    // in game handle
    // user emit chosen, compare and return point for user
    socket.on('result', (userChosen) => {
        // userid,roomid, and chosen 
        // then update 
        console.log(chosen);
    })

    // when over
    // update point after the match
    socket.on('end-game', (point) => {

    })

    // handle when user close connect
    socket.on('disconnect', () => {
        console.log(`User with id ${socket.id} disconnected`)
    })

});
function findRoomAvailable() {
    for (var key in ListRooms)
        if (ListRooms[key] < 2)
            return key;
    return null
}
app.get('/', (req, res) => {
    console.log('get request')
    res.json(
        'Backend BE4'
    )
});


http.listen(PORT, () => {
    console.log(`listening on: ${PORT}`);
});
