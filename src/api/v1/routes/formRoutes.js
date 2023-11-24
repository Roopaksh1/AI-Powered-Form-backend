const express = require('express');
const route = express.Router();
const formController = require('../controllers/formController');
const auth = require('../../../middleware/auth');

route.get('/query/:id', auth, formController.getQueryResponse);
route.get('/', auth, formController.getForm);
route.post('/', formController.addForm);

module.exports = route;
