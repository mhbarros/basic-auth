import React, {useRef, useState, useEffect, useMemo} from 'react';
import Api from './../services/Api';
import router from 'next/router';

import Cookies from 'universal-cookie';

import Head from './../components/Head';

import styles from './../css/index.module.css';

const cookies = new Cookies();
// getServerSideProps
// getStaticProps
export async function getServerSideProps(ctx){
  let {cookie} = ctx.req.headers;
  if(!cookie) cookie = '';

  const response = await Api.get('/login', {headers: {cookie}});
  if(response.data.ok === true){
    ctx.res.statusCode = 301;
    ctx.res.setHeader('location', '/dashboard');
    return {props: {}};

  }
  return {props:{}};
}

export default function Home() {

  const loginBox    = useRef();
  const registerBox = useRef();
  const title       = useRef();

  const [registerName, setRegisterName]                       = useState('');
  const [registerUsername, setRegisterUsername]               = useState('');
  const [registerEmail, setRegisterEmail]                     = useState('');
  const [registerPassword, setRegisterPassword]               = useState('');
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('');

  const [loginEmail, setLoginEmail]       = useState('');
  const [loginPassword, setLoginPassword] = useState('');

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

  const validateRegister = () => {
    if(!registerName || !registerUsername || !registerEmail || !registerPassword || !registerPasswordConfirm){
      console.error('Campo obrigatório não preenchido.');
      return false;
    }

    if(registerPassword !== registerPasswordConfirm){
      console.error('As senhas não coincidem;');
      return false;

    }

    if(registerName.length > 60){
      console.error('Nome grande demais.');
      return false;
    }

    if(registerUsername.length > 60){
      console.error('Nome de usuário grande demais.');
      return false;
    }

    if(registerEmail.length > 80){
      console.error('E-mail grande demais.');
      return false;
    }

    return true;

  }

  const doRegister = async () => {
    let isValid = validateRegister();
    if(!isValid) return;

    let data = {
      name: registerName,
      username: registerUsername,
      email: registerEmail,
      password: registerPassword,
      passwordConfirm: registerPasswordConfirm
    };

    let response = await Api.post('/user', data);
  };

  const doLogin = async () => {
    let response = await Api.post('/login', {email: loginEmail, password: loginPassword});
    let responseData = response.data;

    if(responseData.ok){
      console.log(responseData);
      const {token, data} = responseData;
      if(!token) return;

      localStorage.setItem('user.name', data.name);
      localStorage.setItem('user.username', data.username);

      cookies.set('stok', token, {maxAge: 60 * 60 *3, secure: false});
      await router.push('/dashboard');
    }
  }

  return (
      <div className={styles.mainContainer}>
        <Head title={'Bem vindo(a)'} />
        <div className={styles.loginContainer}>
          <h1 ref={title} onClick={doRegister}>Olá novamente</h1>
          <section className={styles.loginBox} ref={loginBox}>
            <div>
              <label>E-mail</label>
              <input className={'primary'} type={'text'} placeholder={'E-mail'} value={loginEmail} onChange={e => {setLoginEmail(e.target.value)}}/>
            </div>
            <div>
              <label>Senha</label>
              <input className={'primary'} type={'password'} placeholder={'Senha'} value={loginPassword} onChange={e => {setLoginPassword(e.target.value)}}/>
            </div>
            <a href={'#'}>Esqueceu sua senha?</a>
            <button className={'primary'} onClick={doLogin}>Entrar</button>
            <hr/>
            <span>Não possui uma conta? <a href={'#'} onClick={showRegister}>Cadastre-se</a></span>
          </section>
          <section className={styles.registerBox} ref={registerBox}>
            <div>
              <label>Nome</label>
              <input className={'primary'} type={'text'} placeholder={'Seu nome'} value={registerName}
                     onChange={e => {setRegisterName(e.target.value)}} maxLength={60} />
            </div>
            <div>
              <label>Nome de usuário</label>
              <input className={'primary'} type={'text'} placeholder={'@usuário'} value={registerUsername}
                     onChange={e => {setRegisterUsername(e.target.value)}} maxLength={60}/>
            </div>
            <div>
              <label>E-mail</label>
              <input className={'primary'} type={'text'} placeholder={'Seu melhor e-mail'} value={registerEmail}
                     onChange={e => {setRegisterEmail(e.target.value)}} maxLength={80}/>
            </div>
            <div>
              <label>Senha</label>
              <input className={'primary'} type={'password'} placeholder={'Senha'} value={registerPassword} onChange={e => {setRegisterPassword(e.target.value)}}/>
            </div>
            <div>
              <label>Confirme sua senha</label>
              <input className={'primary'} type={'password'} placeholder={'Confirme sua senha'} value={registerPasswordConfirm} onChange={e => {setRegisterPasswordConfirm(e.target.value)}}/>
            </div>
            <button className={'primary'} onClick={doRegister}>Cadastrar</button>
            <hr/>
            <span>Já possui conta? <a href={'#'} onClick={showLogin}>Entrar</a></span>
          </section>
        </div>
        <div className={styles.mainBg}/>
      </div>
  )
}
