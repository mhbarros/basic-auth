import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const Api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

Api.interceptors.response.use((r) => {return r}, error => {
  if(error.response.status === 403){
    document.location = '/';
  }

  return error;
});

export {Api};