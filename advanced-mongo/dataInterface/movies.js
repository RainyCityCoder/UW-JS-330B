const { MongoClient, ObjectID } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;


const uri =
  "mongodb+srv://user1:user1@cluster0.qshjt0w.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const databaseName = 'sample_mflix';
const collName = 'movies'
const commCollName = 'comments';

module.exports = {}

// https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/
module.exports.getAll = async () => {
  const database = client.db(databaseName);
  const movies = database.collection(collName);

  const query = {};
  let movieCursor = await movies.find(query).limit(10).project({title: 1}).sort({runtime: -1});

  return movieCursor.toArray();
}

// https://www.mongodb.com/docs/drivers/node/current/usage-examples/findOne/
module.exports.getById = async (movieId) => {
  const database = client.db(databaseName);
  const movies = database.collection(collName);
  const query = {_id: ObjectId(movieId)};
  let movie = await movies.findOne(query);

  return movie;
}

module.exports.getByTitle = async (title) => {
  const database = client.db(databaseName);
  const movies = database.collection(collName);
  const query = {title: title};
  let movie = await movies.findOne(query);

  return movie;
}

module.exports.getByIdOrTitle = async (identifier) => {
  let movie;

  if(ObjectId.isValid(identifier)){
    movie = module.exports.getById(identifier);
  } else {
    movie = module.exports.getByTitle(identifier);
  }

  if(movie){
    return movie;
  } else {
    return {error: `No item found with identifier ${identifier}.`}
  }
}

// https://www.mongodb.com/docs/v4.4/tutorial/insert-documents/
module.exports.create = async (newObj) => {
  const database = client.db(databaseName);
  const movies = database.collection(collName);

  if(!newObj.title){
    // Invalid movie object, shouldn't go in database.
    return {error: "Movies must have a title."}
  }
  const result = await movies.insertOne(newObj);

  if(result.acknowledged){
    return { newObjectId: result.insertedId, message: `Item created! ID: ${result.insertedId}` }
  } else {
    return {error: "Something went wrong. Please try again."}
  }
}

// https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/write-operations/change-a-document/
module.exports.updateById = async (movieId, newObj) => {
  const database = client.db(databaseName);
  const movies = database.collection(collName);

  // Product team says only these two fields can be updated.
  const updateRules = {
    $set: {"title" : newObj.title, "plot": newObj.plot}
  };
  const filter = { _id: ObjectId(movieId) };
  const result = await movies.updateOne(filter, updateRules);

  if(result.modifiedCount != 1){
    return {error: `Something went wrong. ${result.modifiedCount} movies were updated. Please try again.`}
  };

  const updatedMovie = module.exports.getById(movieId);
  return updatedMovie;
}

// https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/write-operations/delete/
module.exports.deleteById = async (movieId) => {
  const database = client.db(databaseName);
  const movies = database.collection(collName);

  const deletionRules = {_id:ObjectId(movieId)}
  const result = await movies.deleteOne(deletionRules);

  if(result.deletedCount != 1){
    return {error: `Something went wrong. ${result.deletedCount} movies were deleted. Please try again.`}
  };

  return {message: `Deleted ${result.deletedCount} movie.`};
}

// Comments for a Movie

module.exports.getAllComments = async (movieId) => {
  const database = client.db(databaseName);
  const comments = database.collection(commCollName);
  // 'movie_id' is from comments document; it is a field/data type in each item:
  const query = { movie_id : ObjectId(movieId) };
  let commentCursor = await comments.find(query);
  // if(result.acknowledged){
  //   return commentCursor.toArray();
  // } else {
  //   return {error: "Something went wrong. Please try again."}
  // }
  return commentCursor.toArray();
}

module.exports.getSingleComment = async (movieId, commentId) => {
  const database = client.db(databaseName);
  const comments = database.collection(commCollName);
  const query = { movie_id: ObjectId(movieId), _id: ObjectId(commentId) };
  let commentCursor = await comments.find(query);
  return commentCursor.toArray();
}

module.exports.createComment = async (movieId, newObj) => {
  const database = client.db(databaseName);
  const comments = database.collection(commCollName);
  // Destructure newObj to get the fields inside into goodObj.
  // As we want movie_id and date to overwrite similar fields in newObj, the destructuring of newObj should occur first.
  const goodObj = { ...newObj, movie_id: ObjectId(movieId), date: new Date() }
  const result = await comments.insertOne(goodObj);
  if(result.acknowledged){
    return { message: `Item created! ID: ${result.insertedId}` }
  } else {
    return {error: "Something went wrong. Please try again."}
  }
}

module.exports.updateById = async (commentId, newObj) => {
  const database = client.db(databaseName);
  const comments = database.collection(commCollName);
  const filter = { _id: ObjectId(commentId) };
  let result = await comments.updateOne( filter, {$set:newObj} );
  return result.modifiedCount;
}

module.exports.deleteCommentById = async (commentId) => {
  const database = client.db(databaseName);
  const comments = database.collection(commCollName);
  const query = { _id: ObjectId(commentId) }
  let result = await comments.deleteOne(query);
  console.log(result)
  return result.deletedCount;
}