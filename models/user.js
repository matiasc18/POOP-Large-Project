const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

//Create Schema
const UserSchema = new Schema({
  FirstName: {
    type: String,
    required: true
  },
  LastName: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  Login: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true
  }
});

// function runs right before the new user document is saved
// hashes the user's password before adding into DB
UserSchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt();
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
});

module.exports = user = mongoose.model("Users", UserSchema);