import React, {useContext, useState, useEffect} from 'react'
import axios from 'axios'
import {baseURL} from '../Components/axios'
import {UserContext} from './userContext'

function useFetch(url, init) {
    const {user} = useContext(UserContext)
    const [data, setData] = useState(init)
    const [loader, setLoader] = useState(false)

    useEffect(()=>{
        let source = axios.CancelToken.source();
        let unMounted = false;
        fetchData(source, unMounted, url)

        return ()=>{
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [url])

    const fetchData = async(source, unMounted, url)=>{
        try {
            setLoader(true)
            const res = await baseURL.get(`/${url}`, {
                cancelToken: source.token,
                headers:{
                    'auth-token': user?.token
                },
            })
            setData(await res.data)
        } catch (error) {
            if (!unMounted) {
                if (axios.isCancel(error)) {
                console.log('Request Cancelled');
            }else{
                console.log('Something went wrong');
            }
            }
        }finally{setLoader(false)}
    }

    const refetchData = async()=>{
        try {
            setLoader(true);
            const {data} = await baseURL.get(`/${url}`, {
                headers:{
                    'auth-token': user?.token,
                    'content-type': 'application/json',
                    accept: '*/*',
                }
            })
            setData(data)
        } catch (error) {
            console.log(data);
        }finally{
            setLoader(false);
        }
    }

    return {
        data, loader, refetchData, setLoader
    }
}

export default useFetch
