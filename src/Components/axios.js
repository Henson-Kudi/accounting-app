import axios from 'axios'

const port = 'https://hk-solutions-accounting-app.herokuapp.com/'
const localhost = 'http://localhost:5000'

export const baseURL = axios.create({
    baseURL: localhost,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Origin': port
    },
})