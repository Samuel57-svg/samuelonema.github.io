import { createRouter, createWebHistory } from 'vue-router';
import HelloWorld from '@/components/HelloWorld.vue'; 
import DashBoard from '@/components/DashBoard.vue';
import DossierView from '@/components/DossierView.vue';
import DossierViewDrh from '@/components/DossierViewDrh.vue';
import DocumentView from '@/components/DocumentView.vue';
import DocumentViewDrh from '@/components/DocumentViewDrh.vue';
import DocumentViewAgent from '@/components/DocumentViewAgent.vue';
import ViewAgent from '@/components/ViewAgent.vue';
import InterfaceDrh from '@/components/InterfaceDrh.vue';
import InterfaceAdmin from '@/components/InterfaceAdmin.vue';
import GraphiqueAgentsParCategorie from '@/components/GraphiqueAgentsParCategorie.vue';

const routes = [
  {
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/:id' ,
    name: 'DashBoard',
    component: DashBoard,
    props: true,
    meta: { requiresAuth: true },
    
  },
  {
    path: '/documentViewAgent/:id' ,
    name: 'DocumentViewAgent',
    component: DocumentViewAgent,
    props: true,
    meta: { requiresAuth: true },
    
  },
  {
    path: '/viewAgent/:id' ,
    name: 'ViewAgent',
    component: ViewAgent,
    props: true,
    meta: { requiresAuth: true },
    
  },
  {
    path: '/interfacedrh/:id' ,
    name: 'InterfaceDrh',
    component: InterfaceDrh,
    props: true,
    meta: { requiresAuth: true },
    
  },
  {
    path: '/interfaceAdmin/:id' ,
    name: 'InterfaceAdmin',
    component: InterfaceAdmin,
    props: true,
    meta: { requiresAuth: true },
    
  },
  {
    path: '/dashboard/:id/graph',
    name: 'DashboardGraph',
    component: GraphiqueAgentsParCategorie, //Remplacez-le par le nom de votre composant
    meta: { requiresAuth: true }
  },
  
  {
    path: '/agents/:id/:name_category',
    name: 'DossierView',
    component: DossierView,
    meta: { requiresAuth: true }
  },

  {
    path: '/agents/drh/:id/:name_category',
    name: 'DossierViewDrh',
    component: DossierViewDrh,
    meta: { requiresAuth: true }
  }, 
  {
    path: '/document/:id/:name_category/:name',
    name: 'DocumentView',
    component: DocumentView,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/document_drh/:id/:name_category/:name',
    name: 'DocumentViewDrh',
    component: DocumentViewDrh,
    props: true,
    meta: { requiresAuth: true }
  },
 
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


export default router;