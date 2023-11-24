const { SchemaTypes } = require('mongoose');
const connection = require('../connection');
const Schema = connection.Schema;

const formSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  fields: [
    {
      name: {
        type: String,
        required: true,
      },
      component: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
      isRequired: {
        type: Boolean,
        required: true,
      },
    },
  ],
});

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  forms: {
    type: [
      {
        formSchema: formSchema,
        result: [{}],
      },
    ],
    required: true,
  },
});

const userModel = connection.model('users', userSchema);
module.exports = userModel;
