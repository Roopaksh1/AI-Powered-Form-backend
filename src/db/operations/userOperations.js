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
  async update(filter, query) {
    logger.debug('userOperations update');
    const doc = await userModel.findOneAndUpdate(filter, query, { new: true });
    return doc;
  },
  async delete(id) {
    logger.debug('userOperations delete');
    const doc = await userModel.findByIdAndDelete(id);
    return doc;
  },
};
