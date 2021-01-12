/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */
import { http } from './config'

export default {

    getAll () {
        return http.get('v1/quiosque/cadeira/all')
    },

    create (payload) {
        return http.post('v1/quiosque/cadeira', payload)
    },

    delete (payload) {
        return http.delete('v1/quiosque/cadeira', { data: payload })
    }
}
