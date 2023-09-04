const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const auth = require('../../../middleware/auth');
const logger = require('../../../utils/logger');

logger.debug('userRouter setup');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', auth, userController.logout);
router.post('/update', auth, userController.update);
router.post('/delete', auth, userController.delete);
router.get('/get', auth, userController.get);
router.get('/loggedin', auth, userController.loggedin);

module.exports = router;
