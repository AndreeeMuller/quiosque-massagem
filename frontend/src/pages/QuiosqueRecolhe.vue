<template>
  <q-page padding>
    <q-form @submit="submit">
      <div class="row fit">
        <div class="col-12 q-pa-sm">
          <q-chip color="primary" text-color="white">
            {{ quiosqueRecolhe.quiosque }}
          </q-chip>
          <q-chip color="primary" text-color="white">
            {{ quiosqueRecolhe.dataInicioLabel }}
          </q-chip>
          <q-chip color="primary" text-color="white">
            {{ quiosqueRecolhe.horaInicio ? quiosqueRecolhe.horaInicio.substring(0, 5) : null }}
          </q-chip>
        </div>
        <div class="col-12 q-pa-sm">
          <q-input  v-model="quiosqueRecolhe.observacao"
                    type="textarea"
                    outlined
                    label="Observação sobre o recolhe"
                    :rules="[ val => val.length <= 1024 || 'Por favor, use no máximo 1024 caracteres']">
          </q-input>
        </div>
        <div class="col-12 q-pa-sm" v-for="cadeira in quiosqueRecolhe.cadeiras" :key="cadeira.idCadeira">
          <q-card flat bordered>
            <q-card-section class="bg-grey-1">
              <div class="text-h6">
                Cadeira
                <q-chip color="primary" text-color="white">
                  {{ cadeira.identificacao }}
                </q-chip>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="row fit">
                <div class="col q-pa-sm">
                  <q-input  v-model="cadeira.valorCadeira"
                            outlined
                            dense
                            label="Valor Atual da Cadeira (Visor)"
                            input-class="text-right"
                            mask="####"
                            :rules="[ val => val <= 9999 && val > 0 || 'Por favor, informe um valor entre 1 e 9999']">
                  </q-input>
                </div>
                <div class="col-auto q-pa-sm">
                  <q-btn  color="primary"
                          dense
                          style="margin-top: 3px;"
                          icon="camera"
                          @click="captureImage(cadeira, 'midia')">
                  </q-btn>
                </div>
                <div class="col-12 q-pa-sm" v-show="cadeira.midia">
                  <img class="full-width" :src="cadeira.midia">
                </div>
                <div class="col-12">
                  <q-list dense>
                    <q-expansion-item expand-separator label="Detalhes" dense>
                      <div class="row fit">
                        <div class="col-12 q-pa-sm">
                          <q-input  v-model="cadeira.valorEmperrado"
                                    outlined
                                    dense
                                    label="Valor Emperrado"
                                    input-class="text-right"
                                    mask="##">
                          </q-input>
                        </div>
                        <div class="col-12 q-pa-sm">
                          <q-input  v-model="cadeira.observacao"
                                    outlined
                                    dense
                                    label="Observação sobre a cadeira"
                                    :rules="[ val => val.length <= 1024 || 'Por favor, use no máximo 1024 caracteres']">
                          </q-input>
                        </div>
                      </div>
                    </q-expansion-item>
                  </q-list>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 q-pa-sm">
          <q-card flat bordered>
            <q-card-section class="bg-grey-1">
              <div class="text-h6">
                Check List
                <q-chip color="positive" text-color="white">
                  {{ checkList.filter(x => x.check).length }}/{{ checkList.length }}
                </q-chip>
              </div>
            </q-card-section>
            <q-separator />
            <div class="row fit">
              <div class="col-12 q-pa-sm">
                <q-checkbox v-for="check in checkList"
                            :key="check.label"
                            class="full-width"
                            color="positive"
                            left-label
                            v-model="check.check"
                            :label="check.label">
                </q-checkbox>
              </div>
            </div>
          </q-card>
        </div>
      </div>
      <q-footer elevated>
        <q-toolbar>
          <q-toolbar-title>
            <q-btn flat label="Finalizar Recolhe" type="submit" class="full-width"/>
          </q-toolbar-title>
        </q-toolbar>
      </q-footer>
    </q-form>
  </q-page>
</template>

<style>

.q-checkbox__label {
  width: 100%
}

</style>

<script>

import { Plugins, CameraResultType } from '@capacitor/core'

const { Camera } = Plugins

export default {
  name: 'QuiosqueRecolhe',
  data () {
    return {
      quiosqueRecolhe: {},
      checkList: [
        { label: 'Cadeiras Sem Nota Emperrada.', check: false },
        { label: 'Cadeiras Higienizadas.', check: false },
        { label: 'TV Funcionando.', check: false },
        { label: 'Quiosque Higienizado.', check: false },
        { label: 'Fotos Enviadas Legíveis.', check: false },
        { label: 'Valores Cadastrados Corretamente.', check: false }
      ]
    }
  },
  methods: {
    getByIdQuiosqueRecolhe (idQuiosqueRecolhe) {
      const vm = this

      // Busca o recolhe que está sendo solicitado
      vm.$q.loading.show()
      vm.$service.quiosqueRecolhe.getByIdQuiosqueRecolhe(idQuiosqueRecolhe)
        .then((response) => {
          vm.quiosqueRecolhe = vm.$service.responseDecode(response.data)
        })
        .catch((error) => {
          // Em caso de erro, exibe ao usuário
          vm.$q.notify({
            type: 'negative',
            message: 'Não foi possível manter conexão com o servidor. Por favor, entre em contato com o suporte. (' + error + ')',
            progress: true,
            position: 'top'
          })
        })
        .then(() => {
          vm.$q.loading.hide()
        })
    },
    submit () {
      const vm = this
      const payload = JSON.parse(JSON.stringify(vm.quiosqueRecolhe))

      // Verifica se todas as cadeiras possuem foto
      if (payload.cadeiras.filter(x => !x.midia).length === 0) {
        // Verifica se o checklist foi preenchido
        if (vm.checkList.filter(x => !x.check).length === 0) {
          payload.cadeiras.map((x) => {
            x.midia = null
            x.idQuiosqueRecolhe = payload.idQuiosqueRecolhe
          })
          // Finaliza o recolhe
          vm.$q.loading.show()
          vm.$service.quiosqueRecolhe.update(payload)
            .then((response) => {
              // Cadastra todas as cadeiras
              vm.$service.quiosqueRecolheCadeira.create({ quiosquesRecolhesCadeiras: payload.cadeiras })
                .then((response) => {
                  const quiosquesRecolhesCadeiras = response.data.body.quiosquesRecolhesCadeiras
                  // Processa as caderiras para enviar as imagens
                  quiosquesRecolhesCadeiras.forEach((quiosqueRecolheCadeira, index) => {
                    // # Envia a imagem da cadeira
                    const cadeira = vm.quiosqueRecolhe.cadeiras[index]
                    const blobData = vm.base64ToBlob(cadeira.midia.base64String, 'image/' + cadeira.midia.format)

                    vm.$q.loading.show()
                    vm.$service.midia.upload(blobData, cadeira.midia.format, 'QUIOSQUE_RECOLHE_CADEIRA', quiosqueRecolheCadeira.idQuiosqueRecolheCadeira)
                      .then((response) => {
                        // Se subiu a última cadeira com sucesso, exibe mensagem de sucesso e volta para a página do quiosque
                        if (quiosquesRecolhesCadeiras.length === (index + 1)) {
                          vm.$q.notify({
                            type: 'positive',
                            message: 'Recolhe finaliza com sucesso!',
                            progress: true,
                            position: 'top'
                          })
                          vm.$router.push({ name: 'Quiosque' })
                        }
                      })
                      .catch((error) => {
                        // Em caso de erro, exibe ao usuário
                        vm.$q.notify({
                          type: 'negative',
                          message: 'Não foi possível manter conexão com o servidor. Por favor, entre em contato com o suporte. (' + error + ')',
                          progress: true,
                          position: 'top'
                        })
                      })
                      .then(() => {
                        vm.$q.loading.hide()
                      })
                  })
                })
                .catch((error) => {
                  // Em caso de erro, exibe ao usuário
                  vm.$q.notify({
                    type: 'negative',
                    message: 'Não foi possível manter conexão com o servidor. Por favor, entre em contato com o suporte. (' + error + ')',
                    progress: true,
                    position: 'top'
                  })
                })
                .then(() => {
                  vm.$q.loading.hide()
                })
            })
            .catch((error) => {
              // Em caso de erro, exibe ao usuário
              vm.$q.notify({
                type: 'negative',
                message: 'Não foi possível manter conexão com o servidor. Por favor, entre em contato com o suporte. (' + error + ')',
                progress: true,
                position: 'top'
              })
            })
            .then(() => {
              vm.$q.loading.hide()
            })
        } else {
          // Caso o usuário não tenha preenchido o checklist
          vm.$q.notify({
            type: 'negative',
            message: 'Por favor, preencha o Check List.',
            progress: true,
            position: 'top'
          })
        }
      } else {
        // Caso o usuário não tenha enviado todas as fotos
        vm.$q.notify({
          type: 'negative',
          message: 'Por favor, verifique se todas as cadeiras possuem foto.',
          progress: true,
          position: 'top'
        })
      }
    },
    async captureImage (model, field) {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: true,
        resultType: CameraResultType.Base64
      })
      model[field] = image
    },
    base64ToBlob (base64Data, contentType = '', sliceSize = 512) {
      const byteCharacters = atob(base64Data)
      const byteArrays = []

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize)

        const byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }

      const blob = new Blob(byteArrays, { type: contentType })
      return blob
    }
  },
  mounted () {
    const vm = this

    if (vm.$route.params.idQuiosqueRecolhe) {
      vm.getByIdQuiosqueRecolhe(vm.$route.params.idQuiosqueRecolhe)
    }
  }
}
</script>
