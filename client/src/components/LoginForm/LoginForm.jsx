import React from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import './login-form.scss';

function LoginForm(props) {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const {store} = useContext(Context);

   return (
      <div className='login-form'>
         <input
            onChange={e => setEmail(e.target.value)}
            value={email}
            type="text"
            placeholder='Email...'
            className='login-form__input'
         />
         <input
            onChange={e => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder='Password...'
            className='login-form__input'
         />
         <button onClick={() => store.login(email, password)} className='login-form__btn'>Логин</button>
         <button onClick={() => store.registration(email, password)} className='login-form__btn'>Регистрация</button>
      </div>
   );
}

export default observer(LoginForm);