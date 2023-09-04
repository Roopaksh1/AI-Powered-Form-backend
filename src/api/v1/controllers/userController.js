const userOperations = require('../../../db/operations/userOperations');
const bcrypt = require('bcrypt');
const logger = require('../../../utils/logger');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const tokenGenerator = require('./jwtConfig');

module.exports = {
  register: [
    body('name')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please add an username.')
      .custom((value) => !/\s/.test(value))
      .withMessage('No spaces are allowed in the username'),
    body('email').trim().isEmail().withMessage('Please add an email'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password Required')
      .isLength({ min: 8 })
      .withMessage('Password must be atleast 8 characters long')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/)
      .withMessage(
        'One uppercase, One lowercase and a number. Spaces are not allowed.'
      ),
    body('confirm-password')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Password not matching'),

    asyncHandler(async (req, res) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        res.status(400);
        throw new Error(error.errors[0].msg);
      }

      logger.debug('userController register() start');
      const { email, name } = req.body;
      const password = await bcrypt.hash(req.body.password, 10);
      const user = await userOperations
        .create({
          name,
          email,
          password,
        })
        .catch((err) => {
          if (err.code === 11000) {
            res.status(409);
            throw new Error('A user with that email already exists');
          }
        });
      const token = tokenGenerator({
        sub: user._id,
        iat: Date.now(),
      });
      res
        .cookie('token', token, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          maxAge: 1000 * 60 * 60 * 8,
        })
        .status(200)
        .json({ auth: true, name: user.name });
    }),
  ],

  login: asyncHandler(async (req, res) => {
    logger.debug('userController login() start');
    const { email, password } = req.body;
    const user = await userOperations.read({ email });
    if (!user) {
      res.status(401);
      throw new Error('Invalid Email');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401);
      throw new Error('Invalid Password');
    }

    // Generate token and add it to cookie
    const token = tokenGenerator({
      sub: user._id,
      iat: Date.now(),
    });
    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 1000 * 60 * 60 * 8,
      })
      .status(200)
      .json({ auth: true, name: user.name });
  }),
  logout: asyncHandler((req, res) => {
    logger.debug('userController logout() start');
    return res
      .clearCookie('token')
      .status(200)
      .json({ message: 'Successfully logged out' });
  }),
  get: asyncHandler(async (req, res) => {
    logger.debug('userController get()');
    res.status(200).send(req.user);
  }),
  update: [
    body('name')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please add an username.')
      .custom((value) => !/\s/.test(value))
      .withMessage('No spaces are allowed in the username'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password Required')
      .isLength({ min: 8 })
      .withMessage('Password must be atleast 8 characters long')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/)
      .withMessage(
        'One uppercase, One lowercase and a number. Spaces are not allowed.'
      ),

    asyncHandler(async (req, res) => {
      logger.debug('userController update() start');
      const error = validationResult(req);
      if (!error.isEmpty()) {
        res.status(400);
        throw new Error(error.errors[0].msg);
      }
      const obj = req.body;
      const doc = await userOperations.update(obj);
      res.json({
        data: doc,
      });
    }),
  ],
  delete: asyncHandler(async (req, res) => {
    logger.debug('userController delete() start');
    const obj = req.body;
    const doc = await userOperations.delete(obj);
    res.json({
      data: doc,
    });
  }),
};
