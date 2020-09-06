import axios from 'axios';
import Cookies from 'universal-cookie';

let cookies = '';
try{
  cookies = document.cookie;
}catch (e){

}

export default axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
    cookie: cookies
  },
  withCredentials: true
});