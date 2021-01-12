// import something here

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default async ({ Vue }) => {
  Vue.filter('formatCnpj', function (value) {
    value = typeof value !== 'string' ? value.toString() : value
    value = value.padStart(14, '0')
    value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    return value
  })
  Vue.filter('formatCpf', function (value) {
    value = typeof value !== 'string' ? value.toString() : value
    value = value.padStart(11, '0')
    value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    return value
  })
}
