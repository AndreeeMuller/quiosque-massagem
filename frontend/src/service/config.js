import axios from 'axios'

export const http = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    Authorization: process.env.API_AUTHORIZATION
  }
})
