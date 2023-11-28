import axios from  'axios';

const BASE_URL = import.meta.env.API_URL || 'http://localhost:3000'
const api = axios.create({
    baseURL: BASE_URL
})
export default api;