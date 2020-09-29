import React, {useState} from 'react';
import {useRouter} from 'next/router';

import {Api} from '../../services/Api';
import styles from '../../css/recover.module.css';

const RecoverUuid = ({ok}) => {

  const router = useRouter();

  const [newPass, setNewPass] = useState('');
  const [newPassConfirm, setNewPassConfirm] = useState('');

  const validateNewPassword = () => {
    if (!newPass || !newPassConfirm) {
      return false;
    }

    return newPass === newPassConfirm;
  }

  const doChangePass = async () => {
    if (!validateNewPassword()) {
      console.error('Erro ao alterar senha. Por favor, tente novamente.');
      return;
    }
    const recoverData = {
      uuid: router.query.uuid,
      pass: newPass,
      passConfirm: newPassConfirm
    }

    try {
      const response = await Api.post('/recover', recoverData);
      const {ok} = response.data;
      if (ok === true) {
        alert('Senha alterada com sucesso');
        await router.push('/');
      }
    } catch (e) {
      console.error(e);
    }
  }

  const recoverView = () => (
      <div className={styles.mainContainer}>
        <div>
          <h1>Recuperação de senha</h1>
          <div>
            <label>Nova senha</label>
            <input type={'password'} className={'primary'} placeholder={'Nova senha'}
                   value={newPass} onChange={e => {
              setNewPass(e.target.value)
            }}/>
          </div>
          <div>
            <label>Confirme a nova senha</label>
            <input type={'password'} className={'primary'} placeholder={'Confirme a nova senha'}
                   value={newPassConfirm} onChange={e => {
              setNewPassConfirm(e.target.value)
            }}/>
          </div>
          <button className={'primary'} onClick={doChangePass}>Alterar</button>
        </div>
      </div>

  )

  const invalidView = async () => {

    return <h1>Este pedido não é mais válido.</h1>;
  }

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