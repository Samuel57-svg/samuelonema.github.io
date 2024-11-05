<template>
  <div id="app">
    <router-view ></router-view>
  </div>
</template>

<script>
// app.js
/**
 * code by @louxisam
 * 24/02/2024
 *
 *
 *  Ce code est écrit en JavaScript et il s'agit du fichier app.js
 *  qui execute l'ensemble du code vue.js de l'application web et lance le serveur vue cli sur le port 8080 
 *  par défaut.
 */
window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle.js'); 

//import HelloWorld from './components/HelloWorld.vue'
//import DossierView from './components/DossierView.vue'
//import DocumentView from './components/DocumentView.vue'

//import { apiUrls } from '@/config';  Chemin d'importation à ajuster selon votre structure de projet


export default {
  name: 'App',
  data() {
    return {
      isAuthenticated: localStorage.getItem('isAuthenticated') === 'true'
    };
  },
  
  methods: {
    handleAuthenticated() {
      localStorage.setItem('isAuthenticated', true);
      this.isAuthenticated = true;
    }
  }
};


</script>

<style>

#app {
    /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
    font-family: 'Dosis', sans-serif;
    /*font-family: 'Poppins', sans-serif; */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 0;
    padding: 0;
  }
</style>