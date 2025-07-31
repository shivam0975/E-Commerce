import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Add token to headers
api.interceptors.request.use(config => {
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  if(userInfo && userInfo.token){
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
}, error => Promise.reject(error));

export default api;