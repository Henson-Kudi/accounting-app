import axios from 'axios'

const server = process.env.REACT_APP_SERVER


export const baseURL = axios.create({
    baseURL: server,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Origin': server
    },
})