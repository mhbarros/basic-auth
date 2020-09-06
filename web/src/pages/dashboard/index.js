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

export default () => {
  return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#cdcdcd'}}>
        <div style={{width: '600px', height: '400px', borderRadius: '10px', background: 'white'}}>
          <h2>Seus dados de usuário</h2>
        </div>
      </div>
  )
}