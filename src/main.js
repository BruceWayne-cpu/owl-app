import Vue from 'vue'
import VueTouch from 'vue-touch';
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import { Plugins } from '@capacitor/core'

Vue.use(VueTouch);

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
