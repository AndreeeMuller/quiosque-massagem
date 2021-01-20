import axios from 'axios'

export const http = axios.create({
  baseURL: 'https://quiosquemassagem.rj.r.appspot.com/api/',
  headers: {
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkVXN1YXJpbyI6MSwidXN1YXJpbyI6ImFkbWluIn0sImlhdCI6MTYxMDAyNjI4OSwiZXhwIjoxOTcwMDIyNjg5fQ.d9Y1p3z8x5NAQiY6_4lyR6H0Ayu72Kp6udRyY2RQedk'
  }
})
