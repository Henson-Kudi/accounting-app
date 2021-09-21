import axios from 'axios'

const port = process.env.BACKEND_API

export const baseURL = axios.create({
    baseURL: port,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Origin': 'http://localhost:5000'
    },
})