import React, {useRef, useState, useEffect, useMemo} from 'react';
import {Api} from '../services/Api';
import router from 'next/router';

import Cookies from 'universal-cookie';

import Head from './../components/Head';

import styles from './../css/index.module.css';

const cookies = new Cookies();
// getServerSideProps
// getStaticProps
export async function getInitialProps(ctx){
  /*let {cookie} = ctx.req.headers;
  if(!cookie) cookie = '';

  const response = await Api.get('/login', {headers: {cookie}});
  if(response.data.ok === true){
    ctx.res.statusCode = 301;
    ctx.res.setHeader('location', '/dashboard');
    return {props: {}};

  }*/
  console.log('asd');
  const response = await Api.get('/login');
  return {props:{}};
}

const Home = () =>  {

  const loginBox          = useRef();
  const registerBox       = useRef();
  const forgotPasswordBox = useRef();
  const title             = useRef();

  const [registerName, setRegisterName]                       = useState('');
  const [registerUsername, setRegisterUsername]               = useState('');
  const [registerEmail, setRegisterEmail]                     = useState('');
  const [registerPassword, setRegisterPassword]               = useState('');
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('');

  const [loginEmail, setLoginEmail]       = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  const showLogin = () => {
    loginBox.current.style.display    = 'flex';
    title.current.innerText           = 'Olá novamente';
    hideRegister();
    hideForgotPassword();
  }

  const hideLogin = () => {
    loginBox.current.style.display    = 'none';
  }

  const showRegister = () => {
    registerBox.current.style.display = 'flex';
    title.current.innerText           = 'Crie sua conta';
    hideLogin();
    hideForgotPassword();
  }

  const hideRegister = () => {
    registerBox.current.style.display = 'none';
  }

  const showForgotPassword = () => {
    forgotPasswordBox.current.style.display = 'flex';
    title.current.innerText = 'Recupere sua conta';
    hideLogin();
    hideRegister();
  }

  const hideForgotPassword = () => {
    forgotPasswordBox.current.style.display = 'none';
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

    if(response && response.data.ok){
      const data = response.data.data;

      localStorage.setItem('user.name', data.name);
      localStorage.setItem('user.username', data.username);

      await router.push('/dashboard');
    }
  };

  const doLogin = async () => {
    let response = await Api.post('/login', {email: loginEmail, password: loginPassword});

    let responseData = response.data;

    if(responseData && responseData.ok){

      const {data} = responseData;

      localStorage.setItem('user.name', data.name);
      localStorage.setItem('user.username', data.username);

      await router.push('/dashboard');
    }
  }

  const doForgotPassword = async () => {
    const data = {
      email: forgotPasswordEmail
    }
    const response = await Api.post('/login/forgot', data);
    console.log(response.data);
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
            <a href={'#'} onClick={showForgotPassword}>Esqueceu sua senha?</a>
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
          <section className={styles.forgotPasswordBox} ref={forgotPasswordBox}>
            <div>
              <label>E-mail</label>
              <input className={'primary'} type={'email'} placeholder={'E-mail'} value={forgotPasswordEmail} onChange={e => setForgotPasswordEmail(e.target.value)}/>
            </div>
            <button className={'primary'} onClick={doForgotPassword}>Enviar recuperação</button>
            <a href={'#'} onClick={showLogin}>Voltar</a>
          </section>
        </div>
        <div className={styles.mainBg}/>
      </div>
  )
}

Home.getInitialProps = async (ctx) => {
  let isAuth = false;

  if(!ctx.req || !ctx.req.headers.cookie){
    return {isAuth};
  }

  try{
    await Api.get('/login', {headers: {cookie: ctx.req.headers.cookie}});
    isAuth = true;
    ctx.res.statusCode = 301;
    ctx.res.setHeader('location', '/dashboard');


  }catch (e) {

  }

  return {isAuth};
}

export default Home;
