import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import { Plugins } from '@capacitor/core'
const { SplashScreen } = Plugins

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App),
  mounted() {
    SplashScreen.hide()
  }
}).$mount('#app')
