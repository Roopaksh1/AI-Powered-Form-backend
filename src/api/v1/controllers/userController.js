const userOperations = require("../../../db/operations/userOperations");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const passwordValidator = require('password-validator');
const emailValidator = require("email-validator");
const logger = require("../../../utils/logger");

const passwordSchema = new passwordValidator();
passwordSchema
  .is().min(10)
  .is().max(100)
  .has().uppercase()
  .has().lowercase()
  .has().digits(1)
  .has().not().spaces()

module.exports = {
  async register(req, res) {
    logger.debug('userController register() start');
    const { email, password, name } = req.body;
    const passwordValidation = passwordSchema.validate(password, { list: true });
    const emailValidation = emailValidator.validate(email);
    if (name == null) {
      res.status(400).json({
        error: "nameError",
      })
    } else if (passwordValidation.length > 0) {
      res.status(400).json({
        passwordValidation: passwordValidation
      })
    } else if (emailValidation == false) {
      res.status(400).json({
        emailValidation: "failed"
      })
    } else {
      bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          const user = userOperations
            .create({
              name: name,
              email: email,
              password: hashedPassword,
            })
            .then((user) => {
              if (user && user.email) {
                res.status(201).send({ message: "user created", user });
              } else if (user.code == 11000) {
                res.status(409).send(user);
              }
            });
        })
        .catch((e) => {
          res.status(500).send({
            message: "not hashed",
            e,
          });
        });
    }
  },

  async login(req, res) {
    logger.debug('userController login() start');
    const { email, password } = req.body;
    if (email == undefined) {
      return res.status(500).send({
        message: "INVALID DATA"
      })
    }
    userOperations.read({ email: email })
      .then((user) => {
        bcrypt.compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck) {
              return res.status(400).send({
                message: "Password does not match",
              })
            }
            const token = jwt.sign(
              {
                userId: user._id
              },
              process.env.TOKEN,
              {
                expiresIn: "8h"
              }
            );
            res.status(200).send({
              message: "Login Successful",
              email: user.email,
              token
            })
          })
          .catch((e) => {
            res.status(400).send({
              message: 'Password does not match',
              e
            })
          })
      })
      .catch((e) => {
        res.status(404).send({
          message: "user not found",
          e
        })
      })
  },
  async update(req, res) {
    logger.debug('userController update() start');
    const obj = req.body;
    const doc = await userOperations.update(obj);
    res.json({
      data: doc,
    });
  },
  async delete(req, res) {
    logger.debug('userController delete() start');
    const obj = req.body;
    const doc = await userOperations.delete(obj);
    res.json({
      data: doc,
    });
  },
};
