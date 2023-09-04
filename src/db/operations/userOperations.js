const logger = require('../../utils/logger');
const userModel = require('../models/userModel');

module.exports = {
  async create(obj) {
    logger.debug('userOperations create');
    const doc = await userModel.create(obj);
    return doc;
  },
  async read(query) {
    logger.debug('userOperations read');
    const doc = await userModel.findOne({ ...query });
    return doc;
  },
  async update(obj) {
    logger.debug('userOperations update');
    const doc = await userModel.findOneAndUpdate({ email: user.email }, obj);
    return doc;
  },
  async delete(obj) {
    logger.debug('userOperations delete');
    const name = obj.name;
    const doc = await userModel.findOneAndDelete({ email: user.email });
    return doc;
  },
};
