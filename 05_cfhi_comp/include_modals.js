// Modal Loader Script
// This script loads modals from an external modals.html file
// Add this script to your main.html file before the closing </body> tag

(function() {
  // Load modals from external file
  fetch('./modals.html')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      // Extract the modal divs from the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const modals = doc.querySelectorAll('div[id$="_modal"]');
      
      console.log(`Found ${modals.length} modals to load`);
      
      // Append each modal to the body
      modals.forEach(modal => {
        // Check if modal already exists to avoid duplicates
        const existingModal = document.getElementById(modal.id);
        if (!existingModal) {
          document.body.appendChild(modal.cloneNode(true));
          console.log(`Loaded modal: ${modal.id}`);
        } else {
          console.log(`Modal ${modal.id} already exists, skipping`);
        }
      });
      
      // Reinitialize Flowbite modals after loading
      if (typeof window.flowbite !== 'undefined') {
        window.flowbite.initModals();
      }
    })
    .catch(error => {
      console.error('Error loading modals:', error);
      // Fallback: show a message to the user
      const errorDiv = document.createElement('div');
      errorDiv.innerHTML = `
        <div class="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <strong>Warning:</strong> Could not load modal components. Some features may not work properly.
        </div>
      `;
      document.body.appendChild(errorDiv);
    });
})(); 