const {model, Schema} = require('mongoose');

const schema = new Schema({
    _id: String,
    data: Object
});

module.exports = model("Document",schema);