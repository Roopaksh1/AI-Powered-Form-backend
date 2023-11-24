const asyncHandler = require('express-async-handler');
const openai = require('./openaiConfig');
const { ADMIN_PASS } = require('../../../utils/config');
const Form = require('../../../db/models/formModel');
const similarity = require('similarity');

module.exports = {
  getQueryResponse: asyncHandler(async (req, res) => {
    // CHAT GPT API AIN'T FREE T_T
    // const completion = await openai.chat.completions.create({
    //   messages: [{ role: 'system', content: req.params.id }],
    //   model: 'gpt-3.5-turbo',
    // });

    // res.status(200).json(completion.choices[0]);
    const categories = await Form.find({});
    let doc = {};
    let max = 0;
    categories.forEach((c) => {
      if (max < similarity(c.category, req.params.id)) {
        max = similarity(c.category, req.params.id);
        doc = c;
      }
    });
    if (Object.keys(doc).length != 0) {
      const formSchema = { title: doc.category, fields: doc.fields };
      req.user.forms.push({ formSchema });
      await req.user.save();
      res.status(200).json({ title: doc.category, fields: doc.fields });
    } else {
      res.status(404).json({ message: 'Not Found' });
    }
  }),

  getForm: asyncHandler(async (req, res) => {
    const forms = req.user.forms.map((f) => f.formSchema);
    res.status(200).json({ forms });
  }),

  addForm: asyncHandler(async (req, res) => {
    if (req.body.password == ADMIN_PASS) {
      const { category, name, component, label, isRequired } =
        req.body.formData;
      const fields = {
        name,
        component,
        label,
        isRequired,
      };
      const categories = await Form.findOne({
        category: category.toLowerCase(),
      });
      if (!categories) {
        const form = await Form.create({
          category,
          fields,
        });
      } else {
        categories.fields.push(fields);
        await categories.save();
      }
      res.status(200).json({ message: 'Database updated' });
    } else {
      res.status(401).json({ message: 'invalid password' });
    }
  }),

  deleteFormForUser: asyncHandler(async (req, res) => {}),
};
