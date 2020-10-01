const Const = require('./constants.js');
const { ObjectID } = require('bson');

function update_user(user_id, point, turn) {
	const MongoClient = require('mongodb').MongoClient;

	MongoClient.connect(Const.DB_URL, (err, db) => {
		if (err) throw err;

		const dbo = db.db(Const.DB_NAME);
		user_id = ObjectID(user_id);
		const query = { _id: user_id };
		const new_values = { $set: {point: point, turn: turn } };

		dbo.collection(Const.COLLECTION_NAME).updateOne(query, new_values, (err, res) => {
			if (err) throw err;
			db.close();
		});
	});
}

module.exports = {
	update_user
};