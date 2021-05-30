import axios from 'axios'

export const baseURL = axios.create({
    baseURL: 'https://hk-solutions-accounting-app.herokuapp.com/'
})