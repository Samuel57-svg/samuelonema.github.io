import { createApp } from 'vue'
import App from './App.vue'
import router from './router/';
import '@fortawesome/fontawesome-free/css/all.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { apiUrls } from './config.js'; 


createApp(App)
  .use(router)
  .use(VueSweetalert2)
  .provide('apiUrls', apiUrls) // Fournissez l'apiUrl comme variable globale
  .mount('#app');