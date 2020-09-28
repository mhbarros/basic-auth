import React from 'react';

import {Api} from '../../services/Api';

const RecoverUuid = ({ok}) => {

  const recoverView = () => (
      <h1>Recuperação de senha</h1>
  )

  const invalidView = () => (
    <h1>Este pedido não é mais válido.</h1>
  )

  if(ok === true) {
    return recoverView()
  }

  return invalidView();
}

RecoverUuid.getInitialProps = async (ctx) => {
  const {uuid} = ctx.query;
  try{
    const response = await Api.get(`/recover/${uuid}`);
    if(response.data.ok === true){
      return {ok: true};
    }
  }catch (e) {

  }

  return {ok: false};
}

export default RecoverUuid;