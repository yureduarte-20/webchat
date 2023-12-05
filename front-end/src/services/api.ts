import axios from  'axios';

const BASE_URL = import.meta.env.API_URL || 'http://' + window.location.host + '/api'
console.log(BASE_URL)
const api = axios.create({
    baseURL: BASE_URL
})
export default api;