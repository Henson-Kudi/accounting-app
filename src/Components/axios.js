import axios from 'axios'

const server = process.env.REACT_APP_SERVER
const localhost = process.env.REACT_APP_LOCAL_HOST

export const baseURL = axios.create({
    baseURL: server,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Origin': server
    },
})