import { defineStore } from 'pinia'
import { ref } from 'vue';
import api from '../services/api'
export const useAuth = defineStore('auth', () => {
    const token = ref<string | null | undefined>(localStorage.getItem('token'))
    const user = ref<any>(localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')!))

    function setToken(_token?: string|null) {
        token.value = _token;
        api.defaults.headers.common.Authorization = `Bearer ${token.value}`
        if(_token){
            localStorage.setItem('token', _token ?? null);
        }else {
            localStorage.removeItem('token')
        }
    }
    function setUser(_user?: Object | null) {
        user.value = _user;
        if(_user){
            localStorage.setItem('user', JSON.stringify(_user))
        } else {
            localStorage.removeItem('user')
        }
    }
    async function check() {
        console.log(token)
        const { data } = await api.get('/profile', {
            headers:{
                Authorization: `Bearer ${token.value}`
            }
        });
    }
    return {
        setToken,
        setUser,
        check,
        user,
        token
    }
})