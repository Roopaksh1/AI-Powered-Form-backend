const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('./src/utils/logger');
const { PORT } = require('./src/utils/config');
const app = express();
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://aiform.netlify.app'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/v1/user', require('./src/api/v1/routes/userRoutes'));
app.use('/v1/form', require('./src/api/v1/routes/formRoutes'));
app.use('*', require('./src/middleware/error'));

app.listen(PORT, () => {
  console.log(`listening to ${PORT}`);
});

logger.debug('server setup complete');
