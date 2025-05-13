// AURA Loading System
// Provides functionality for showing/hiding various loading indicators

/**
 * Global Loader functionality
 */
const AURALoader = {
  // Global loader element reference
  loaderElement: null,
  loaderTextElement: null,
  
  // Initialization function
  init: function() {
    // Get references to loader elements
    this.loaderElement = document.querySelector('.global-loader-overlay');
    this.loaderTextElement = document.querySelector('.loader-text');
    
    // Hide loader after initial page load with a small delay
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.hideGlobalLoader();
      }, 500);
    });
    
    // Add navigation listeners
    this.setupNavigationLoaders();
    
    console.log('AURA Loader system initialized');
    
    // Show global loader by default (for initial page load)
    this.showGlobalLoader();
  },
  
  // Show the global loader with optional custom message
  showGlobalLoader: function(message = 'Loading AURA...') {
    if (!this.loaderElement) return;
    
    // Update message if provided
    if (this.loaderTextElement) {
      this.loaderTextElement.textContent = message;
    }
    
    // Show the loader
    this.loaderElement.classList.add('visible');
  },
  
  // Hide the global loader
  hideGlobalLoader: function() {
    if (!this.loaderElement) return;
    
    // Hide the loader
    this.loaderElement.classList.remove('visible');
  },
  
  // Set up loading indicators for page navigation
  setupNavigationLoaders: function() {
    // Find all navigation links
    const navLinks = document.querySelectorAll('.nav-links a[data-page]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const pageName = link.getAttribute('data-page');
        this.showGlobalLoader(`Loading ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}...`);
        
        // Hide loader after a brief delay (simulating page load)
        setTimeout(() => {
          this.hideGlobalLoader();
        }, 800);
      });
    });
  },
  
  // Create and display an inline loader in a container
  showInlineLoader: function(container) {
    if (!container) return;
    
    // Create spinner element
    const spinner = document.createElement('div');
    spinner.className = 'content-spinner';
    
    // Clear container and add spinner
    container.innerHTML = '';
    container.appendChild(spinner);
  },
  
  // Apply loading state to a button
  setButtonLoading: function(button, isLoading = true) {
    if (!button) return;
    
    if (isLoading) {
      // Store original button text
      button.setAttribute('data-original-text', button.innerHTML);
      
      // Add loading class
      button.classList.add('btn-loading');
      
      // Create and add spinner
      const spinner = document.createElement('div');
      spinner.className = 'inline-spinner';
      button.appendChild(spinner);
    } else {
      // Remove loading class
      button.classList.remove('btn-loading');
      
      // Restore original text
      const originalText = button.getAttribute('data-original-text');
      if (originalText) {
        button.innerHTML = originalText;
      }
    }
  }
};

// Initialize the loader system when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  AURALoader.init();
});
