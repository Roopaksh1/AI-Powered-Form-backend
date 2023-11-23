const express = require('express');
const route = express.Router();
const formController = require('../controllers/formController');

route.get('/text/:id', formController.getQueryResponse);
route.get('/image/:id', formController.getImageResponse);
route.post('/', formController.addForm);

module.exports = route;
