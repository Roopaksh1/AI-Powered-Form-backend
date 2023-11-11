const OpenAI = require('openai');
const { OPEN_AI_KEY } = require('../../../utils/config');

const openai = new OpenAI({
  apiKey: OPEN_AI_KEY,
});

module.exports = openai;
