const { MongoClient } = require('mongodb')

let dbConnection

module.exports = {
	connectToDb: (cb) => {
		MongoClient.connect('mongodb+srv://amitvinog11:<password>@cluster0.dbyhbhq.mongodb.net/?retryWrites=true&w=majority')
		.then((client) => {
			dbConnection = client.db()
			return cb()
		})
		.catch(err => {
			console.log(err)
			return cb(err)
		})
	},
	getDb: () => dbConnection
}