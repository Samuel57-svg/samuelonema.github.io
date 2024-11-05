<template>
    <div class="pie-chart-container">
    <h3 class="chart-title">Répartition des agents par catégorie</h3>
    <canvas id="pie-chart"></canvas>
    <ul class="legend">
        <li v-for="(category, index) in agentCategories" :key="index">
        <span :style="{ backgroundColor: getCategoryColor(index) }"></span>
        {{ category }} ({{ totalAgentsByCategory[category] }})
        </li>
    </ul>
    </div>
</template>

<script>


</script>