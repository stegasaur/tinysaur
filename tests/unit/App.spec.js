import { mount } from '@vue/test-utils';
import App from '@/frontend/App.vue';
import axios from 'axios';

// Mock Axios
jest.mock('axios');

describe('App.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(App);
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(wrapper.find('h1').text()).toBe('URL Shortener');
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('#urlInput').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').text()).toBe('Shorten URL');
  });

  it('validates URL input', async () => {
    const input = wrapper.find('#urlInput');
    
    // Test empty URL
    await wrapper.find('form').trigger('submit');
    expect(wrapper.vm.urlError).toBe('Please enter a URL');
    
    // Test invalid URL
    await input.setValue('invalid-url');
    await wrapper.find('form').trigger('submit');
    expect(wrapper.vm.urlError).toBe('Please enter a valid URL with http:// or https://');
    
    // Test valid URL
    await input.setValue('https://example.com');
    expect(wrapper.vm.validateUrl('https://example.com')).toBe(true);
  });

  it('successfully shortens a URL', async () => {
    // Mock successful API response
    axios.post.mockResolvedValue({
      data: { shortUrl: 'abc123' }
    });
    
    const input = wrapper.find('#urlInput');
    await input.setValue('https://example.com');
    await wrapper.find('form').trigger('submit');
    
    expect(axios.post).toHaveBeenCalledWith('/api/shorten', { url: 'https://example.com' });
    
    // Wait for async operations to complete
    await wrapper.vm.$nextTick();
    
    expect(wrapper.vm.shortenedUrl).toBe('http://localhost:8000/abc123');
    expect(wrapper.find('.short-url').text()).toBe('http://localhost:8000/abc123');
  });

  it('handles API error', async () => {
    // Mock API error
    axios.post.mockRejectedValue({
      response: {
        data: {
          message: 'Server error'
        }
      }
    });
    
    const input = wrapper.find('#urlInput');
    await input.setValue('https://example.com');
    await wrapper.find('form').trigger('submit');
    
    // Wait for async operations to complete
    await wrapper.vm.$nextTick();
    
    expect(wrapper.vm.apiError).toBe('Server error');
    expect(wrapper.find('.alert-danger').exists()).toBe(true);
  });

  it('copies URL to clipboard', async () => {
    wrapper.vm.shortenedUrl = 'http://localhost:8000/abc123';
    await wrapper.vm.$nextTick();
    
    const copyButton = wrapper.find('.copy-btn');
    await copyButton.trigger('click');
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://localhost:8000/abc123');
    expect(wrapper.vm.copied).toBe(true);
    
    // Fast-forward timers
    jest.useFakeTimers();
    jest.advanceTimersByTime(2000);
    
    expect(wrapper.vm.copied).toBe(false);
    jest.useRealTimers();
  });
});