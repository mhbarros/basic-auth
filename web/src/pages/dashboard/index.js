import React from 'react';
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

export default () => (
    <h1>Dashboard do usuário logado</h1>
)