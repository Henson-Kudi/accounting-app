import React, {createContext, useState, useEffect} from "react";
import jwt_decode from "jwt-decode"
import {baseURL} from '../Components/axios'


export const  UserContext = createContext({})

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

setTimeout(() => {
    refereshToken()
}, 720000);

const refereshToken = async()=>{
    const {data} = await baseURL.get('/users/refresh-auth-token')
    setUser(data)
    return data
}




    return (
        <UserContext.Provider value={{user, login, setUser, refereshToken}}>
            {children}
        </UserContext.Provider>
    )
}
