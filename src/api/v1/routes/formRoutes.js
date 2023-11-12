const express = require('express');
const route = express.Router();
const formController = require('../controllers/formController');

route.get('/text', formController.getQueryResponse);
route.get('/image', formController.getImageResponse);

module.exports = route;
