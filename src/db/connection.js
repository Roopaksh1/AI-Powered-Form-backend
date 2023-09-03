require('dotenv').config();
const { default: mongoose } = require("mongoose");

mongoose.connect(process.env.MONGODB);

module.exports = mongoose;