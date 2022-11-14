import axios from 'axios';
import { makeAutoObservable } from 'mobx';
import { API_URL } from '../http/index';
import AuthService from '../services/AuthService';

export default class Store {
   user = {};
   isAuth = false;
   isLoading = false;

   constructor() {
      makeAutoObservable(this); // чтобы mobx смог работать с классом
   }

   setAuth(bool) {
      this.isAuth = bool;
   }

   setUser(user) {
      this.user = user;
   }

   setLoading(bool) {
      this.isLoading = bool
   }

   async login(email, password) {
      try {
         const response = await AuthService.login(email, password);
         localStorage.setItem('token', response.data.accessToken);

         this.setAuth(true);
         this.user(response.data.user);
      } catch(e) {
         console.log(e.response?.data?.message);
      }
   }

   async logout(email, password) {
      try {
         const response = await AuthService.logout();
         console.log(response)
         localStorage.removeItem('token', response.data.accessToken);

         this.setAuth(false);
         this.setUser({});
      } catch(e) {
         console.log(e.response?.data?.message);
      }
   }

   async registration(email, password) {
      try {
         const response = await AuthService.registration(email, password);
         localStorage.setItem('token', response.data.accessToken);

         this.setAuth(true);
         this.setUser(response.data.user);
      } catch(e) {
         console.log(e.response?.data?.message);
      }
   }

   async checkAuth() {
      this.setLoading(true);
      try {
         const response = await axios.get(`${API_URL}/refresh`, {withCredentials: true});
         localStorage.setItem('token', response.data.accessToken);
         this.setAuth(true);
         this.setUser(response.data.user);
      } catch(e) {
         console.log(e.response?.data?.message);
      } finally {
         this.setLoading(false);
      }
   }
}