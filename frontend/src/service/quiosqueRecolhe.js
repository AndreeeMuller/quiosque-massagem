/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */
import { http } from './config'

export default {

    getByIdQuiosqueRecolhe (idQuiosqueRecolhe) {
        return http.get('v1/quiosque/recolhe/' + idQuiosqueRecolhe)
    },

    create (idQuiosque) {
        return http.post('v1/quiosque/' + idQuiosque + '/recolhe')
    },

    update (payload) {
        return http.put('v1/quiosque/recolhe/' + payload.idQuiosqueRecolhe, payload)
    }

}
