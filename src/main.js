import Vue from 'vue'
import ElementUI from 'element-ui'
import '../theme/index.css'
import './assets/styles/index.scss'

import App from './App.vue'
import router from './router'
import store from './store'
import plugin from './plugin'
import VueCookies from "vue-cookies";

Vue.use(ElementUI)
Vue.use(plugin)
Vue.use(VueCookies);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

Array.prototype.Remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};