const mongoose = require('mongoose');

const formSchema = mongoose.Schema({
  name: {
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

module.exports = mongoose.model('form', formSchema);
