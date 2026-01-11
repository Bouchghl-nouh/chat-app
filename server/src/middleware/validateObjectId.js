const sendResponse = require("../utils/responseHandler");
const mongoose = require("mongoose");
const validateObjectId = (req,res,next) =>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return sendResponse(res, 400, false, "Invalid id");
    }
    next();
}
module.exports = validateObjectId;