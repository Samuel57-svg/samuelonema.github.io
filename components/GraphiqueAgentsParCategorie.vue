<template>
<div class="graphique-agents-par-categorie">
    <canvas ref="barChartCanvas" width="400" height="400"></canvas>
    <p v-for="(count, category) in totalAgentsByCategory" :key="category">
      Catégorie: {{ category }}, Nombre d'agents: {{ count }}
    </p>
  </div>
  </template>
  
  <script>
  import { Bar } from 'vue-chartjs';
  
  export default {
    extends: Bar,
    props: {
      totalAgentsByCategory: Object
    },
    mounted() {
      this.renderChart({
        labels: Object.keys(this.totalAgentsByCategory),
        datasets: [
          {
            label: 'Nombre d\'agents par catégorie',
            data: Object.values(this.totalAgentsByCategory),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
      }, {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      });
    }
  };
  </script>
  
  
  <style scoped>
  .graphique-agents-par-categorie {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  </style>
  