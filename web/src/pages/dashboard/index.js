import React, {useEffect, useState} from 'react';
import router from 'next/router';
import {Api} from "../../services/Api";

import styles from '../../css/dashboard.module.css';

const Dashboard = () => {

  const [name, setName]         = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [gender, setGender]     = useState('');

  useEffect(() => {
    getUserInfo();
  });

  const getUserInfo = async () => {
    const {data} = await Api.get('/user');

    if(data.ok === true){
      setName(data.data.name);
      setUsername(data.data.username);
      setEmail(data.data.email);

      let gender = data.data.gender;
      if(!gender) gender = '';
      setGender(gender);
    }
  }

  const doLogout = async () => {
    const response = await Api.post('/logout');
    if(response.data.ok){
      await router.push('/');
    }

  };

  return (
      <div className={styles.mainContainer}>
        <div>
          <div className={styles.topInfo}>
            <h1>Olá, {name}</h1>
            <a href={'#'} onClick={doLogout}>Sair</a>
          </div>
          <div>
            <label>Nome</label>
            <input type={'text'} className={'primary'} value={name} />
          </div>
          <div>
            <label>Usuário</label>
            <input type={'text'} className={'primary'} value={username} />
          </div>
          <div>
            <label>E-mail</label>
            <input type={'text'} className={'primary'} value={email} />
          </div>
          <div>
            <label>Sexo</label>
            <select value={gender}>
              <option value={''} />
              <option value={'M'}>Masculino</option>
              <option value={'F'}>Feminino</option>
            </select>
          </div>
          <button className={'primary'} >Salvar</button>
        </div>
      </div>
  )
}

Dashboard.getInitialProps = async (ctx) => {

  let isAuth = false;

  if(!ctx.req || !ctx.req.headers.cookie){
    if(ctx.res){
      ctx.res.statusCode = 301;
      ctx.res.setHeader('location', '/');
    }

    return {isAuth};
  }

  try{
    const response = await Api.get('/login', {headers: {cookie: ctx.req.headers.cookie}});
    if(response.headers && response.headers['set-cookie']){
      isAuth = true;
      ctx.res.setHeader('set-cookie', response.headers['set-cookie']);

    }

  }catch (e) {

    isAuth = false;
    ctx.res.statusCode = 301;
    ctx.res.setHeader('location', '/');
  }

  return {isAuth};
}

export default Dashboard;