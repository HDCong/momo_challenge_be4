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
        let roomInformation = findRoomAvailable()
        // if have available room    
        if (roomInformation != null) {
            // update number of player of room
            console.log('found room')
            console.log(roomInformation)
            socket.join(roomInformation.roomID)
            roomInformation[socket.id] = 0
            io.to(roomInformation.roomID).emit('join-complete', '2')
            console.log(socket.rooms)
        }
        else {        // If cannot find any available room
            roomID = `room${countIdRoom++}`
            console.log('roomid is null')
            socket.join(roomID)
            let newRoom = {
                "roomid": socket.rooms[0]
            }
            newRoom[socket.id] = 0
            ListRooms.push(newRoom)
            io.to(roomID).emit('join-complete', '1')
            console.log(socket.rooms)
        }
    })
    // in game handle
    // user emit chosen, compare and return point for user
    socket.on('result', (userChosen) => {
        // userid, and chosen 
        // compare
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
    console.log('find room function')
    for (var room in ListRooms)
        if (Object.keys(room).length < 3)
            return room;
    return null
}

app.get('/', (req, res) => {
    console.log('get request')
    console.log(ListRooms)
    res.json(
        'Backend BE4'
    )
});


http.listen(PORT, () => {
    console.log(`listening on: ${PORT}`);
});
