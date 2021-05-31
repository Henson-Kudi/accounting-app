import axios from 'axios'

const PORT = process.env.PORT || 'http://localhost:5000'

export const baseURL = axios.create({
    baseURL: PORT
})