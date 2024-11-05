<template>
    <header class="dashboard-header">
      <div class="logo-wrapper">
        <img src="/snel.png" alt="Logo IFolder">
        <span class="company-name">IFolder</span>
      </div>
      <div class="logout-button-wrapper">
        <button class="logout-button" @click="handleLogout">Se déconnecter</button>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: 'Header',
    methods: {
      handleLogout() {
        localStorage.removeItem('isAuthenticated');
        this.$router.push({ name: 'HelloWorld' });
      },
    },
  };
  </script>
  
  <style scoped>
  .dashboard-header {
    background-color: #333;
    color: white;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  
  .logo-wrapper {
    display: flex;
    align-items: center;
  }
  
  .logo-wrapper img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
  
  .logout-button-wrapper {
    margin-left: auto;
  }
  </style>