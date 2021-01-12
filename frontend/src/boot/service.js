// import something here
import midia from '../service/midia'
import quiosque from '../service/quiosque'
import quiosqueCadeira from '../service/quiosqueCadeira'
import quiosqueRecolhe from '../service/quiosqueRecolhe'
import quiosqueRecolheCadeira from '../service/quiosqueRecolheCadeira'
import crypto from 'crypto-js'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default async ({ Vue }) => {
  Vue.prototype.$service = {
    midia,
    quiosque,
    quiosqueCadeira,
    quiosqueRecolhe,
    quiosqueRecolheCadeira
  }
  Vue.prototype.$service.responseDecode = function (response) {
    const bytes = crypto.AES.decrypt(response, process.env.RESPONSE_DECODE_KEY)
    return JSON.parse(bytes.toString(crypto.enc.Utf8))
  }
}
