// класс, обладающий полями, которые отправляются на клиент
module.exports = class UserDto {
   email;
   id;
   isActivated;

   constructor(model) {
      this.email = model.id;
      this.id = model._id;
      this.isActivated = model.isActivated;
   }
}