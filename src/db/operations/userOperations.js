const logger = require("../../utils/logger");
const userModel = require("../models/userModel");

module.exports = {
    async create(obj){
        logger.debug("userOperations create");
        try{
            const doc = await userModel.create(obj);
            return doc;
        }catch(e){
            return e;
        }
    },
    async read(user){
        logger.debug("userOperations read");
        try{
            const doc = await userModel.findOne({email: user.email});
            console.log(doc);
            return doc;
        }catch(e){
            return e;
        }
    },
    async update(obj){
        logger.debug("userOperations update");
        try{
            const doc = await userModel.findOneAndUpdate({email: user.email}, obj);
            return doc;
        }catch(e){
            return e;
        }
    },
    async delete(obj){
        logger.debug("userOperations delete");
        try{
            const name = obj.name;
            const doc = await userModel.findOneAndDelete({email: user.email});
            return doc;
        }catch(e){
            return e;
        }
    },
}