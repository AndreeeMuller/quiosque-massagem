/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */
import { http } from './config'

export default {

    getList (payload) {
        return http.get('v1/quiosque', { params: payload })
    },

    getAll () {
        return http.get('v1/quiosque/getAll')
    },

    create (payload) {
        return http.post('v1/quiosque', payload)
    },

    update (payload) {
        return http.put('v1/quiosque', payload)
    },

    delete (payload) {
        return http.delete('v1/quiosque', { data: payload })
    }
}
