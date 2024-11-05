
<template>
    <main>
        <header class="dashboard-header">
            <div class="logo-wrapper">
                <img src="/snel.png" alt="Logo IFolder">
                <span class="company-name">IFolder</span>
            </div>
            
            <div class="logout-button-wrapper">
                <button class="logout-button" @click="handleLogout">Se déconnecter</button>
            </div>
        </header>
        <div class="dashboard-admin">
            <!-- Contenu principal -->
            <div class="main-content ">
                <div class="containers">
                    <div class="card" style="width: 20%">
                        <div class="card-header">liste de gestionnaire</div>
                        <div class="card-body">
                            <ul class="list-group">
                                <li class="list-group-item" v-for="manager in managers" :key="manager.agentID">
                                    {{ manager.nom }} {{ manager.last_name }}
                                    <button type="button" class="btn btn-primary btn-sm" @click="openEditModal(manager)">
                                        <span class="glyphicon glyphicon-edit"></span> Editer
                                    </button>
                                </li>
                            </ul>
                            <!-- Balise HTML pour créer de l'espace -->
                            <div class="space-div"></div>
                            <!-- Nouvelle section pour afficher les détails de l'agent spécifié -->
                            <div v-if="agentDetails" class="agentDetails mt-3">
                                <p><strong>ADMIN:</strong> {{ agentDetails.nom }}  {{ agentDetails.last_name }}</p>
                                
                            </div>
                        </div>
                           <!-- Modal de modification -->
                            <div class="modal fade" id="editManagerModal" tabindex="-1" aria-labelledby="editManagerModalLabel" aria-hidden="true"  >
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="editManagerModalLabel">Modifier le gestionnaire</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            <form @submit.prevent="updateManager">
                                                <div class="mb-3">
                                                    <label for="managerName" class="form-label">Nom</label>
                                                    <input type="text" class="form-control" id="managerName" v-model="editedManager.nom" disabled>
                                                </div>
                                                <div class="mb-3">
                                                    <label for="managerLastName" class="form-label">Last Name</label>
                                                    <input type="text" class="form-control" id="managerLastName" v-model="editedManager.last_name" disabled>
                                                </div>
                                                <div class="mb-3">
                                                    <label for="managerFunction" class="form-label">Fonction</label>
                                                    <input type="text" class="form-control" id="managerFunction" v-model="editedManager.fonction" disabled>
                                                </div>
                                                
                                                <!-- Afficher les catégories disponibles avec des cases à cocher -->
                                                <div v-for="category in categories" :key="category.categoryID">
                                                    <label>
                                                        <input type="checkbox" :value="category.categoryID" v-model="editedManagerCategories">
                                                        {{ category.name_category }}
                                                    </label>
                                                </div>
                                                <button type="submit" class="btn btn-primary" @click="saveChanges(editedManager.agentID)">Sauvegarder</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>

                    <div class="card" >
                        <div class="card-header">Liste des agents</div>
                        <div class="card-body">
                            <div class="table-wrapper" ref="tableWrapper">
                                <!-- Champ de recherche -->
                                <div class="input-group mb-3" style="margin-left: 35px; width: 350px;">
                                    <input type="text" v-model="searchText" placeholder="Rechercher " class="form-control">
                                    <button class="btn btn-primary" @click="refreshAgents">Actualiser</button>
                                </div>

                            <table
                                id="mytable"
                                class="table table-bordred table-striped"
                            >
                                <thead>
                                    <th>
                                        <input
                                            type="checkbox"
                                            id="checkall"
                                        />
                                    </th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>fonction</th>
                                    <th>Username</th>
                                    <th>Echelon</th>
                                    <th>Edit</th>

                                    <th>Delete</th>
                                </thead>
                                <tbody>
                                    <tr v-for="agent in agents" :key="agent.agentID">
                                        <td>
                                            <input type="checkbox" class="checkthis">
                                        </td>
                                        <td>{{ agent.nom }}</td>
                                        <td>{{ agent.last_name }}</td>
                                        <td>{{ agent.fonction }}</td>
                                        <td>{{ agent.username }}</td>
                                        <td>{{ agent.Grade.Category.name_category }}</td>
                                        <td>
                                            <p data-placement="top" data-toggle="tooltip" title="Edit">
                                                <button class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#edit" @click="openEditAgentModal(agent)" >
                                                    <span class="glyphicon glyphicon-pencil"></span>
                                                </button>
                                            </p>
                                        </td>
                                        <td>
                                            <p data-placement="top" data-toggle="tooltip" title="Delete">
                                                <button class="btn btn-danger btn-xs" data-title="Delete" data-toggle="modal" data-target="#delete" @click="deleteAgent(agent.agentID)">
                                                    <span class="glyphicon glyphicon-trash"></span>
                                                </button>
                                            </p>
                                        </td>
                                    </tr>
                                </tbody>
                            <!-- Modal de modification d'agent -->
<div class="modal fade" id="editAgentModal" tabindex="-1" aria-labelledby="editAgentModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editAgentModalLabel">Modifier l'agent</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form @submit.prevent="updateAgent">
                    <div class="mb-3">
                        <label for="agentName" class="form-label">Nom</label>
                        <input type="text" class="form-control" id="agentName" v-model="editedAgent.nom" disabled>
                    </div>
                    <div class="mb-3">
                        <label for="agentLastName" class="form-label">Last Name</label>
                        <input type="text" class="form-control" id="agentLastName" v-model="editedAgent.last_name" disabled>
                        
                    </div>
                    <div class="mb-3">
                        <label for="agentFunction" class="form-label">Fonction</label>
                        <input type="text" class="form-control" id="agentFunction" v-model="editedAgent.fonction" disabled>
                    </div>
                    <!-- Ajouter une section pour afficher le rang actuel de l'agent -->
                    <div class="mb-3">
                        <label for="agentCurrentRank" class="form-label">Rang Actuel</label>
                        <input type="text" class="form-control" id="agentCurrentRank" v-model="currentAgentRank" disabled>
                    </div>
                    <div class="mb-3">
                        <label for="agentPassword" class="form-label">Mot de passe</label>
                        <div class="input-group">
                            <input type="password" class="form-control" id="agentPassword" v-model="editedAgent.password" disabled>
                            <button class="btn btn-outline-secondary" type="button" @click="togglePasswordVisibility">
                                <i v-if="passwordVisible" class="bi bi-eye"></i>
                                <i v-else class="bi bi-eye-slash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="agentRank" class="form-label">Rang</label>
                        <select class="form-select" id="agentRank" v-model="editedAgent.rang" @change="handleRankChange">
                            <option value="agent">agent</option>
                            <option value="manager">manager</option>
                            <option value="admin">admin</option>
                            <option value="drh">drh</option>
                        </select>
                    </div>
<!-- Section pour choisir les catégories (visible uniquement si le rang est "manager") -->
<div v-if="editedAgent.rang === 'manager' && !isAlreadyManager" class="mb-3">
    <label for="managerCategories" class="form-label">Catégories associées</label>
    <div v-if="categories.length === 0">
        <p>No categories loaded yet</p>
    </div>
    <div v-else>
        <p>Categories loaded:</p>
        <div v-for="category in categories" :key="category.categoryID">
            <input type="checkbox" :id="`category_${category.categoryID}`" v-model="selectedCategories" :value="category.categoryID">
            <label :for="`category_${category.categoryID}`">{{ category.name_category }}</label>
        </div>
    </div>
</div>
                    <button type="submit" class="btn btn-primary">Sauvegarder</button>
                </form>
            </div>
        </div>
    </div>
</div>


                            </table>
                        </div>
                        
                        </div>
                    </div>
                </div>
                <!-- Section pour choisir les catégories (visible uniquement si le rang est "manager") 
                <div>
                    <div class="card">
                        <div class="card-header row" style="display:flex;">
                           
                        </div>
                        <div class="card-body">
                            
                            <table
                                id="mytable"
                                class="table table-bordred table-striped"
                            >
                                <thead>
                                    <tr>
                                        <th>Nom du document</th>
                                        <th>Date d'enregistrement</th>
                                        <th>Agent</th>
                                        <th>Categorie de l'agent</th>
                                        <th>create by</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>CV</td>
                                        <td>15/03/2024</td>
                                        <td>Lorelai Martine</td>
                                        <td>Cadre de dirrection</td>
                                        <td>Martin juducael</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>  -->

            </div>
        </div>
    </main>
</template>

<script>
import Swal from "sweetalert2";

export default {
    inject: ['apiUrls'],
  name: 'InterfacAdmin',
  data() {
    return {
      menuItems: [],
      agents: [],
      managers: [],
      categories: [],
      editedManager: {
            nom: '',
            last_name: '',
            fonction: '',
            agentID: '',
       },
      selectedCategory: null,
      page: 1,
      perPage: 6, // Nombre d'agents par page
      selectedManager: null,
      managerCategories: [],
      editedAgent: {
            nom: '',
            last_name: '',
            fonction: '',
            rang: '',
            agentID: '', // Ajoutez l'ID de l'agent pour la mise à jour
            password: '',
        },
        updateSuccess: false, // Variable pour gérer le message de confirmation
        searchText: '', // Texte saisi dans le champ de recherche
        agentDetails: null, // Les détails de l'agent spécifié
        selectedCategories: [], // Catégories sélectionnées pour l'agent en cours d'édition
        isAlreadyManager: false, // Propriété pour indiquer si l'agent est déjà un "manager"
        categoryIDs: [], // Déclarer categoryIDs comme une liste vide
        editedManagerCategories: [], 
        passwordVisible: false,
    };
  },
  computed: {
        // Calcul de la liste des agents à afficher pour la page actuelle
        displayedAgents() {
            const start = (this.page - 1) * this.perPage;
            return this.agents.slice(start, start + this.perPage);
        }, /*
        filteredAgents() {
        // Filtrer les agents en fonction du texte de recherche
        return this.agents.filter(agent => {
            const searchLowerCase = this.searchText.toLowerCase();
            return (
            agent.nom.toLowerCase().includes(searchLowerCase) ||
            agent.last_name.toLowerCase().includes(searchLowerCase) ||
            agent.username.toLowerCase().includes(searchLowerCase)
            );
        });
        }, */
    },
    mounted() {
        // Initialisation du tableau de données des agents et des gestionnaires
        this.loadAgents();

        // Chargement des catégories
        this.loadCategories();


        // Récupérer l'ID de l'agent depuis l'URL
        const agentID = this.$route.params.id;

        // Appeler l'API pour récupérer les détails de l'agent
        this.fetchAgentDetails(agentID);
    },
    methods: {
        togglePasswordVisibility() {
                this.passwordVisible = !this.passwordVisible;
            const passwordInput = document.getElementById('agentPassword');
            passwordInput.type = this.passwordVisible ? 'text' : 'password';
        },
        fetchAgentDetails(agentID) {
            // Remplacez l'URL de l'API par votre propre URL pour récupérer les détails de l'agent
            const apiUrl = this.apiUrls+`/agents/${agentID}`;
            
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    this.agentDetails = data; // Stocker les détails de l'agent récupérés
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des détails de l\'agent:', error);
                });
        },
        refreshAgents() {
            this.searchText = ''; // Réinitialisez le champ de recherche
            this.loadAgents(); // Chargez à nouveau tous les agents
        },
        
        // Chargement des agents depuis l'API
        loadAgents() {
            fetch(this.apiUrls+`/agents?page=${this.page}&perPage=${this.perPage}`)
                .then(response => response.json())
                .then(data => {
                    this.agents = [...this.agents, ...data]; // Ajout des nouveaux agents
                    this.page++; // Incrémentation de la page pour le prochain chargement
                    // Vérifier si les gestionnaires ont déjà été chargés
                    if (this.managers.length === 0) {
                        this.loadManagers(); // Charger les gestionnaires uniquement si nécessaire
                    }
                })
                .catch(error => {
                    console.error('Erreur lors du chargement des agents:', error);
                });
        },

        // Filtrer les gestionnaires parmi les agents
        loadManagers() {
        this.managers = this.agents.filter(agent => agent.rang === 'manager');
        },
        handleRankChange() {
            if (this.editedAgent.rang === 'manager') {
                this.loadAgentCategories(); // Charger les catégories associées au rang "manager"
            } else {
                this.categories = []; // Réinitialiser les catégories si le rang n'est pas "manager"
                this.selectedCategories = []; // Réinitialiser les catégories sélectionnées
            }
        },
        // Chargement des catégories depuis l'API
        loadCategories() {
        fetch(this.apiUrls+'/categories')
            .then(response => response.json())
            .then(data => {
                this.categories = data; // Stockage des données des catégories
            })
            .catch(error => {
                console.error('Erreur lors du chargement des catégories:', error);
            });
        },
        // Ouvrir le modal de modification du gestionnaire
       openEditModal(manager) {
            this.editedManager = { ...manager };
            
    // Charger toutes les données de gestion des agents
    fetch(this.apiUrls+`/gerer`)
        .then(response => response.json())
        .then(data => {
            // Filtrer les données pour obtenir les informations spécifiques au manager actuel
            const managerData = data.filter(item => item.agentID === manager.agentID);
            if (managerData.length > 0) {
                // Utiliser directement les catégories associées à ce manager à partir de managerData
                this.editedManagerCategories = managerData.map(item => item.categoryID);
                /* eslint-disable */
                $('#editManagerModal').modal('show'); // Afficher le modal une fois les données récupérées
            } else {
                console.error('Aucune donnée trouvée pour ce manager dans "gerer"');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des informations du manager dans "gerer":', error);
        });
        },

        // Méthode appelée lorsqu'on appuie sur le bouton "Sauvegarder"
        saveChanges(agentID) {
    // Récupérer les données de l'API gerer
    fetch(this.apiUrls+'/gerer')
        .then(response => response.json())
        .then(data => {
            // Créer un tableau pour stocker les opérations POST et DELETE
            const operations = [];

            // Vérifier chaque categoryID dans editedManagerCategories
            this.editedManagerCategories.forEach(categoryID => {
                // Vérifier si une occurrence existe déjà pour cet agentID et ce categoryID
                const existingOccurrence = data.find(item => item.agentID === agentID && item.categoryID === categoryID);

                // Si l'occurrence existe déjà, ne rien faire
                if (!existingOccurrence) {
                    // Si l'occurrence n'existe pas, ajouter une opération POST dans le tableau
                    operations.push({ agentID, categoryID });
                    Swal.fire({
                    icon: 'success',
                    title: 'Modifications réussies!',
                    html: "L'échelon  a été joins avec succès.",
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
                }
            });

            // Vérifier toutes les occurrences actuelles dans l'API pour cet agentID
            data.forEach(item => {
                // Vérifier si l'occurrence actuelle n'est pas dans editedManagerCategories
                if (item.agentID === agentID && !this.editedManagerCategories.includes(item.categoryID)) {
                    // Ajouter une opération DELETE dans le tableau
                    operations.push({ id: item.id, method: 'DELETE' });
                    Swal.fire({
                    icon: 'success',
                    title: 'Modifications réussies!',
                    html: "L'échelon <strong>" + item.Category.name_category + "</strong> a été retirer avec succès.",
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
                }
            });

            // Effectuer les opérations POST et DELETE en parallèle
            Promise.all(operations.map(operation => {
                // Si c'est une opération POST, effectuer une requête POST
                if (operation.method !== 'DELETE') {
                    return fetch(this.apiUrls+'/gerer', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ agentID: operation.agentID, categoryID: operation.categoryID }),
                    });
                } else {
                    // Sinon, si c'est une opération DELETE, effectuer une requête DELETE
                    return fetch(this.apiUrls+`/gerer/${operation.id}`, {
                        method: 'DELETE',
                    });
                }
            }))
            .then(responses => {
                // Traiter les réponses si nécessaire
                console.log('Opérations effectuées avec succès:', responses);
                // Ajoutez ici la logique pour fermer le modal
                $('#editManagerModal').modal('hide');
            })
            .catch(error => {
                console.error('Erreur lors de la mise à jour des catégories associées au manager:', error);
                Swal.fire('Erreur', 'Une erreur s\'est produite lors de la mise à jour des catégories associées au manager', 'error');
                $('#editManagerModal').modal('hide');
                // Gérer les erreurs ici
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données dans "gerer":', error);
            Swal.fire('Erreur', 'Une erreur s\'est produite lors de la récupération des données dans "gerer":', 'error');
            $('#editManagerModal').modal('hide');
            // Gérer les erreurs ici
        });
},

        // Mettre à jour le gestionnaire avec les modifications
        /*
        updateManager() {
            const updatedManager = {
                agentID: this.editedManager.agentID,
                categoryID: this.selectedCategory
            };
            // Mettre à jour le gestionnaire dans la base de données
            fetch(this.apiUrls+'/gerer', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedManager)
            })
            .then(response => response.json())
            .then(() => {
                // Mettre à jour les données affichées
                this.loadAgents();
                $('#editManagerModal').modal('hide');
            })
            .catch(error => {
                console.error('Erreur lors de la mise à jour du gestionnaire:', error);
            });
        }, */
        // Gestion de l'événement de défilement
        handleScroll() {
            const tableWrapper = this.$refs.tableWrapper;
            if (tableWrapper.scrollTop + tableWrapper.clientHeight >= tableWrapper.scrollHeight) {
                this.loadAgents(); // Chargement des agents lorsque l'utilisateur fait défiler vers le bas
            }
        },
        handleLogout() {
            localStorage.removeItem('isAuthenticated');
            this.$router.push({ name: 'HelloWorld' });
        },
        confirmDelete() {
            $('#confirmDeleteModal').modal('show');
        },
            // Ouvrir le modal de modification de l'agent
    openEditAgentModal(agent) {
        this.editedAgent = { ...agent }; // Copie de l'agent sélectionné
        // Affecter le rang actuel de l'agent à la variable currentAgentRank
        this.currentAgentRank = agent.rang;
        this.loadAgentCategories();
        this.checkIfAlreadyManager(agent.agentID); // Vérifier si l'agent est déjà un "manager"
        $('#editAgentModal').modal('show'); // Afficher le modal
    },
    checkIfAlreadyManager(agentID) {
            // Appeler l'API pour vérifier si l'agent est déjà un "manager"
            fetch(this.apiUrls+`/agents/${agentID}`)
                .then(response => response.json())
                .then(data => {
                    this.isAlreadyManager = data.rang === 'manager';
                })
                .catch(error => {
                    console.error('Erreur lors de la vérification du rang de l\'agent:', error);
                });
    },
    loadAgentCategories() {
            if (this.editedAgent.rang === 'manager') {
                // Charger les catégories disponibles depuis l'API
                fetch(this.apiUrls+'/categories')
                    .then(response => response.json())
                    .then(data => {
                        this.categories = data; // Mettre à jour la liste des catégories
                        this.selectedCategories = []; // Réinitialiser les catégories sélectionnées
                        console.log('Categories loaded:', this.categories);
                    })
                    .catch(error => {
                        console.error('Erreur lors du chargement des catégories:', error);
                    });
            } else {
                this.categories = []; // Réinitialiser les catégories si le rang n'est pas "manager"
                this.selectedCategories = [];
            }
        }, 


        // Mettre à jour l'agent avec les modifications
        updateAgent() {
            const updatedAgentData = {
                rang: this.editedAgent.rang // Nouveau rang de l'agent
                // Ajoutez d'autres champs à mettre à jour si nécessaire
            };
            fetch(this.apiUrls+`/agents/${this.editedAgent.agentID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedAgentData),
            })
            .then(response => {
                if (!response.ok){
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log(data)
                
                // Mettre à jour l'agent modifié dans la liste existante
                const updatedAgentIndex = this.agents.findIndex(agent => agent.agentID === this.editedAgent.agentID);
                    if (updatedAgentIndex !== -1) {
                        this.agents.splice(updatedAgentIndex, 1, this.editedAgent);
                    }
                    this.updateSuccess = true;
                    $('#editAgentModal').modal('hide');
                    // Mettre à jour la liste des managers
                    
                    this.loadManagers(); // Appel à la fonction pour charger la liste des managers
                    // Enregistrer les catégories associées à l'agent comme manager
                    if (this.editedAgent.rang === 'manager') {
                        this.saveManagerCategories();
                    } else if (this.editedAgent.rang !== 'manager' && this.currentAgentRank === 'manager') {
                        this.removeManagerCategories(this.editedAgent.agentID);
                    } else {
                        // Ajoutez ici le traitement pour le cas où aucun des cas précédents n'est vérifié
                        // Par exemple, affichez un message d'avertissement ou effectuez une autre action
                        Swal.fire({
                        icon: 'success',
                        title: 'Modifications réussies!',
                        text: 'Les modifications ont été enregistrées avec succès.',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'OK'
                        });
                        this.loadManagers();
                        console.warn('Cas non géré: ni "manager" ni changement de rang de "manager" détecté.');
                    }
            })
            .catch(error => {
                console.error('Erreur lors de la mise à jour de l\'agent:', error);
                this.updateSuccess = false; // Mise à jour échouée, désactiver le message de confirmation
            });
        },

        // Enregistrer les catégories associées à l'agent comme manager
        saveManagerCategories() {
            const agentID = this.editedAgent.agentID;

// Parcourir les catégories sélectionnées
this.selectedCategories.forEach(categoryID => {
    const postData = {
        agentID: agentID,
        categoryID: categoryID
    };

    fetch(this.apiUrls+'/gerer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Réponse de l\'API:', data);
        // Ajouter d'autres actions si nécessaire après la réussite de la requête
        Swal.fire({
        icon: 'success',
        title: 'Modifications réussies!',
        text: 'Les modifications ont été enregistrées avec succès.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
    });
    this.loadManagers();
    })
    .catch(error => {
        console.error('Erreur lors de la requête POST:', error);
        // Gérer les erreurs de la requête POST ici
    });
});

},
            // Méthode pour supprimer les catégories associées à l'agent comme manager
            removeManagerCategories(agentID) {
    // Envoyer une requête GET à l'API pour récupérer toutes les entrées associées à l'agentID spécifié
    fetch(this.apiUrls+`/gerer?agentID=${agentID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données de gestion pour l\'agent');
            }
            return response.json();
        })
        .then(data => {
            // Vérifier si des données ont été récupérées
            if (data.length === 0) {
                console.warn(`Aucune entrée trouvée pour l'agentID ${agentID} dans "gerer"`);
                Swal.fire({
                    icon: 'success',
                    title: 'Modifications réussies!',
                    text: 'Les modifications ont été enregistrées avec succès.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
                this.loadManagers();
                return; // Sortir de la fonction si aucune donnée n'est trouvée
            }

            // Filtrer les entrées pour obtenir celles qui ont l'agentID spécifié
            const entriesToDelete = data.filter(entry => entry.agentID === agentID);

            // Vérifier si des entrées ont été trouvées à supprimer
            if (entriesToDelete.length === 0) {
                console.warn(`Aucune entrée trouvée à supprimer pour l'agentID ${agentID}`);
                return; // Sortir de la fonction si aucune entrée n'est trouvée à supprimer
            }

            // Envoyer une requête DELETE pour chaque entrée à supprimer
            entriesToDelete.forEach(entry => {
                fetch(this.apiUrls+`/gerer/${entry.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erreur lors de la suppression des catégories associées à l\'agent comme manager');
                    }
                    console.log(`Catégorie associée supprimée avec succès pour l'agentID ${agentID}`);
                    // Afficher la réponse de la requête DELETE
                    return response.json();
                })
                .then(data => {
                    console.log('Response data:', data); // Afficher les données de réponse si nécessaire
                    // Vous pouvez ajouter d'autres actions si nécessaire après la suppression réussie
                    
                })
                .catch(error => {
                    console.error(`Erreur lors de la suppression des catégories associées à l\'agent ${agentID}:`, error);
                    // Gérer les erreurs ici, par exemple, afficher un message d'erreur à l'utilisateur
                });
            });
        })
        .catch(error => {
            console.error(`Erreur lors de la récupération des données de gestion pour l\'agent ${agentID}:`, error);
            // Gérer les erreurs ici, par exemple, afficher un message d'erreur à l'utilisateur
        });
},

        /* // Méthode pour supprimer l'agent avec l'ID spécifié
            deleteAgent(agentId) {
        // Afficher un message de confirmation (modal, boîte de dialogue, etc.) ici si nécessaire
        const confirmed = confirm('Êtes-vous sûr de vouloir supprimer cet agent ?');
        if (confirmed) {
            // Appeler l'API pour supprimer l'agent avec l'ID spécifié
            fetch(this.apiUrls+`/agents/${agentId}`, {
            method: 'DELETE'
            })
            .then(response => {
            if (response.ok) {
                // Suppression réussie, masquer le modal et recharger la liste des agents
                $('#confirmDeleteModal').modal('hide');
                // Suppression réussie, recharger la liste des agents après la suppression
                this.loadAgents();
            } else {
                throw new Error('Erreur lors de la suppression de l\'agent');
            }
            })
            .catch(error => {
            console.error('Erreur lors de la suppression de l\'agent:', error);
            // Gérer l'erreur ici, par exemple, afficher un message d'erreur à l'utilisateur
            });
        }
        },  */
    },
    watch: {
        // Watcher pour le champ de recherche en temps réel
        searchText(newValue) {
        if (newValue === '') {
            // Si le champ de recherche est vide, réinitialiser la liste des agents
            this.loadAgents(); // Utilisez la méthode appropriée pour charger tous les agents
        } else {
            const searchLowerCase = newValue.toLowerCase();
            this.agents = this.agents.filter(agent =>
                agent.nom.toLowerCase().includes(searchLowerCase) ||
                agent.last_name.toLowerCase().includes(searchLowerCase) ||
                agent.username.toLowerCase().includes(searchLowerCase)
            );
        }
    },
    },
};
</script>


<style scoped>
    .dashboard-admin {
        display: flex;
    }

    .main-content {
        width: 80%; /* Par exemple, vous pouvez définir une largeur fixe ici */
        margin: 0 auto; /* Cette règle permettra de centrer l'élément */
        display: flex; 
        justify-content: center;
    }

    .section {
        display: flex;
        justify-content: space-between;
        align-items: top;
    }
    .card {
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin: 10px;
        width: 95%;
        border-radius: 25px;
    }

    .card-header {
        padding: 20px;
        border-bottom: 1px solid #ccc;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }

    /* Style pour afficher les éléments de la liste horizontalement */
.horizontal-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
}

/* Style pour chaque élément de la liste horizontale */
.horizontal-item {
    margin-right: 10px; /* Espacement entre les éléments */
}
    .card-body {
        padding: 20px;
    }

    ul {
        padding: 0;
    }

    li {
        list-style-type: none;
        padding: 5px 0;
    }

    /* Style pour le survol */
    .card:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .containers {
        display: flex;
    }
    .table-wrapper {
        max-height: 400px; /* Ajustez la hauteur maximale en fonction de vos besoins */
        overflow-y: auto;
    }

</style>
        