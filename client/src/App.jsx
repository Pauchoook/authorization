import React from "react";
import LoginForm from "./components/LoginForm/LoginForm";
import './app.scss';
import { useContext } from "react";
import { Context } from "./index";
import { useEffect } from "react";
import { observer } from 'mobx-react-lite';
import { useState } from "react";
import UserService from "./services/UserService";

function App() {
  const {store} = useContext(Context);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, []);

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  if (store.isLoading) {
    return (
      <div className="app">
        <h1>Загрузка...</h1>
      </div>
    )
  }

  return (
    <div className="app">
      <h1 style={{marginBottom: 10}}>{store.isAuth ? 'Вы авторизованы' : 'Авторизация'}</h1>
      {!store.isAuth
      ? 
      <LoginForm />
      :
      <div>
        <button style={{maxWidth: 300}} onClick={() => store.logout()} className='login-form__btn'>Выйти</button>
        <button style={{marginTop: 15}} onClick={() => getUsers()} className='login-form__btn'>Получить всех пользователей</button>
        {users.map(user =>
         <div key={user.email} style={{marginTop: 5}}>{user.email}</div> 
        )}
      </div>
      }
    </div>
  );
}

export default observer(App);
