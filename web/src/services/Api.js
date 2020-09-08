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

export {Api};