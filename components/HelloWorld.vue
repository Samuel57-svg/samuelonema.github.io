<template>
  <div class="login-container">
    <div class="login-form">
      <h2>Connexion</h2>
      <div v-if="showError" class="error-message">Nom d'utilisateur ou mot de passe incorrect</div>
      <form @submit.prevent="handleConnexion">
        <div class="form-group">
          <label for="username">Nom d'utilisateur</label>
          <input type="text" id="username" name="username" class="form-control" placeholder="Entrez votre nom d'utilisateur" v-model="username">
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <div class="input-group">
            <input :type="showPassword ? 'text' : 'password'" id="password" name="password" class="form-control" placeholder="Entrez votre mot de passe" v-model="password">
            <button class="btn btn-outline-secondary" type="button" @click="togglePassword">
              <i v-if="showPassword" class="bi bi-eye-fill"></i>
              <i v-else class="bi bi-eye-slash-fill"></i>
            </button>
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Se connecter</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['apiUrls'],
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      showError: false
    };
  },
  methods: {
    async handleConnexion() {
      const url = this.apiUrls+'/agents';
      const { username, password , } = this;

      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();

          // Trouvez l'utilisateur avec le nom d'utilisateur donné
          const user = data.find(item => item.username === username);
          

          if (user) {
            // Si l'utilisateur est trouvé, vérifiez le mot de passe
            if (user.password === password) {
             // Si le mot de passe est correct, déterminez le rang de l'utilisateur
              switch (user.rang) {
                case "agent":
                  this.$router.push({ name: 'DocumentViewAgent', params: { id: user.agentID } });
                  break;
                case "manager":
                  this.$router.push({ name: 'DashBoard', params: { id: user.agentID } });
                  break;
                case "drh":
                  this.$router.push({ name: 'InterfaceDrh', params: { id: user.agentID } });
                  break;
                case "admin":
                  this.$router.push({ name: 'InterfaceAdmin', params: { id: user.agentID } });
                  break;
                default:
                  console.error("Rang d'utilisateur non reconnu:", user.rang);
              }
              // Stockez l'authentification dans le localStorage
              localStorage.setItem('isAuthenticated', true);
              //this.$router.push({ name: 'DashBoard', params: { id: user.agentID } });
              this.$emit('authenticated');
            } else {
              // Si le mot de passe est incorrect, affichez un message d'erreur
              this.showError = true;
            }
          } else {
            // Si l'utilisateur n'est pas trouvé, affichez un message d'erreur
            this.showError = true;
          }
        } else {
          // En cas d'erreur lors de la récupération des données, affichez un message d'erreur
          console.error('Erreur lors de la récupération des données:', response.statusText);
        }
      } catch (error) {
        // En cas d'erreur, affichez un message d'erreur
        console.error('Une erreur s\'est produite lors de la récupération des données:', error);
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Occupies full screen height */
  background-color: #f0f0f0; /* Light background color */
  font-family: 'Dosis', sans-serif;
  /*font-family: 'Poppins', sans-serif; */
}


.login-form {
  width: 500px; /* Largeur du formulaire */
  max-width: 90%; /* Largeur maximale du formulaire pour s'adapter à différents écrans */
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  font-family: 'Segoe UI', sans-serif; 
}

h2 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 5px;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px; /* Taille de police */
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>