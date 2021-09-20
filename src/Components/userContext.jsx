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
    await baseURL.get('/refresh-auth-token')
        .then(async res => {
            const data = await res.data
            setUser(data)
        })
}

setTimeout(()=>{
    refereshToken()
}, 1000 * 60 * 9.5)

    return (
        <UserContext.Provider value={{user, login}}>
            {children}
        </UserContext.Provider>
    )
}
