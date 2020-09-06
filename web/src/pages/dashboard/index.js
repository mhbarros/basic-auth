import React, {useEffect, useState} from 'react';
import Api from "../../services/Api";

export async function getServerSideProps(ctx){
  let {cookie} = ctx.req.headers;
  if(!cookie) cookie = '';

  const response = await Api.get('/login', {headers: {cookie}});
  if(response.data.ok === false){
    ctx.res.statusCode = 301;
    ctx.res.setHeader('location', '/');
    return {props: {}};

  }
  return {props:{}};
}

import styles from '../../css/dashboard.module.css';

export default () => {

  const [name, setName] = useState('');

  const getUserInfo = () => {
    setName(localStorage.getItem('user.name'));
  }

  useEffect(() => {
    getUserInfo();
  }, [])

  return (
      <div className={styles.mainContainer}>
        <h1>Olá, {name}</h1>
      </div>
  )
}