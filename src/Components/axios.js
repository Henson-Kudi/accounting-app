import axios from 'axios'

const PORT = 'https://hk-solutions-accounting-app.herokuapp.com/'

export const baseURL = axios.create({
    baseURL: 'http://localhost:5000'
})