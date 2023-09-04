require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const logger = require('./src/utils/logger');
const app = express();
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/v1/user', require('./src/api/v1/routes/userRoutes'));
app.use('*', require('./src/middleware/error'));

app.listen((port = process.env.PORT), () => {
  console.log(`listening to ${port}`);
});

logger.debug('server setup complete');
