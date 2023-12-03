import { useAuth } from "@/stores/auth"
import { storeToRefs } from 'pinia'
import api from "./api"
export const searchUsers = (searchString : string,  callback: (users: any[]) => void) =>{
    const auth = storeToRefs(useAuth())
    const searchParams = new URLSearchParams()
    searchParams.append('email', searchString)
    searchParams.append('name', searchString)
    api.get(`/users?${searchParams.toString()}`, {
        headers:{
            Authorization: `Bearer ${auth.token.value}`
        }
    })
    .then(({data}) => Array.isArray(data) && callback(data))
    .catch(console.error)
}