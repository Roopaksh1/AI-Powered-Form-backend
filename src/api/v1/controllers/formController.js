const asyncHandler = require('express-async-handler');
const openai = require('./openaiConfig');
const { ADMIN_PASS } = require('../../../utils/config');
const Form = require('../../../db/models/formModel');

module.exports = {
  getQueryResponse: asyncHandler(async (req, res) => {
    // CHAT GPT API AIN'T FREE T_T
    // const completion = await openai.chat.completions.create({
    //   messages: [{ role: 'system', content: req.params.id }],
    //   model: 'gpt-3.5-turbo',
    // });

    // res.status(200).json(completion.choices[0]);
    const re = new RegExp(req.params.id, 'i');
    const categories = await Form.find({ category: re });
    console.log(categories[0].question);
  }),

  getImageResponse: asyncHandler(async (req, res) => {
    console.log(req.params.id);
  }),

  addForm: asyncHandler(async (req, res) => {
    if (req.body.password == ADMIN_PASS) {
      const { category, name, label, isRequired } = req.body.formData;
      const question = {
        name,
        label,
        isRequired,
      };
      const categories = await Form.findOne({ category: category.toLowerCase() });
      if (!categories) {
        const form = await Form.create({
          category,
          question,
        });
      } else {
        categories.question.push(question);
        await categories.save();
      }
      res.status(200).json({ message: 'Database updated' });
    } else {
      res.status(401).json({ message: 'invalid password' });
    }
  }),
};
