const Const = require('./constants.js');

async function add_user(user_name, db) {
	//const MongoClient = require('mongodb').MongoClient;

	try {
		//db = await MongoClient.connect(Const.DB_URL);

		const dbo = db.db(Const.DB_NAME);
		const user = {
			user_name:	user_name,
			point:		Const.INIT_POINT,
			turn:		Const.INIT_TURN
		};

		return (await dbo.collection(Const.COLLECTION_NAME).insertOne(user)).insertedId;
	}
	catch (err) {
		console.log(err);
	}
}

module.exports = {
	add_user
};