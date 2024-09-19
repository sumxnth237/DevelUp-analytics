import axios from 'axios';

const api = axios.create({
// <<<<<<< development
//   baseURL: 'https://devel-up-analytics-backend.vercel.app/api', // your backend 
// =======
  baseURL: 'https://devel-up-analytics-backend.vercel.app/api', // your backend URL
// >>>>>>> main
});

export default api;
