const {Schema, model} = require('mongoose');

// Schema описывает, какие поля содержит сущность
const TokenSchema = new Schema({
   user: {type: Schema.Types.ObjectId, ref: 'User'},
   refreshToken: {type: String, required: true}
});

module.exports = model('Token', TokenSchema);