import React, {createContext, useState, useEffect} from "react";
import {baseURL} from './axios'


export const  UserContext = createContext()

export const UserProvider = ({children})=>{
    const [user, setUser] = useState({
    auth: false,
    token: null,
    userName: null,
    userEmail: null,
    userID: null,
})

const login = (data)=>{
    setUser(data)
}

useEffect(() => { 
    refereshToken()
}, [])

const refereshToken = async()=>{
    const {data} = await baseURL.get('/users/refresh-auth-token')
    setUser(data)
}

setTimeout(()=>{
    refereshToken()
}, 720000)

    return (
        <UserContext.Provider value={{user, login}}>
            {children}
        </UserContext.Provider>
    )
}
