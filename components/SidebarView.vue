<template>
    <nav class="dashboard-sidebar">
      <div class="sidebar-wrapper">
        <ul class="sidebar-menu">
          <li class="sidebar-item" v-for="item in menuItems" :key="item.title">
            <router-link :to="item.to" class="sidebar-link" @click="handleClick(item.title)">
              {{ formatTitle(item.title) }}
              <span class="category-agents">({{ totalAgentsByCategory[item.title] }} agents)</span>
              <svg class="sidebar-arrow" viewBox="0 0 10 10">
                <path d="M1 1l4 4 4-4"></path>
              </svg>
            </router-link>
          </li>
        </ul>
      </div>
    </nav> 
  </template>
  
  <script>
  export default {
    name: 'Sidebar',
    props: {
      menuItems: {
        type: Array,
        required: true,
      },
      totalAgentsByCategory: {
        type: Object,
        required: true,
      },
    },
    methods: {
      formatTitle(title) {
        return title.charAt(0).toUpperCase() + title.slice(1);
      },
      handleClick(title) {
        this.$emit('category-clicked', title);
      },
    },
  };
  </script>
  
  <style scoped>
  .dashboard-sidebar {
    margin-top: 60px;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    background-color: #375561;
    color: white;
    padding: 10px;
    overflow-y: auto;
  }
  
  .sidebar-wrapper {
    margin-bottom: 20px;
  }
  
  .sidebar-menu {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .sidebar-item {
    margin-bottom: 10px;
  }
  
  .sidebar-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: white;
    transition: background-color 0.3s;
  }
  
  .sidebar-link:hover {
    background-color: #417688;
  }
  
  .sidebar-arrow {
    width: 10px;
    height: 10px;
    margin-left: auto;
    fill: currentColor;
  }
  
  .category-agents {
    font-size: 14px;
    color: white;
  }
  </style>