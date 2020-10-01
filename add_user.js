const Const = require('./constants.js');

function add_user(user_name) { // TODO: how to return the _id?
	const MongoClient = require('mongodb').MongoClient;

	MongoClient.connect(Const.DB_URL, (err, db) => {
		if (err) throw err;

		const dbo = db.db(Const.DB_NAME);
		const user = {
			user_name:	user_name,
			point:		Const.INIT_POINT,
			turn:		Const.INIT_TURN
		};

		dbo.collection(Const.COLLECTION_NAME).insertOne(user, (err, res) => {
			if (err) throw err;
			db.close();
		});
	});
}

module.exports = {
	add_user
};