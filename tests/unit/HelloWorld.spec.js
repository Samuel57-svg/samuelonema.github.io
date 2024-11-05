import { mount } from '@vue/test-utils';
import HelloWorld from '@/components/HelloWorld.vue';

describe('HelloWorld.vue', () => {

  it('toggles password visibility when eye icon is clicked', async () => {
    const wrapper = mount(HelloWorld);
    expect(wrapper.find('#password').attributes('type')).toBe('password');
    await wrapper.find('button.btn-outline-secondary').trigger('click');
    expect(wrapper.find('#password').attributes('type')).toBe('text');
  });
});
