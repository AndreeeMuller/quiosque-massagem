<template>
  <q-page padding>
    <q-list bordered>
      <q-card v-for="quiosque in quiosques" :key="quiosque.idQuiosque">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">{{ quiosque.quiosque }}</div>
          <div class="text-subtitle2">Cadeiras: {{ quiosque.cadeiras.map(c => c.identificacao).join(', ') }}</div>
        </q-card-section>
        <q-card-actions align="around">
          <q-btn-group>
            <q-btn  icon-right="visibility"
                    color="primary"
                    outline>
            </q-btn>
            <q-btn  icon-right="edit"
                    color="positive"
                    outline>
            </q-btn>
            <q-btn  icon-right="delete_forever"
                    color="negative"
                    outline>
            </q-btn>
          </q-btn-group>
          <q-btn  @click="iniciarRecolhe(quiosque)"
                  icon-right="handyman"
                  color="primary"
                  outline>
            Iniciar Recolhe
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-list>
    <!-- <img src="http://localhost:3000/api/v1/midia/QUIOSQUE_RECOLHE_CADEIRA/16"> -->
  </q-page>
</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    return {
      quiosques: []
    }
  },
  methods: {
    getAll () {
      const vm = this

      // Busca os quiosques e suas cadeiras
      vm.$q.loading.show()
      vm.$service.quiosqueCadeira.getAll()
        .then((response) => {
          vm.quiosques = vm.$service.responseDecode(response.data)
        }).catch((error) => {
          vm.$q.notify({
            type: 'negative',
            message: 'Não foi possível manter conexão com o servidor. Por favor, entre em contato com o suporte. (' + error + ')',
            progress: true,
            position: 'top'
          })
        }).then(() => {
          vm.$q.loading.hide()
        })
    },
    iniciarRecolhe (quiosque) {
      const vm = this

      // Confirma a inicialização
      vm.$q.dialog({
        title: 'Confirmar',
        message: 'Tem certeza que deseja iniciar o recolhe em "' + quiosque.quiosque + '"?',
        ok: 'Iniciar',
        cancel: 'Cancelar'
      }).onOk(() => {
        // Cria o recolhe para o quiosque
        vm.$q.loading.show()
        vm.$service.quiosqueRecolhe.create(quiosque.idQuiosque)
          .then((response) => {
            // Chama a página de recolhe
            vm.$router.push({ name: 'QuiosqueRecolhe', params: { idQuiosque: quiosque.idQuiosque, idQuiosqueRecolhe: response.data.body.idQuiosqueRecolhe } })
          }).catch((error) => {
            // Em caso de erro, exibe ao usuário
            vm.$q.notify({
              type: 'negative',
              message: 'Não foi possível manter conexão com o servidor. Por favor, entre em contato com o suporte. (' + error + ')',
              progress: true,
              position: 'top'
            })
          }).then(() => {
            vm.$q.loading.hide()
          })
      })
    }
  },
  mounted () {
    const vm = this

    vm.getAll()
  }
}
</script>
