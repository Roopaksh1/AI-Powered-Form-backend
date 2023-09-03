const userOperations = require('../../../db/operations/userOperations');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../../../utils/logger');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

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
      // TODO jwt token and cookie

      res.json({ auth: true, name: user.name });
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
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.TOKEN,
      {
        expiresIn: '8h',
      }
    );
    res.json({ auth: true, name: user.name });
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
