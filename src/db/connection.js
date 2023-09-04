require('dotenv').config();
const { default: mongoose } = require('mongoose');
const { MONGODB } = require('../utils/config');

mongoose.connect(MONGODB);

module.exports = mongoose;
