import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Uses env var
  withCredentials: true // Optional: if you're using cookies/sessions
});

export default instance;
