const userOperations = require("../../../db/operations/userOperations");
const bcrypt = require("bcrypt");
const logger = require("../../../utils/logger");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const tokenGenerator = require("./jwtConfig");

const cookieConfig = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  maxAge: 1000 * 60 * 60 * 8,
};

module.exports = {
  register: [
    body("name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please add an username.")
      .custom((value) => !/\s/.test(value))
      .withMessage("No spaces are allowed in the username"),
    body("email").trim().isEmail().withMessage("Please add an email"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password Required")
      .isLength({ min: 8 })
      .withMessage("Password must be atleast 8 characters long")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/)
      .withMessage(
        "One uppercase, One lowercase and a number. Spaces are not allowed."
      ),
    body("confirm-password")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Password not matching"),

    asyncHandler(async (req, res) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        res.status(400);
        throw new Error(error.errors[0].msg);
      }

      logger.debug("userController register() start");
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
            throw new Error("A user with that email already exists");
          }
        });
      const token = tokenGenerator(user._id);
      res.cookie("token", token, cookieConfig).status(201).json({ user: user });
    }),
  ],

  login: asyncHandler(async (req, res) => {
    logger.debug("userController login() start");
    const { email, password } = req.body;
    const user = await userOperations.read({ email });
    if (!user) {
      res.status(401);
      throw new Error("Invalid Email");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401);
      throw new Error("Invalid Password");
    }

    // Generate token and add it to cookie
    const token = tokenGenerator(user._id);
    res.cookie("token", token, cookieConfig).status(200).json({ user: user });
  }),
  logout: asyncHandler((req, res) => {
    logger.debug("userController logout() start");
    return res
      .clearCookie("token")
      .status(200)
      .json({ message: "Successfully logged out" });
  }),
  get: asyncHandler(async (req, res) => {
    logger.debug("userController get()");
    res.status(200).send(req.user);
  }),
  update: [
    body("name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please add an username.")
      .custom((value) => !/\s/.test(value))
      .withMessage("No spaces are allowed in the username"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password Required")
      .isLength({ min: 8 })
      .withMessage("Password must be atleast 8 characters long")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/)
      .withMessage(
        "One uppercase, One lowercase and a number. Spaces are not allowed."
      ),
    body("confirm-password")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Password not matching"),

    asyncHandler(async (req, res) => {
      logger.debug("userController update() start");
      const error = validationResult(req);
      if (!error.isEmpty()) {
        res.status(400);
        throw new Error(error.errors[0].msg);
      }
      const { name, email } = req.body;
      const password = await bcrypt.hash(req.body.password, 10);
      const doc = await userOperations.update({ email }, { name, password });
      res.json({
        data: doc,
      });
    }),
  ],
  delete: asyncHandler(async (req, res) => {
    logger.debug("userController delete() start");
    const doc = await userOperations.delete(req.userid);
    res.status(200).redirect(req.baseUrl + "/logout");
  }),
  loggedin: asyncHandler(async (req, res) => {
    res.status(200).json({ name: req.user.name });
  }),
};
