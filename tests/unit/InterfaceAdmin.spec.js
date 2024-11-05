import { shallowMount } from '@vue/test-utils';
import InterfaceAdmin from '@/components/InterfacAdmin.vue';

describe('InterfaceAdmin', () => {
  it('renders correctly', () => {
    const wrapper = shallowMount(InterfaceAdmin);
    expect(wrapper.exists()).toBe(true);
  });

  it('toggles password visibility when eye icon is clicked', async () => {
    const wrapper = shallowMount(InterfaceAdmin);
    const eyeIcon = wrapper.find('.eye-icon');

    expect(wrapper.vm.passwordVisible).toBe(false); // By default, passwordVisible should be false

    await eyeIcon.trigger('click'); // Simulate a click on the eye icon
    expect(wrapper.vm.passwordVisible).toBe(true); // Password visibility should be toggled to true

    await eyeIcon.trigger('click'); // Simulate another click on the eye icon
    expect(wrapper.vm.passwordVisible).toBe(false); // Password visibility should be toggled back to false
  });

  // Add more test cases as needed
});
