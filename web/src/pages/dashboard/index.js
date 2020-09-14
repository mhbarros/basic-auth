import React, {useEffect, useState} from 'react';
import {Api} from "../../services/Api";

import styles from '../../css/dashboard.module.css';

const Dashboard = () => {

  const [name, setName] = useState('');

  useEffect(() => {
    setName(localStorage.getItem('user.name'));
  });

  const teste = async () => {
    const response = await Api.get('/user');
  }

  return (
      <div className={styles.mainContainer}>
        <div>
          <div className={styles.topInfo}>
            <h1>Olá, {name}</h1>
            <a href={'#'}>Sair</a>
          </div>
          <div>
            <label>Nome</label>
            <input type={'text'} className={'primary'} />
          </div>
          <div>
            <label>Usuário</label>
            <input type={'text'} className={'primary'} />
          </div>
          <div>
            <label>E-mail</label>
            <input type={'text'} className={'primary'} />
          </div>
          <div>
            <label>Sexo</label>
            <select>
              <option value={''} />
              <option value={'M'}>Masculino</option>
              <option value={'F'}>Feminino</option>
            </select>
          </div>
          <button className={'primary'} onClick={teste}>Salvar</button>
        </div>
      </div>
  )
}

Dashboard.getInitialProps = async (ctx) => {

  if(!ctx.req || !ctx.req.headers.cookie){
    if(ctx.res){
      ctx.res.statusCode = 301;
      ctx.res.setHeader('location', '/');
    }

    return {};
  }

  const cookie = ctx.req.headers.cookie;

  const response = await Api.get('/login', {headers: {cookie}});

  if(response.data.ok !== true){
    ctx.res.statusCode = 301;
    ctx.res.setHeader('location', '/');
  }
  return {};
}

export default Dashboard;