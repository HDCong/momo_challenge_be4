const Const = require('./constants.js');

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

module.exports = {
	get_top_users
};