// Importez les dépendances nécessaires
import { createApp } from 'vue';
import InterfaceAdmin from '@/components/InterfacAdmin.vue';

// Définissez le test d'intégration
describe('InterfaceAdmin Component', () => {
  test('renders correctly', () => {
    // Créez un élément de test
    const root = document.createElement('div');
    root.id = 'app';
    document.body.appendChild(root);

    // Créez une instance de l'application Vue avec le composant InterfaceAdmin
    const app = createApp(InterfaceAdmin);
    app.mount('#app');

    // Vérifiez que le composant est rendu correctement
    expect(document.querySelector('.interface-admin')).toBeTruthy();

    // Supprimez l'élément de test du DOM après le test
    document.body.removeChild(root);
  });

  // Vous pouvez ajouter d'autres tests d'intégration ici
});
