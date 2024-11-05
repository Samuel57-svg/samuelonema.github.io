import { shallowMount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import DashBoard from '@/components/DashBoard.vue';

describe('DashBoard.vue', () => {
  const mockRouter = createRouter({
    history: createWebHistory(),
    routes: []
  });

  it('renders correctly', () => {
    const wrapper = shallowMount(DashBoard, {
      global: {
        plugins: [mockRouter]
      }
    });

    // Vos assertions ici
  });
});
