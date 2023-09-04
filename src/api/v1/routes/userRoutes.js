const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const auth = require('../../../middleware/auth');
const logger = require('../../../utils/logger');

logger.debug('userRouter setup');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/login', auth, userController.loggedin);
router.get('/', auth, userController.get);
router.post('/logout', auth, userController.logout);
router.patch('/', auth, userController.update);
router.delete('/', auth, userController.delete);


module.exports = router;
