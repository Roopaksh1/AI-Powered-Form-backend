const { SchemaTypes } = require('mongoose');
const connection = require('../connection');
const Schema = connection.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
});

const userModel = connection.model('users', userSchema);
module.exports = userModel;
