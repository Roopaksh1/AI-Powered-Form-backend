require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./src/utils/logger');
const userRoutes = require('./src/api/v1/routes/userRoutes');
const app = express();
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  })
);
app.use(express.json());

app.use('/v1/user/', userRoutes);

app.listen((port = process.env.PORT), () => {
  console.log(`listening to ${port}`);
});

logger.debug('server setup complete');
