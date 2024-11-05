<template>
  <div class="document-view-container">
    <header class="dashboard-header full-width-header fixed-header">
      <div class="logo-wrapper">
        <img src="/snel.png" alt="Logo IFolder">
        <span class="company-name">IFolder</span>
      </div>
      <div class="logout-button-wrapper">
        <button class="logout-button back-button" @click="handleLogout">Se déconnecter</button>
      </div>
    </header>

    <div class="header-actions justify-start">
        <button class="btn btn-primary" @click="goBack">Retour</button>
    </div>
    <div class="header-padding"></div>
    <div class="cv-info header-margin">
      <div class="row align-items-center">
        <div class="col-auto">
          <button class="btn btn-lg btn-primary rounded-circle back-button" @click="goBack">
            <!-- Insérez ici l'icône ou le texte de votre choix pour le bouton -->
            <i class="fas fa-chevron-left"></i>
            <!-- Ou simplement du texte :
            <span>Retour</span>
            -->
          </button>
        </div>
        <div class="col">
          <div class="details">
            <p><strong>Noms :</strong> {{ employee.nom }} {{ employee.last_name }}</p>
            <p><strong>Grade :</strong> {{  employee.Grade ? employee.Grade.grade_name : "Unknown" }}</p>
            <p><strong>Fonction :</strong> {{ employee.fonction }}</p>
          </div>
        </div>
      </div>
 
    </div>

    <div class="file-upload-search">
      <div class="search">
        <input type="text" v-model="searchDocument" placeholder="Rechercher un document" class="form-control" @input="searchDocuments" />
      </div>
      <div class="actions">
        <button type="button" id="addButton" class="btn btn-primary"  data-bs-whatever="ajouter" @click="openForm" >ajouter</button>
      </div>
    </div>
    

    <div class="modal fade" id="addFormModal" tabindex="-1" aria-labelledby="addFormModalLabel" aria-hidden="true" :class="{ 'show': showModal }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addFormModalLabel">Ajouter des fichiers</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            
          </div>
          <form @submit.prevent="addFile" enctype="multipart/form-data">
            <div class="modal-body">
              <div class="form-group">
                <label for="file-name">Nom du fichier</label>
                <select id="file-name" v-model="selectedDocumentType" class="form-control">
                  
                  <option v-for="type in documentTypes" :key="type.type_documentID" :value="type">{{ type.type_name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="file-upload">Importer les fichiers</label>
                <input type="file" id="file-upload" @change="handleFileUpload" accept=".pdf,.png,.jpg,.jpeg" class="form-control-file" multiple />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" id="cancelButton" class="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close" >Annuler</button>
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
              <th scope="col">Suppression</th> 
            </tr>
          </thead>
          <tbody v-if="hasDocuments">
            <tr v-for="document in employee.documents" :key="document.nom">
              <td>{{ document.designation }}</td>
              <td>{{ (document.path.split('.').pop())}}</td>
              <td>{{ document.creation_date }}</td>
              <td>{{ document.managerID }}</td>
              <td>
                <button class="btn btn-primary" @click="printFile(getFilePath(document.path))">
                  <i class="fas fa-print"></i>
                </button>
              </td>
              <td>
              <button class="btn btn-danger" @click="confirmDelete(document.documentID)">
                  <i class="fas fa-trash"></i>
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
  name: 'DocumentView',
  data() {
    return {
      employee: {
        documents: []
      },
      newDocumentName: '',
      showAddFormDialog: false,
      shareOptions: {
        email: false,
        social: false,
      },
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
      
    };
  },
  created() {
    const name = this.$route.params.name;
    fetch(this.apiUrls+'/agents')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        return response.json();
      })
      .then(data => {
        this.employee = data.find(emp => emp.nom === name);
        if (!this.employee) {
          console.log("L'employé n'a pas été trouvé");
        }
        // Récupérer les types de documents
        fetch(this.apiUrls+'/type_documents/')
        .then(response => {
            if (!response.ok) {
              throw new Error('Erreur lors de la récupération des types de documents');
            }
            return response.json();
          })
          .then(data => {
            
            this.documentTypes = [{ type_documentID: "", type_name: "Sélectionner un type de document" }, ...data];
            // Définir le premier élément de la liste déroulante par défaut
            this.selectedDocumentType = this.documentTypes[0];
          })
          .catch(error => {
            console.error("Une erreur s'est produite lors de la récupération des types de documents :", error);
          });
        // Interroger l'API des documents pour cet employé
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
              const currentAgentID = this.employee.agentID;

            // Filtrer les documents en fonction de l'agentID actuel
            const filteredDocuments = data.filter(doc => doc.agentID === currentAgentID);

            // Affecter les documents filtrés à l'employé
            this.employee.documents = filteredDocuments;

            console.log(this.employee.documents);
          })
          /*
          .then(() => {
            // Rafraîchir la liste des documents
            this.refreshDocumentList();
          }) */
          .catch(error => {
              console.error("Une erreur s'est produite lors de la récupération des documents de l'employé :", error);
          });

      })
      .catch(error => {
        console.error('Une erreur s\'est produite lors de la récupération des données:', error);
      });
  },
  computed: {
    hasDocuments() {
      return this.employee.documents && this.employee.documents.length > 0;
    },

  },
  methods: { 
    confirmDelete(documentID) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment supprimer ce document ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        // L'utilisateur a confirmé la suppression, envoyez une requête à l'API
        this.deleteDocument(documentID);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // L'utilisateur a annulé la suppression
        Swal.fire('Opération annulée', '', 'info');
      }
    });
  },
  deleteDocument(documentID) {
    // Ici, vous enverrez une requête à votre API pour supprimer le document
    // Remplacez cet exemple par votre propre logique d'appel API
    fetch(this.apiUrls+`/documents/${documentID}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer votre-token',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du document');
      }
      return response.json();
    })
    /* eslint-disable */
    .then(data => {
      // Suppression réussie, mettez à jour l'affichage des documents
      this.refreshDocumentList(); // Assurez-vous d'avoir une méthode pour rafraîchir la liste des documents
      Swal.fire('Document supprimé', '', 'success');
    })
    .catch(error => {
      console.error('Erreur lors de la suppression du document :', error);
      Swal.fire('Erreur', 'Une erreur s\'est produite lors de la suppression du document', 'error');
    });
  },
    removeTempFile(index) {
    this.tempFiles.splice(index, 1); // Retirer la ligne du tableau tempFiles
  },
    showSuccessMessage() {
      Swal.fire("Succès !", "L'enregistrement a réussi avec succès.", "success").then(() => {
      this.showModal = false; // Fermer le modal après l'affichage du message de succès;
      });
    },
    openForm() {
      /* eslint-disable */ 
      $('#addFormModal').modal('show');
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
      const employee = this.employees.find(employee => employee.gradeID === gradeID);
      return employee && employee.Grade ? employee.Grade.grade_name : 'Unknown';
    },
    filteredDocuments() {
      if (!this.searchDocument) {
        return this.employee.documents;
      }
      const searchTerm = this.searchDocument.toLowerCase();
      return this.employee.documents.filter(document => {
        return document.designation.toLowerCase().includes(searchTerm);
      });
    },
    searchDocuments() {
      if (this.searchDocument === '') {
        this.refreshDocumentList();
      } else {
        // Rafraîchissez les documents filtrés à chaque saisie
        this.employee.documents = this.filteredDocuments();
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
              if (!response.ok) {
                  throw new Error('Erreur lors de la récupération des documents de l\'employé');
              }
              return response.json();
          })
          .then(data => {
              // Récupérer l'agentID de l'employé actuel
              const currentAgentID = this.employee.agentID;

            // Filtrer les documents en fonction de l'agentID actuel
            const filteredDocuments = data.filter(doc => doc.agentID === currentAgentID);

            // Affecter les documents filtrés à l'employé
            this.employee.documents = filteredDocuments;
         });
    },
    
    shareDocuments() {
      // Votre logique de partage ici
      // Afficher la boîte de dialogue de partage
      this.showShareDialog = true;
    },
    cancelShare() {
      // Annuler le partage
      this.showShareDialog = false;
      this.shareOptions.email = false;
      this.shareOptions.social = false;
    },
    goBack() {
    this.$router.push({ name: 'DossierView' });
    },
    handleLogout() {
      localStorage.removeItem('isAuthenticated');
      this.$router.push({ name: 'HelloWorld' });
    },
    /*
    closeForm() {
      this.file = null;
      this.newDocumentName = '';
      this.selectedDocumentType =null, // Réinitialiser à la valeur par défaut
      this.showModal = false;
      this.showAddFormDialog = false;
    }, */
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
    },

    showAddForm() {
      this.showAddFormDialog = true;
    },
    getDate() {
      var date = new Date();
      const day = String(date.getDate()).padStart(2,'0');
      const month = String(date.getMonth() + 1).padStart(2,'0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    
    addFile() {
      if (!this.selectedDocumentType || !this.tempFiles.length) {
        this.errorMessage = "Veuillez remplir tous les champs obligatoires.";
        return;
      }
      
      const uploadFile = (tempFile) => {
        const formData = new FormData();
        formData.append("agentID", this.employee.agentID);
        formData.append("managerID", this.$route.params.id);
        formData.append("type_documentID", tempFile.type_documentID);
        formData.append("designation", tempFile.type_name);
        formData.append("path", tempFile.file);
        formData.append("creation_date", this.getDate());

        console.log("avant formData", JSON.stringify(Array.from(formData.entries())));

        return fetch(this.apiUrls+"/upload", {
          method: "POST",
          body: formData,
        }) /* eslint-disable */
          .then((response) => response.json())
          .then((data) => {
            console.log("File uploaded successfully", data);
            /* eslint-disable */ 
            $('#addFormModal').modal('hide');
          })
          .catch((error) => {
            console.error("Error uploading file", error);
            throw new Error("Une erreur s'est produite lors de l'envoi du fichier.");
          });
          
          /* eslint-disable */
          this.closeForm(); // Fermer le formulaire modal
          this.refreshDocumentList(); // Rafraîchir la liste des documents
      };

      const uploadFiles = async () => {
        for (const tempFile of this.tempFiles) {
          try {
            await uploadFile(tempFile);
          } catch (error) {
            this.errorMessage = error.message;
            return;
          }
        }
          // Ici, vérifiez s'il n'y a pas d'erreur
        if (!this.errorMessage) {
        this.showModal = false; // Fermer le formulaire modal
        this.refreshDocumentList(); // Mettre à jour la liste des documents
        // Tous les fichiers ont été téléchargés avec succès
        this.tempFiles = [];
        // Afficher le message avec Vue-Sweetalert2
        this.$swal({
          title: 'Succès',
          text: this.successMessage,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        this.showSuccessMessage(); // Ajoutez cet appel ici
        this.selectedDocumentType = { type_documentID: null, type_name: null, searchText: "" };
        this.errorMessage = "";
        this.closeForm();
      }
      };

      uploadFiles();
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
  mounted() {

    

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
  width: 100%;
}
.full-width-header{
  width: 100%;
}
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
}
.header-margin {
  margin-top: 30px;
}

.header-actions {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.header-actions.justify-start {
  justify-content: flex-start;
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