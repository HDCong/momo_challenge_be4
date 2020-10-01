const Const = require('./constants.js');
async function add_user(user_name, db) {
	//const MongoClient = require('mongodb').MongoClient;
	try {
		//db = await MongoClient.connect(Const.DB_URL);

		const dbo = db.db(Const.DB_NAME);
		const user = {
			user_name: user_name,
			point: Const.INIT_POINT,
			turn: Const.INIT_TURN
		};
		console.log('add user')
		await dbo.collection(Const.COLLECTION_NAME).insertOne(user, (err, res) => {
			if (err) throw err;
			else {
				// console.log(res)
				// console.log('insert complete', res.ops[0])
				return user
			}
		});
		return user
	}
	catch (err) {
		console.log(err);
	}
}
async function get_top_users(n, db) {
	//const MongoClient = require('mongodb').MongoClient;

	try {
		//db = await MongoClient.connect(Const.DB_URL);
		const dbo = db.db(Const.DB_NAME);
		const sort_criteria = { point: -1 }; // sort descending

		return await dbo.collection(Const.COLLECTION_NAME).find().sort(sort_criteria).limit(n).toArray();
	}
	catch (err) {
		console.log(err);
	}
}
const { ObjectID } = require('bson');

function update_user(user_id, point, turn, db) {
	try {
		// db = await MongoClient.connect(Const.DB_URL);

		const dbo = db.db(Const.DB_NAME);
		user_id = ObjectID(user_id);
		const query = { _id: user_id };
		const new_values = { $set: { point: point, turn: turn } };

		dbo.collection(Const.COLLECTION_NAME).updateOne(query, new_values);
	}
	catch (err) {
		console.log(err);
	}
}
function update_winner(user_id, db) {
	try {
		// db = await MongoClient.connect(Const.DB_URL);

		const dbo = db.db(Const.DB_NAME);
		user_id = ObjectID(user_id);
		const query = { _id: user_id };
		const new_values = { $inc: { point: 3, turn: -1 } };

		dbo.collection(Const.COLLECTION_NAME).updateOne(query, new_values);
	}
	catch (err) {
		console.log(err);
	}
}
function update_loser(user_id, db) {
	try {
		// db = await MongoClient.connect(Const.DB_URL);

		const dbo = db.db(Const.DB_NAME);
		user_id = ObjectID(user_id);
		const query = { _id: user_id };
		const new_values = { $inc: { point: 0, turn: -1 } };

		dbo.collection(Const.COLLECTION_NAME).updateOne(query, new_values);
	}
	catch (err) {
		console.log(err);
	}
}
module.exports = {
	add_user,
	get_top_users,
	update_user,
	update_loser,
	update_winner
};