/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */
import { http } from './config'

const getFormData = (blobData, ext) => {
    const formData = new FormData()
    formData.append('file', blobData, ext)
    return formData
}

export default {

    get (type, id) {
        return http.get('v1/midia/' + type + '/' + id)
    },

    upload (blobData, ext, type, id) {
        return http.post('v1/midia/' + type + '/' + id, getFormData(blobData, ext))
    }

}
