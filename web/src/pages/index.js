import React, {useRef} from 'react';
import Api from './../services/Api';

import Head from './../components/Head';

import styles from './../css/index.module.css';

export default function Home() {

  const loginBox    = useRef();
  const registerBox = useRef();
  const title       = useRef();

  const showLogin = () => {
    registerBox.current.style.display = 'none';
    loginBox.current.style.display    = 'flex';
    title.current.innerText           = 'Olá novamente';
  }

  const showRegister = () => {
    registerBox.current.style.display = 'flex';
    loginBox.current.style.display    = 'none';
    title.current.innerText           = 'Crie sua conta';
  }

  const doRegister = async () => {
    let data = await Api.post('/user', '');
    console.log(data.data);
  };

  return (
      <div className={styles.mainContainer}>
        <Head title={'Bem vindo(a)'} />
        <div className={styles.loginContainer}>
          <h1 ref={title} onClick={doRegister}>Olá novamente</h1>
          <section className={styles.loginBox} ref={loginBox}>
            <div>
              <label>E-mail</label>
              <input className={'primary'} type={'text'} placeholder={'E-mail'}/>
            </div>
            <div>
              <label>Senha</label>
              <input className={'primary'} type={'password'} placeholder={'Senha'}/>
            </div>
            <a href={'#'}>Esqueceu sua senha?</a>
            <button className={'primary'}>Entrar</button>
            <hr/>
            <span>Não possui uma conta? <a href={'#'} onClick={showRegister}>Cadastre-se</a></span>
          </section>
          <section className={styles.registerBox} ref={registerBox}>
            <div>
              <label>Nome</label>
              <input className={'primary'} type={'text'} placeholder={'Seu nome'}/>
            </div>
            <div>
              <label>Nome de usuário</label>
              <input className={'primary'} type={'text'} placeholder={'@usuário'}/>
            </div>
            <div>
              <label>E-mail</label>
              <input className={'primary'} type={'text'} placeholder={'Seu melhor e-mail'}/>
            </div>
            <div>
              <label>Senha</label>
              <input className={'primary'} type={'password'} placeholder={'Senha'}/>
            </div>
            <div>
              <label>Confirme sua senha</label>
              <input className={'primary'} type={'password'} placeholder={'Confirme sua senha'}/>
            </div>
            <button className={'primary'}>Cadastrar</button>
            <hr/>
            <span>Já possui conta? <a href={'#'} onClick={showLogin}>Entrar</a></span>
          </section>
        </div>
        <div className={styles.mainBg}/>
      </div>
  )
}
