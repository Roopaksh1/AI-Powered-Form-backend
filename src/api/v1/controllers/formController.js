const asyncHandler = require('express-async-handler');
const { ADMIN_PASS } = require('../../../utils/config');
const Form = require('../../../db/models/formModel');
const User = require('../../../db/models/userModel');
const { distance } = require('fastest-levenshtein');
module.exports = {
  getQueryResponse: asyncHandler(async (req, res) => {
    const categories = await Form.find({});
    let doc = {};
    let min = Infinity;
    categories.forEach((c) => {
      if (min > distance(c.category, req.params.id)) {
        min = distance(c.category, req.params.id);
        doc = c;
      }
    });
    if (Object.keys(doc).length != 0) {
      const formSchema = {
        title: doc.category,
        fields: doc.fields,
        _id: doc._id,
      };
      req.user.forms.push({ formSchema });
      await req.user.save();
      res.status(200).json({ formSchema });
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

  deleteFormForUser: asyncHandler(async (req, res) => {
    const id = req.params.id;
    const doc = req.user.forms.filter((f) => f.formSchema._id != id);
    req.user.forms = doc;
    await req.user.save();
    res.status(200).json({ message: 'deleted successfully' });
  }),

  getPublicForm: asyncHandler(async (req, res) => {
    const userID = req.params.userID;
    const formID = req.params.formID;
    const user = await User.findById(userID);
    const doc = user.forms.filter((f) => f.formSchema._id == formID);
    if (doc.length) {
      res.status(200).json({ form: doc });
    } else {
      res.status(404).json({ message: 'Not Found' });
    }
  }),
};
