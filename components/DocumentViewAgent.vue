<template>
  <div class="document-view-container">
    <header class="dashboard-header  fixed-header full-width-header">
      <div class="logo-wrapper">
        <img src="/snel.png" alt="Logo IFolder">
        <span class="company-name">IFolder</span>
      </div>
      <div class="logout-button-wrapper">
        <button class="logout-button" @click="handleLogout">Se déconnecter</button>
      </div>
    </header>
    <div class="cv-info header-margin">
      <div class="details">
        <p><strong>Noms :</strong> {{ agent.nom }} {{ agent.last_name }}</p>
        <p><strong>Grade :</strong> {{  agent.Grade ? agent.Grade.grade_name : "Unknown" }}</p>
        <p><strong>Fonction :</strong> {{ agent.fonction }}</p>
      </div>
    </div>

    <div class="file-upload-search">
      <div class="search">
        <input type="text" v-model="searchDocument" placeholder="Rechercher un document" class="form-control" @input="searchDocuments" />
      </div>
      <div class="actions">
        
        <div class="document-count bg-primary text-white p-2 rounded" label="Nombre total document"> Nombre total document: {{  totalDocuments }}</div>
      </div>
    </div>
    

    <div class="modal fade" id="addFormModal" tabindex="-1" aria-labelledby="addFormModalLabel" aria-hidden="true" :class="{ 'show': showModal }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addFormModalLabel">Ajouter des fichiers</h5>
            <button type="button" id="closeButton" class="btn-close" aria-label="Close" @click="closeForm"></button>
          </div>
          <form @submit.prevent="addFile" enctype="multipart/form-data">
            <div class="modal-body">
              <div class="form-group">
                <label for="file-name">Nom du fichier</label>
                <select id="file-name" v-model="selectedDocumentType" class="form-control">
                  <option value="">Sélectionner un type de document</option>
                  <option v-for="type in documentTypes" :key="type.type_documentID" :value="type">{{ type.type_name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="file-upload">Importer les fichiers</label>
                <input type="file" id="file-upload" @change="handleFileUpload" accept=".pdf,.png,.jpg,.jpeg" class="form-control-file" multiple />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" id="cancelButton" class="btn btn-secondary" @click="closeForm">Annuler</button>
              <button type="submit" class="btn btn-primary">Valider</button>
            </div>
          </form>
          <div class="modal-body">
            <table v-if="tempFiles.length > 0" class="table">
              <thead>
                <tr>
                  <th>Désignation</th>
                  <th>Nom du fichier</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(tempFile, index) in tempFiles" :key="index">
                  <td>{{ tempFile.designation }}</td>
                  <td>{{ tempFile.file.name }}</td>
                  <td>
                    <button class="btn btn-link" @click="removeTempFile(index)"> <!-- Ajouter le bouton croix -->
                      <i class="fas fa-times"></i> <!-- Utiliser une icône de croix (Font Awesome) -->
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
      <div v-show="!showModal" class="table-container">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Désignation</th>
              <th scope="col">Type</th>
              <th scope="col">Date</th>
              <th scope="col">Gestionnaire</th>
              <th scope="col">Impression</th>
            </tr>
          </thead>
          <tbody v-if="hasDocuments">
            <tr v-for="document in agent.documents" :key="document.agentID">
              <td>{{ document.designation }}</td>
              <td>{{ (document.path.split('.').pop())}}</td>
              <td>{{ document.creation_date }}</td>
              <td>{{ document.managerID }}</td>
              <td>
                <button class="btn btn-primary" @click="printFile(getFilePath(document.path))">
                  <i class="fas fa-print"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tr v-else>
            <td colspan="6">Aucun document enregistré.</td>
          </tr>
        </table>
      </div>
    </div>

</template>

<script>
import Swal from "sweetalert2";


export default {
  inject: ['apiUrls'],
  name: 'DocumentViewAgent',
  data() {
    return {
      agent: {
        documents: []
      },
      newDocumentName: '',
      showAddFormDialog: false,
      searchDocument: '',
      selectedDocuments: [],
      documentTypes: [],
      file: null,
      selectedDocumentType: {
        type_documentID: null,
        type_name: null,
        searchText: '',
      },
      showModal: false,
      tempFiles: [] ,
      successMessage: "",
      totalDocuments: 0,
      
    };
  },
  mounted() {
    const id = this.$route.params.id;

fetch(this.apiUrls+`/agents`)  
  .then(response => {
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des agents");
    }
    return response.json();
  })
  .then(data => {
    this.agent = data.find(agent => agent.agentID === id);
    if (!this.agent) {
      console.log("L'agent n'a pas été trouvé");
    }
  })
  .catch(error => {
    console.error(
      "Une erreur s'est produite lors de la récupération des agents:",
      error
    );
  });

 
  fetch(this.apiUrls+`/documents`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des documents');
      }
      return response.json();
      
    })
    .then(data => {
      console.log("affiche t",data);
      this.agent.documents = data.filter(document => document.agentID === id);
      this.totalDocuments = this.agent.documents.length; // Mettre à jour totalDocuments
      console.log("affiche B",this.agent.documents);
    })
    .catch(error => {
      console.error('Une erreur s\'est produite lors de la récupération des documents:', error);
    });

    fetch(this.apiUrls+`/type_documents`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des types de documents');
        }
        return response.json();
      })
      .then(data => {
        this.documentTypes = data;
      })
      .catch(error => {
        console.error("Une erreur s'est produite lors de la récupération des types de documents :", error);
      });
  },
  computed: {
    hasDocuments() {
      const hasDocs = this.agent.documents && this.agent.documents.length > 0;
    console.log('hasDocuments:', hasDocs); // Débogage
    return hasDocs;
    },/*
    filteredDocuments() {
      const agentID = this.$route.params.id;
      //return this.documents.filter(document => document.agentID === Number(agentID));
      return this.agent.documents.filter(document => document.agentID === agentID);
    }*/
  },
  methods: { 
    removeTempFile(index) {
    this.tempFiles.splice(index, 1); // Retirer la ligne du tableau tempFiles
  },
    showSuccessMessage() {
      Swal.fire("Succès !", "L'enregistrement a réussi avec succès.", "success");
    },
    openForm() {
      this.showModal = true;
      document.body.classList.add('modal-open'); // Ajouter la classe modal-open
    },
    closeForm() {
      if (this.modal) {
        this.modal.hide(); // Cacher le formulaire modal
      }
      this.showModal = false; // Cacher le modal
      document.body.classList.remove('modal-open'); // Supprimer la classe modal-open du body

      // Réinitialiser la liste tempFiles
      this.tempFiles = [];
    },
    handleModalHidden() {
      this.showModal = false; // Cacher le modal
      document.body.classList.remove('modal-open'); // Supprimer la classe modal-open du body
    },
        getFilePath(filename) {
            // Vérifie si le chemin commence déjà par "uploads/"
        if (filename.startsWith('uploads/')) {
          // Si oui, retournez le chemin sans "uploads/" et spécifiez le port 3000
          return this.apiUrls+`/${filename.replace('uploads/', '')}`;
        } else {
          // Sinon, retournez le chemin tel quel et spécifiez le port 3000
          return this.apiUrls+`/${filename}`;
        }
    },

    // Validation du formulaire
    validateForm() {
      // Vérification des champs obligatoires
      if (!this.selectedDocumentType || !this.file || !this.designation) {
        this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
        return false;
      }
      this.errorMessage = '';
      return true;
    },
   getGradeName(gradeID) {
      const agent = this.agent.Grade.find(agent => agent.gradeID === gradeID);
      return agent && agent.Grade ? agent.Grade.grade_name : 'Unknown';
    },
    filteredDocuments() {
      if (!this.searchDocument) {
        return this.agent.documents;
      }
      const searchTerm = this.searchDocument.toLowerCase();
      return this.agent.documents.filter(document => {
        return document.designation.toLowerCase().includes(searchTerm);
      });
    },
    searchDocuments() {
      if (this.searchDocument === '') {
        this.refreshDocumentList();
      } else {
        // Rafraîchissez les documents filtrés à chaque saisie
        this.agent.documents = this.filteredDocuments();
        //this.searchInPDF();
      }
    },
    printFile(filepath) {
      window.open(filepath, '_blank');
    },
    refreshDocumentList() {
    // Interroger le serveur pour récupérer la liste des documents pour l'employé actuel
    // Supposons que vous ayez une API qui renvoie les documents d'un employé en fonction de son ID
    fetch(this.apiUrls+`/documents`)
          .then(response => {
            console.log('donne aget id', response)
              if (!response.ok) {
                  throw new Error('Erreur lors de la récupération des documents de l\'employé');
              }
              return response.json();
          })
          .then(data => {
              // Récupérer l'agentID de l'employé actuel
              const currentAgentID = this.$route.params.id;

            // Filtrer les documents en fonction de l'agentID actuel
            const filteredDocuments = data.filter(doc => doc.agentID === currentAgentID);

            // Affecter les documents filtrés à l'employé
            this.agent.documents = filteredDocuments;
         });
    },


   
    handleLogout() {
      localStorage.removeItem('isAuthenticated');
      this.$router.push({ name: 'HelloWorld' });
    },

    handleFileUpload(event) {
      const fileInput = event.target;
      if (fileInput.files.length > 0) {
        for (let i = 0; i < fileInput.files.length; i++) {
          const tempFile = {
            type_documentID: this.selectedDocumentType.type_documentID, // Ajouter cette propriété
            type_name: this.selectedDocumentType.type_name, // Ajouter cette propriété
            designation: this.selectedDocumentType.type_name,
            file: fileInput.files[i]
          };
          this.tempFiles.push(tempFile);
            }
      }
      console.log("MAINTENANT", JSON.stringify(this.tempFiles));
      //console.log("tempFiles", this.tempFiles);  Vérifiez les fichiers ajoutés à tempFiles
    },


    selectDocument(document) {
    // Vérifier si le document est déjà sélectionné
    if (this.selectedDocuments.includes(document)) {
      // Désélectionner le document
      this.selectedDocuments = this.selectedDocuments.filter(d => d !== document);
    } else {
      // Sélectionner le document
      this.selectedDocuments.push(document);
    }
  }, 
},
};
</script>


<style scoped>

.document-view-container {
  overflow-x: hidden;
  padding: 0; 
  margin: 0; 
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Aligne les éléments au début du conteneur */
  align-items: center;
  font-family: 'Dosis', sans-serif;
  /*font-family: 'Poppins', sans-serif;*/
  }

.dashboard-header {
  background-color: #333;
  color: white;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.fixed-header {
  position: sticky;
  top: 0;
  z-index: 100;
  /* Ajoutez les autres styles nécessaires pour le header */
}
.header-margin {
  margin-top: 30px;
}
.full-width-header{
  width: 100%;
}
.document-count {
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 10px;
  background-color: #007bff;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
}

.document-count span {
  margin-left: 5px;
}
.d-flex  {
  display: flex;
  align-items: center;
  margin-right: auto;
}
.logout-button-wrapper {
  align-self: center;
}
.logout-button:hover {
  background-color: #cc0000;
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

.table-container {
  width: 70%;
  margin: 0 auto;
}

.table {
  width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        margin-top: 20px;
  
}

th, td {
  padding: 8px 12px;
  text-align: center;
  border: 1px solid #ddd;
}

th {
  background-color: #f7fafc;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}


.file-upload-search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search {
  margin-right: 10px;
}

.actions {
  display: flex;
}

.btn-action {
  margin-right: 10px;
}

.add-form-dialog {
  position: fixed;
  z-index: 9999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.add-form-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  max-width: 500px;
  width: 100%;
}

.add-form-content h2 {
  margin-top: 0;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background-color: red;
  border: none;
  color: white;
}
</style>