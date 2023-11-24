const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
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
});

const formSchema = new Schema({
  category: {
    type: String,
    required: true,
    lowercase: true,
  },
  fields: {
    type: [questionSchema],
    required: true,
  },
});

module.exports = mongoose.model('form', formSchema);
