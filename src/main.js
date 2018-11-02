import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import store from './store';

Vue.use(Vuetify, {
  theme: {
    primary: '#1E88E5',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  }
});

Vue.config.productionTip = false;

// Setup axios to be available globally through Vue
Vue.axios = Vue.prototype.$http = axios.create({
  baseURL: 'https://309bxpg45b.execute-api.eu-west-1.amazonaws.com/latest/api'
  // baseURL: 'http://localhost:30
});

new Vue({
  router,
  render: (h) => h(App),
  store
}).$mount('#app');
