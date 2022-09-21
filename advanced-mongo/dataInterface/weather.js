const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

// uri is from mongodb account > Connect > Connect your app > Driver: Node
const uri = "mongodb+srv://user1:user1@cluster0.qshjt0w.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const databaseName = 'sample_weatherdata';
const collName = 'data';

module.exports = {};

// https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/
module.exports.getAllByCallLetter = async (callLetter) => {
  const database = client.db(databaseName);
  const weatherData = database.collection(collName);
  const query = { callLetters: callLetter };
  let resultCursor = await weatherData.find(query).limit(10);
  // .limit(10).project({title: 1}).sort({runtime: -1})
  return resultCursor.toArray();
}

module.exports.getByParameter = async (queryObj) => {
  const database = client.db(databaseName);
  const weatherData = database.collection(collName);
  let result = await weatherData.find(queryObj).limit(10);
  return result.toArray();
}

module.exports.createWeatherDocument = async (itemsToInsert) => {
  const database = client.db(databaseName);
  const weatherData = database.collection(collName);
  const query = {...itemsToInsert};
  let result = await weatherData.insertOne(query);

  return result;
}
