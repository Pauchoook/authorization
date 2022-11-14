// работа с юзерами. Создание, удаление, поиск и тд
const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exception/api-error');

class UserService {
   async registration(email, password) {
      // проверка, есть ли такой юзер в БД
      const candidate = await UserModel.findOne({email}); // поиск по email

      if (candidate) {
         throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
      }

      // создание юзера
      const hashPassword = await bcrypt.hash(password, 3);
      const activationLink = uuid.v4(); // рандомная уникальная строка
      const user = await UserModel.create({email, password: hashPassword, activationLink});

      // отправка сообщения
      await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
     
      const userDto = new UserDto(user); // id, email, isActivated. Юзаем как payload
      const tokens = await tokenService.generateTokens({...userDto});

      // сохранение refresh токена в БД
      await tokenService.saveToken(userDto.id, tokens.refreshToken);
      return {...tokens, user: userDto};
   }

   async activate(activationLink) {
      // ищем юзера в БД по ссылке
      const user = await UserModel.findOne({activationLink});

      if (!user) {
         throw ApiError.BadRequest('Некорректная ссылка для активации');
      }

      // помечаем юзера активированным
      user.isActivated = true;
      await user.save();
   }

   async login(email, password) {
      const user = await UserModel.findOne({email}); // поиск по email

      if (!user) {
         throw ApiError.BadRequest(`Пользователь с таким email не найден`);
      }

      // проверка пароля
      const isPassEquals = await bcrypt.compare(password, user.password);
      if (!isPassEquals) {
         throw ApiError.BadRequest(`Неверный пароль`);
      }

      const userDto = new UserDto(user);
      const tokens = await tokenService.generateTokens({...userDto});

      // сохранение refresh токена в БД
      await tokenService.saveToken(userDto.id, tokens.refreshToken);
      return {...tokens, user: userDto}
   }

   async logout(refreshToken) {
      // удаление рефреш токена из БД
      const token = await tokenService.removeToken(refreshToken);
      return token;
   }

   async refresh(refreshToken) {
      if (!refreshToken) {
         throw ApiError.UnauthorizedError();
      }

      const userData = tokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = await tokenService.findToken(refreshToken);

      if (!userData || !tokenFromDb) {
         throw ApiError.UnauthorizedError();
      }

      const user = await UserModel.findById(userData.id);
      const userDto = new UserDto(user);
      const tokens = await tokenService.generateTokens({...userDto});

      // сохранение refresh токена в БД
      await tokenService.saveToken(userDto.id, tokens.refreshToken);
      return {...tokens, user: userDto}
   }

   async getAllUsers() {
      const users = await UserModel.find();
      return users;
   }
}

module.exports = new UserService();