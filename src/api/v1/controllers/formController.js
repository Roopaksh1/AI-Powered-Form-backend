const asyncHandler = require('express-async-handler');
const { ADMIN_PASS } = require('../../../utils/config');
const Form = require('../../../db/models/formModel');
const User = require('../../../db/models/userModel');
const { fuzzy } = require('fast-fuzzy');
module.exports = {
  getQueryResponse: asyncHandler(async (req, res) => {
    const categories = await Form.find({});
    let doc = {};
    let max = -Infinity;
    console.log(req.params.id);
    categories.forEach((c) => {
      if (max < fuzzy(c.category, req.params.id)) {
        max = fuzzy(c.category, req.params.id);
        doc = c;
      }
    });
    if (Object.keys(doc).length != 0) {
      const formSchema = {
        title: doc.category,
        fields: doc.fields,
      };
      req.user.forms.push({ formSchema });
      await req.user.save();
      res.status(200).json({
        formSchema: req.user.forms[req.user.forms.length - 1].formSchema,
      });
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

  submitForm: asyncHandler(async (req, res) => {
    const userID = req.params.userID;
    const formID = req.params.formID;
    if (Object.keys(req.body).length == 0) {
      res.status(400).json({ message: 'Invalid Data' });
    } else {
      const user = await User.findById(userID);
      let idx;
      const doc = user.forms.filter((f, index) => {
        if (f.formSchema._id == formID) {
          idx = index;
          return true;
        }
        return false;
      });

      doc[0].result.push(req.body);
      user.forms[idx].result = doc[0].result;
      await user.save();
      res.status(200).json('Form submitted successfully');
    }
  }),

  getResult: asyncHandler(async (req, res) => {
    const id = req.params.id;
    const doc = req.user.forms.filter((f) => f.formSchema._id == id);
    res.status(200).json(doc[0].result);
  }),
};
