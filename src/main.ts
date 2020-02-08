import Vue from 'vue'
import App from './App.vue'
import CompositionApi from '@vue/composition-api'
import './registerServiceWorker'

import ECont from '@/components/core/ECont.vue'

Vue.config.productionTip = false
Vue.use(CompositionApi)
Vue.component('ECont', ECont)

new Vue({
  render: h => h(App)
}).$mount('#app')
