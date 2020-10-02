var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const PORT = 8888
var url = 'mongodb://localhost:27017';
const e = require('express');
var mongodb = require('mongodb');
const { update_loser, update_winner } = require('./db/dbController');
var MongoClient = mongodb.MongoClient
var dbController = require('./db/dbController')
var helper = require('./helper/get_match_result')
var dbConn;

var ListRooms = []
var mappingSocketAndID = []
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

    dbController.get_top_users(100, dbConn).then((result) => {
        socket.emit('top100', result)
    }).catch((err) => {
        throw new Error(err)
    })
    socket.on('get-update-user', () => {
        let userId = findIDBySocket(socket.id)
        console.log(userId)
        let users
        dbController.find_by_id(userId, dbConn).then((result) => {
            console.log(result)
            users = result
            socket.emit('user-details', users)

        }).catch((err) => { throw new Error(err) })
    })
    socket.on('getTop', () => {
        dbController.get_top_users(100, dbConn).then((result) => {
            socket.emit('top100', result)
        }).catch((err) => {
            throw new Error(err)
        })
    })
    // handle when user emit login
    socket.on('login', (username) => {
        // insert to mongodb
        // after insert emit to client
        console.log('user emit login: ' + username.toString());
        dbController.add_user(username, dbConn).then((result) => {
            socket.emit('user-details', result)
            var userId = result["_id"]
            let obj = {}
            obj[userId] = socket.id
            mappingSocketAndID.push({
                obj
            })
        }).catch((err) => {
            throw new Error(err)
        })

    })

    // when user emit find match
    // find available room, if not exist, create join this user in new room 
    // emit back to client state: 1 (mean to wait) or 0 (mean to play)
    socket.on('find-match', () => {
        // find available room in list room
        let userId = findIDBySocket(socket.id)
        console.log(userId)
        let users
        dbController.find_by_id(userId, dbConn).then((result) => {
            console.log(result)
            if (result["turn"] > 0) {
                console.log('is available turn')
                var roomIndex = findRoomAvailable()
                // if have available room    
                if (roomIndex >= 0) {
                    // update number of player of room
                    roomInformation = ListRooms[roomIndex]
                    console.log(roomInformation)
                    socket.join(roomInformation.roomID)
                    socket.join(roomInformation.roomID)
                    console.log('>=0', socket.rooms)
                    var rooms = Object.keys(io.sockets.adapter.sids[socket.id]);
                    console.log('user rooms: ', rooms)
                    let player2 = {
                        "score": 0,
                        "currentChoice": null,
                    }
                    roomInformation[socket.id] = player2
                    io.to(roomInformation.roomID).emit('join-complete', '2')
                }
                else {        // If cannot find any available room
                    roomID = `room${countIdRoom++}`
                    console.log('roomid is null')
                    socket.join(roomID)
                    socket.join(roomID)
                    console.log('<0', socket.rooms)

                    var rooms = Object.keys(io.sockets.adapter.sids[socket.id]);
                    console.log('user rooms: ', rooms)
                    let newRoom = {
                        "roomID": rooms[1],
                        round: 1,
                    }
                    let player1 = {
                        "score": 0,
                        "currentChoice": null,
                    }
                    newRoom[socket.id] = player1
                    console.log('new room nek', newRoom)
                    ListRooms.push(newRoom)
                    io.to(roomID).emit('join-complete', '1')
                }
            }
        }).catch((err) => { throw new Error(err) })

    })

    // in game handle
    // user emit chosen, compare and return point for user
    socket.on('result', (userChosen) => {
        let rooms = Object.keys(io.sockets.adapter.sids[socket.id]);
        let room = findRoomByRoomID(rooms[1])
        if (room == null || room["round"] > 3) return
        console.log('result', userChosen, 'round: ', room["round"]);
        let listAttributes = getListAttributes(room);
        let competitor = findCompetitorSocket(socket.id, listAttributes)
        room[socket.id]["currentChoice"] = userChosen
        console.log(room)
        if (competitor != null && room[competitor]["currentChoice"] != null) {
            let result = helper.get_match_result(room[listAttributes[2]]["currentChoice"]
                , (room[listAttributes[3]]["currentChoice"]))
            if (result < 0) { // A win 
                room[listAttributes[2]]["score"] += 3
            } else if (result > 0) { // B win
                room[listAttributes[3]]["score"] += 3
            }
            let obj = []
            obj.push(room[listAttributes[2]])
            obj.push(room[listAttributes[3]])
            obj.push(result)
            io.to(room["roomID"]).emit('update-score', obj)
            // socket.emit('update-score', obj)
            room["round"] += 1
            room[listAttributes[2]]["currentChoice"] = null;
            room[listAttributes[3]]["currentChoice"] = null;
        }

        if (room["round"] == 4) { // end game
            console.log('update diem so');

            let listAttr = listAttributes
            // compare attribute1 and attribute2
            var score1 = room[listAttr[2]]["score"]
            var score2 = room[listAttr[3]]["score"]
            let idWinner
            let idLoser
            console.log(score1, score2)
            if (score1 > score2) {
                console.log('vao 1')
                // update for user attribute1
                idWinner = findIDBySocket(listAttr[2])
                idLoser = findIDBySocket(listAttr[3])
            } else if (score1 < score2) {
                console.log('vao 2')
                // update for user attribute2
                idWinner = findIDBySocket(listAttr[3])
                idLoser = findIDBySocket(listAttr[2])
            }
            else {
                console.log('vao 3')
                idWinner = findIDBySocket(listAttr[2])
                idLoser = findIDBySocket(listAttr[3])
                update_loser(idLoser, dbConn).then(
                update_loser(idWinner, dbConn).then((res)=>{
                    console.log(res)
                }))

            }
            if (idWinner != undefined && idLoser != undefined) {
                update_loser(idLoser, dbConn).then(
                    update_winner(idWinner, dbConn).then((res)=>{
                        console.log(res);
                    })
                )
            }
            io.to(rooms[1]).emit('end-game')
            io.of('/').in(rooms[1]).clients((error, socketIds) => {
                if (error) throw error;
                socketIds.forEach(socketId => io.sockets.sockets[socketId].leave(rooms[1]));
            });
        }
    })
    socket.on('disconnect', () => {
        console.log(`User with id ${socket.id} disconnected`)
    })
});
function findCompetitorSocket(mySocket, listAts) {
    if (listAts[2] == mySocket) return listAts[3]
    return listAts[2]
}
function getListAttributes(obj) {
    res = []
    for (att in obj)
        res.push(att)
    return res
}
function findRoomAvailable() {

    var idx = -1
    for (let i = 0; i < ListRooms.length; i++) {
        let item = ListRooms[i]
        if (Object.keys(item).length < 4 && item["round"] < 3) {
            idx = i;
            break;
        }
    }
    return idx
}
function findRoomByRoomID(roomId) {
    for (let i = 0; i < ListRooms.length; i++) {
        let item = ListRooms[i]
        if (item.roomID == roomId)
            return item
    }
    return null
}

function findIDBySocket(value) {
    for (let i = 0; i < mappingSocketAndID.length; i++) {
        let item = mappingSocketAndID[i]
        for (attrs in item) {
            for (at in item[attrs]) {
                if (item[attrs][at] == value)
                    return at
            }
        }
    }
    return null

}

app.get('/', (req, res) => {
    res.json(
        ListRooms)
});


http.listen(PORT, () => {
    console.log(`listening on: ${PORT}`);
});
