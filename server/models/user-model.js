const {Schema, model} = require('mongoose');

// Schema описывает, какие поля содержит сущность
const UserModel = new Schema({
   email: {type: String, unique: true, required: true},
   password: {type: String, required: true},
   isActivated: {type: Boolean, default: false},
   activetionLink: {type: String}
});

module.exports = model('User', UserModel);