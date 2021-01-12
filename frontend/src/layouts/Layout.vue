<template>
  <q-layout view="hHh lpR fFf" class="admin">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />
        <q-toolbar-title>
          {{ paginas.filter(pagina => pagina.name === $route.name)[0].label }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer show-if-above v-model="left" side="left" bordered>
      <q-list bordered padding class="rounded-borders text-primary">
        <q-item v-for="pagina in paginas.filter(x => x.visible)" :key="pagina.name"
                :to="{ name: pagina.name }"
                clickable
                v-ripple
                active-class="paginaAtual"
                :active="$route.name === pagina.name">
          <q-item-section avatar>
            <q-icon :name="pagina.icon" />
          </q-item-section>
          <q-item-section>{{ pagina.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'Layout',
  data () {
    return {
      left: false,
      paginas: [
        { label: 'Dashboard', icon: 'dashboard', name: 'Dashboard', visible: true },
        { label: 'Quiosque', icon: 'business', name: 'Quiosque', visible: true },
        { label: 'Quiosque Recolhe', icon: 'business', name: 'QuiosqueRecolhe', visible: false }
      ]
    }
  }
}
</script>
