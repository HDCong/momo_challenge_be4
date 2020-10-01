const Const = require('./constants.js');

function get_top_users(n) { // TODO: how to return the result?
	const MongoClient = require('mongodb').MongoClient;

	MongoClient.connect(Const.DB_URL, (err, db) => {
		if (err) throw err;

		const dbo = db.db(Const.DB_NAME);
		const sort_criteria = { point: -1 };

		dbo.collection(Const.COLLECTION_NAME).find().sort(sort_criteria).limit(n).toArray((err, res) => {
			if (err) throw err;
			db.close();
			console.log(res);
		});
	});
}