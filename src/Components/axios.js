import axios from 'axios'

const port = 'https://hk-solutions-accounting-app.herokuapp.com/'

export const baseURL = axios.create({
    baseURL: port
})