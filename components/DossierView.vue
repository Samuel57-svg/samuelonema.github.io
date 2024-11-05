<template>
  <div class="dossier-view-container">
    <header class="dashboard-header fixed-header">
      <div class="logo-wrapper">
        <img src="/snel.png" alt="Logo IFolder">
        <span class="company-name">IFolder</span>
      </div>

      <div class="logout-button-wrapper">
        <button class="logout-button" @click="handleLogout">Se déconnecter</button>
      </div>
    </header>

    <nav class="dashboard-sidebar">
      <div class="sidebar-wrapper">
        <!-- Titre Dashboard cliquable -->
        <button class="dashboard-title" @click="goBack">Dashboard</button>
        <ul class="sidebar-menu">
          <li class="sidebar-item" v-for="item in menuItems" :key="item.title">
            <router-link :to="`/agents/${this.$route.params.id}/${item.title}`" class="sidebar-link" @click="handleClick(item.title)">
              {{ formatTitle(item.title) }}
              <span class="category-agents">({{ totalAgentsByCategory[item.title] }} agents)</span>
              <svg class="sidebar-arrow" viewBox="0 0 10 10">
                <path d="M1 1l4 4 4-4"></path>
              </svg>
            </router-link>
          </li>
        </ul>
      </div>
          <!-- Icône de changement de compte -->
    <div class="change-account-wrapper" @click="redirectToViewAgent">
      <i class="far fa-folder"></i> <!-- Icône de changement de compte -->
      Voir les dossiers
    </div>
    </nav>

    <main class="main-content">
      <h1 class="dossier-title">Échelon : {{ formatTitle(selectedCategory) }}</h1>

      <div class="filters-container">
        <input type="text" v-model="search" placeholder="Rechercher par nom ou matricule" class="form-control">
        <select v-model="selectedFonction" class="form-select">
          <option value="">Toutes les fonctions</option>
          <option v-for="fonction in fonctions" :key="fonction" :value="fonction">{{ fonction }}</option>
        </select>
      </div>

      <div class="table-container">
        <table class="table table-bordered"> 
          <thead>
            <tr>
              <th scope="col">Matricule</th>
              <th scope="col">Grade</th>
              <th scope="col">Nom</th>
              <th scope="col">Post-nom</th>
              <th scope="col">Fonction</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in filteredEmployees" :key="employee.agentID" @click="goToDocumentView(employee)" :class="{ 'row-clicked': clickedRows[employee.agentID] }">
              <td >{{ employee.agentID }}</td>
              <td>{{ employee.Grade ? employee.Grade.grade_name : "Unknown"}}</td>
              <td>{{ employee.nom }}</td>
              <td>{{ employee.last_name }}</td>
              <td>{{ employee.fonction }}</td>
              
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  inject: ['apiUrls'],
  name: 'DossierView',
  data() {
    return {
      employees: [],
      search: '',
      selectedFonction: '',
      
      clickedRows: {},
      menuItems: [],
      totalAgentsByCategory: {},
      currentCategory: null,
      agentCategories: [],
      agent: null,
      totalAgents: 0,
      totalDocuments: 0,
    };
  },
  watch: {
    // Surveillez les changements de la catégorie sélectionnée
    '$route.params.name_category'(nameCategory) {
      // Appelez la méthode pour changer la catégorie
      this.changeCategory(nameCategory);
    }
  },

  beforeRouteUpdate(to, from, next) {
    // Récupérer le paramètre name_category de la nouvelle route
    const nameCategory = to.params.name_category;

    // Charger les données en fonction de la nouvelle route
    this.fetchAgentCategory(nameCategory);

    next();
  },
  computed: {
    selectedCategory() {
      return this.$route.params.name_category;
    },
    filteredEmployees() {
      let filtered = this.employees.slice(0, this.visibleRows);
      
      // Filtrer par nom ou par Agent ID
      if (this.search) {
        filtered = filtered.filter(employee => {
          const searchValue = this.search.toLowerCase();
          return (
            employee.nom.toLowerCase().includes(searchValue) ||
            employee.agentID.toLowerCase().includes(searchValue)
          );
        });
      }
      
      // Filtrer par département ou fonction
      if (this.selectedFonction) {
        filtered = filtered.filter(employee => employee.fonction === this.selectedFonction);
      }
      
      return filtered;
    },
    fonctions() {
      return [...new Set(this.employees.map(employee => employee.fonction))];
    },
  },
  methods: {
    redirectToViewAgent() {
      // Utilisez le routeur Vue Router pour pousser vers le composant DocumentViewAgent.vue
      this.$router.push({ name: 'ViewAgent' });
    },

    async changeCategory(category) {
      // Charger les données des employés en fonction de la nouvelle catégorie
      await this.fetchAgentCategory(category);
      // Réinitialiser le filtre de recherche et la fonction sélectionnée
      this.search = '';
      this.selectedFonction = '';
    },
    /*
    showMoreRows() {
      // Basculez la valeur entre true et false à chaque clic
      this.showAllRows = !this.showAllRows;
      if (this.showAllRows) {
        this.visibleRows = this.employees.length;
      } else {
        this.visibleRows = 10;
      }
    }, */
    getGradeName(gradeID) {
      const employee = this.employees.find(employee => employee.gradeID === gradeID);
      return employee && employee.Grade ? employee.Grade.grade_name : 'Unknown';
    },
    formatTitle(title) {
      // Formater la chaîne de caractères pour avoir la première lettre en majuscule
      const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);
      return formattedTitle;
    },
    goToDocumentView( employee) {
      this.clickedRows[employee.agentID] = true;

      this.$router.push({ 
        name: 'DocumentView', 
        params: { 
          id: this.$route.params.id,
          name_category: this.$route.params.name_category,
          name: employee.nom 
        } 
      });
    },
    goBack() {
    this.$router.push({ name: 'DashBoard' });
    },
    handleLogout() {
      localStorage.removeItem('isAuthenticated');
      this.$router.push({ name: 'HelloWorld' });
    },
    handleClick(category) {
      this.currentCategory = category; // Enregistre la catégorie actuellement cliquée
    },
    async fetchAgentCategory(name_category) {
      const url = this.apiUrls+'/agents'; // URL pour récupérer tous les agents
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          this.employees = data.filter(employee => employee.Grade.Category.name_category === name_category);
          console.log(this.employees); // Vérifiez si les agents sont correctement filtrés
        } else {
          console.error('Erreur lors de la récupération des données:', response.statusText);
        }
      } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des données:', error);
      }
    },
    async fetchAgentData(id) {
      const apiUrl = this.apiUrls+`/agents/${id}`;
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const agentData = await response.json();
          this.agent = agentData;
        
        } else {
          console.error('Erreur lors de la récupération des données de l\'agent :', response.statusText);
        }
      } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des données de l\'agent :', error);
      }
    },
    async fetchManagerData(id) {
      const apiUrl = this.apiUrls+`/gerer/manager/${id}`;
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const managerData = await response.json();
          console.log("Données du manager :", managerData);
          
          // Récupérer les name_category
          const nameCategories = managerData.map(manager => manager.Category.name_category);
          console.log("cest :", nameCategories)
          this.agentCategories = nameCategories;

          
          // Créer les menuItems en utilisant les name_category
          this.menuItems = nameCategories.map(category => ({
            title: category,
            to: `/agents/${id}/${category}`
          })); 
          // Initialiser la variable temporaire
          let totalAgents = 0;
          for (const category of nameCategories) {
            const apiUrl = this.apiUrls+`/agents?category=${category}`;
            try {
              const response = await fetch(apiUrl);
              if (response.ok) {
                const agents = await response.json();

                // Filtrer les agents en fonction de la catégorie
                const filteredAgents = agents.filter(agent => agent.Grade.Category.name_category === category);

                this.totalAgentsByCategory[category] = filteredAgents.length;

                // Ajouter le total de la catégorie à la variable temporaire
                totalAgents += filteredAgents.length;
              } else {
                console.error(`Erreur lors de la récupération du nombre d'agents pour la catégorie ${category}:`, response.statusText);
              }
            } catch (error) {
              console.error(`Une erreur s'est produite lors de la récupération du nombre d'agents pour la catégorie ${category}:`, error);
            }
          }
          this.totalAgents = totalAgents;
              
        } else {
          console.error("Erreur lors de la récupération des données du manager :", response.statusText);
        }
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de la récupération des données du manager :",
          error
        );
      } 
    }, 
  },
  mounted() {
   
    const name_category = this.$route.params.name_category;
    this.fetchAgentCategory(name_category);

  },
  created() {
    const id = this.$route.params.id;
    this.fetchAgentData(id);
    this.fetchManagerData(id);
  }
/*
  async mounted() {
  const nameCategory = this.$route.params.name_category;
  console.log(nameCategory); // Affiche le paramètre name_category dans la console

  const url = this.apiUrls+'/agents'; // URL pour récupérer tous les agents
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      this.employees = data.filter(employee => employee.Grade.Category.name_category === nameCategory);
      console.log(this.employees); // Vérifiez si les agents sont correctement filtrés
    } else {
      console.error('Erreur lors de la récupération des données:', response.statusText);
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des données:', error);
  }
}, */
};
</script>

  
<style scoped>
.dossier-view-container {
  display: flex;
  flex-direction: column;
  position: relative; /* Permet d'utiliser position: fixed sur les enfants */
  font-family: 'Dosis', sans-serif;
  /*font-family: 'Poppins', sans-serif; */
}
.dashboard-sidebar {
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  z-index: 1;
  display: block;
  background-color: #333;
  color: #fff;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 30px;
  transition: all 0.3s cubic-bezier(0.685, 0.0473, 0.346, 1);
  width: 260px;
  box-shadow: 4px 0 20px -5px rgba(0, 0, 0, 0.6);
}
.change-account-wrapper {
  position: absolute; /* Position absolue pour l'icône */
  bottom: 0; /* Placer en bas de la sidebar */
  left: 0; /* Alignement à gauche */
  width: 100%; /* Largeur totale de la sidebar */
  padding: 10px; /* Espacement autour de l'icône */
  background-color: #333; /* Couleur de fond de l'icône */
  cursor: pointer; /* Curseur pointer au survol */
}

.change-account-wrapper i {
  margin-right: 5px; /* Espacement entre l'icône et le texte */
}

.change-account-wrapper:hover {
  background-color: #555; /* Changement de couleur au survol */
}

.dashboard-sidebar::-webkit-scrollbar {
  width: 6px;
}
.dashboard-sidebar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}

.dashboard-sidebar .nav .nav-item {
  margin-bottom: 4px;
}

.dashboard-sidebar .nav .nav-item .nav-link {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 15px;
  color: #fff;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.685, 0.0473, 0.346, 1);
}

.dashboard-sidebar .nav .nav-item .nav-link .badge {
  position: absolute;
  right: 10px;
  padding: 2px 5px;
  border-radius: 50%;
  font-size: 0.75rem;
}

.dashboard-sidebar .nav .nav-item .nav-link.active {
  background-color: rgba(255, 255, 255, 0.1);
}

.dashboard-sidebar .nav .nav-item .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.dashboard-sidebar .logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  font-size: 20px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.2);
}

.dashboard-sidebar .logo img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.dashboard-sidebar .nav-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 0 15px;
  color: rgba(255, 255, 255, 0.5);
}

.dashboard-sidebar .nav-title span {
  display: block;
  
}

.dashboard-sidebar .divider {
  margin: 0 15px;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
}

.dashboard-sidebar .user-info {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 15px;
  border-radius: 0 25px 25px 0;
  background-color: rgba(0, 0, 0, 0.2);
  
}

.dashboard-sidebar .user-info img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.dashboard-sidebar .user-info .username {
  margin-top: 10px;
  font-size: 1rem;
}

.dashboard-sidebar .sidebar-background {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
}

.dashboard-sidebar.sidebar-mini .sidebar-wrapper {
  padding-left: 0;
}

.dashboard-sidebar.sidebar-mini .logo {
  padding: 10px;
}

.dashboard-sidebar.sidebar-mini .nav-item .nav-link {
  padding-left: 15px !important;
  padding-right: 15px !important;
}

.dashboard-sidebar.sidebar-mini .nav-title {
  display: none;
}

.dashboard-sidebar.sidebar-mini .divider {
  display: none;
}

.dashboard-sidebar.sidebar-mini .user-info {
  padding: 20px;
}

.dashboard-sidebar.sidebar-mini .user-info img {
  width: 30px;
  height: 30px;
}

.dashboard-sidebar.sidebar-mini .user-info .username {
  display: none;
}
.dashboard-title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 20px;
  color: white;
  background-color: transparent;
  border: none;
  cursor: pointer; /* Ajoutez un style de curseur pointer */
  padding: 10px; /* Ajoutez un padding pour améliorer l'interaction */
  display: inline-block; /* Assurez-vous que le lien agit comme un bouton */
}

.dashboard-title:hover {
  background-color: rgba(255, 255, 255, 0.1); /* Ajoutez un fond de couleur au survol */
}
.sidebar-arrow {
  width: 10px;
  height: 10px;
  margin-left: auto;
  fill: currentColor;
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
.category-agents {
  font-size: 14px;
  color: #da4848;
  
}
.category-name {
  
  font-weight: bold;
}
.category-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}
.category-title::marker {
  display: none;
}
.category-wrapper {
  margin-bottom: 20px;
}

.category-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.category-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.dashboard-header {
  background-color: #333;
  color: white;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.fixed-header {
  position: sticky;
  top: 0;
  z-index: 100;
  /* Ajoutez les autres styles nécessaires pour le header */
}
/* Styles pour la main-content */
.main-content {
  margin-left: 300px; /* Laisse de l'espace pour la sidebar */
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.logo-wrapper {
  display: flex;
  align-items: center;
}
.d-flex  {
  display: flex;
  align-items: center;
  margin-right: auto;
}
.logo-wrapper img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.row-clicked {
  background-color: #3c77af; /* Couleur de fond de la ligne cliquée */
  transition: background-color 0.3s; /* Transition pour rendre l'effet plus fluide */
}
.company-name {
  font-size: 24px;
  font-weight: bold;
}
.logout-button-wrapper {
  align-self: center;
}

.logout-button {
  padding: 8px 16px;
  font-size: 16px;
  background-color: #ff0000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #cc0000;
}
.dossier-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.filters-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.form-control {
  padding: 8px;
  margin: 5px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 440px;
}

.table-container {
  width: 100%;
  
}

.table {
  width: 100%;
  /*border-collapse: separate; */
  border-spacing: 0;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 20px;
  border-collapse: collapse;
}

th {
  background-color: #f3f3f3;

}

td, th { 
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0; 
} 

tr:nth-child(even) {
  background-color: #f9f9f9;
}
tr:hover {
  background-color: #f5f5f5;
}
/* Supprimez la bordure en bas de la dernière ligne pour éviter le double trait */
tr:last-child td, tr:last-child th {
  border-bottom: none;
}

td {
  color: #333;
}

th, td { /*
  text-align: center; */
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}


.btn-primary {
  background-color: #007bff;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #0069d9;
}
</style>