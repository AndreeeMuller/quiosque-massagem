/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */
import { http } from './config'

export default {

    create (payload) {
        return http.post('v1/quiosque/recolhe/cadeira', payload)
    },

    update (payload) {
        return http.put('v1/quiosque/recolhe/cadeira', payload)
    }

}
