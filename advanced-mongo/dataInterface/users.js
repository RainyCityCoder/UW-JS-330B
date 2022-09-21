const { MongoClient, ObjectID } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require("bcryptjs");
// https://github.com/dcodeIO/bcrypt.js/#usage---async for help with bcrypt
// To set up token a user can receive when logged in, we need auth.js from top-level
const auth = require('../auth');

const uri =
  "mongodb+srv://user1:user1@cluster0.qshjt0w.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const databaseName = 'sample_mflix';
const collName = 'users';

module.exports = {}

findByEmail = async (email) => {
  const database = client.db(databaseName);
  const userData = database.collection(collName);

  const query = {email: email};
  let user = await userData.findOne(query);
  return user
}

module.exports.findByCredentials = async (userObj) => {
  let user = await findByEmail(userObj.email);

  // Add validation for users without passwords
  if (!user.password) {
    return {error: "User doesn't have password"};
  }

  if(await bcrypt.compare(userObj.password, user.password)){
    // create token for user's login session
    let token = auth.createToken(user.email);
    // Instead of return user; return an object that doesn't include password
    // Instead of returning that object, we return a message along with the token
    return {message: "Logged in.", token: token};
  } else {
    return {error: `No user found with email ${userObj.email}.`}
  }
}

module.exports.create = async (newObj) => {
  const database = client.db(databaseName);
  const userData = database.collection(collName);

  //validate that user doesn't already exist in database
  let alreadyExists = await findByEmail(newObj.email);
  if (alreadyExists) {
    return {error: "This email is already in use."}
  }

  if (!newObj.name || !newObj.email || !newObj.password) {
    // Obj isn't complete; shouldn't be added to database
    return {error: "User name, email, and password are required"};
  }

  // We want the encrypted password, not plain text
  // Syntax: bcrypt.hash(<password>, rounds/salt)
  let encryptedPassword = await bcrypt.hash(newObj.password, 10);
  // Have to build new user-info Obj that includes the hashed password:
  let goodUser = {name: newObj.name, email: newObj.email, password: encryptedPassword};

  const result = await userData.insertOne(goodUser);

  if(result.acknowledged){
    return { newObjectId: result.insertedId, message: `User created! ID: ${result.insertedId}` }
  } else {
    return {error: "Something went wrong. Please try again."}
  }
};
