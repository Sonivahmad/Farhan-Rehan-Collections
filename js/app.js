// ============================================
// CUSTOMER WEBSITE - PRODUCT DISPLAY & WHATSAPP
// ============================================

// WhatsApp number (replace with actual number)
const WHATSAPP_NUMBER = '91XXXXXXXXXX';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

// Initialize application
function initializeApp() {
  // Load products
  loadProducts();
  
  // Setup category filters
  setupCategoryFilters();
  
  // Setup mobile menu toggle
  setupMobileMenu();
}

// Load products from Firestore
async function loadProducts(category = 'all') {
  const productsGrid = document.getElementById('products-grid');
  const loadingEl = document.getElementById('loading');
  const emptyState = document.getElementById('empty-state');
  
  // Show loading
  if (loadingEl) loadingEl.style.display = 'block';
  if (productsGrid) productsGrid.innerHTML = '';
  if (emptyState) emptyState.style.display = 'none';
  
  try {
    let query = db.collection('products').where('active', '==', true);
    
    // If category filter is applied
    if (category !== 'all') {
      query = query.where('category', '==', category);
    }
    
    const snapshot = await query.orderBy('createdAt', 'desc').get();
    
    if (loadingEl) loadingEl.style.display = 'none';
    
    if (snapshot.empty) {
      if (emptyState) {
        emptyState.style.display = 'block';
        emptyState.innerHTML = `
          <p>No products found in this category.</p>
          <p>Please check back later!</p>
        `;
      }
      return;
    }
    
    // Display products
    snapshot.forEach(doc => {
      const product = { id: doc.id, ...doc.data() };
      displayProduct(product, productsGrid);
    });
    
  } catch (error) {
    console.error('Error loading products:', error);
    if (loadingEl) loadingEl.style.display = 'none';
    if (productsGrid) {
      productsGrid.innerHTML = '<p style="text-align: center; color: red;">Error loading products. Please refresh the page.</p>';
    }
  }
}

// Display a single product card
function displayProduct(product, container) {
  const productCard = document.createElement('div');
  productCard.className = 'product-card';
  
  // Format colors
  const colorsText = Array.isArray(product.colors) 
    ? product.colors.join(', ') 
    : product.colors || 'Available';
  
  productCard.innerHTML = `
    <img src="${product.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image'}" 
         alt="${product.name}" 
         class="product-image"
         onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">
    <div class="product-info">
      <h3 class="product-name">${product.name}</h3>
      <div class="product-price">₹${product.price || 'N/A'}</div>
      <div class="product-colors">
        <strong>Colors:</strong> ${colorsText}
      </div>
      <button class="btn btn-whatsapp" onclick="openWhatsApp('${product.name}', ${product.price || 0}, '${colorsText}')">
        Order on WhatsApp
      </button>
    </div>
  `;
  
  container.appendChild(productCard);
}

// Open WhatsApp with pre-filled message
function openWhatsApp(productName, price, colors) {
  const message = encodeURIComponent(
    `I want ${productName}\nPrice: ₹${price}\nAvailable colors: ${colors}`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  window.open(whatsappUrl, '_blank');
}

// Setup category filters
function setupCategoryFilters() {
  const categoryCards = document.querySelectorAll('.category-card');
  
  categoryCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all
      categoryCards.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked
      card.classList.add('active');
      
      // Get category from data attribute or text
      const category = card.dataset.category || card.textContent.trim().toLowerCase().replace(/\s+/g, '');
      
      // Load products for this category
      loadProducts(category === 'all' ? 'all' : card.textContent.trim());
    });
  });
}

// Setup mobile menu toggle
function setupMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
      }
    });
  }
}

// Sticky WhatsApp button click handler
document.addEventListener('DOMContentLoaded', () => {
  const whatsappFloat = document.querySelector('.whatsapp-float');
  if (whatsappFloat) {
    whatsappFloat.addEventListener('click', (e) => {
      e.preventDefault();
      const message = encodeURIComponent('Hello! I would like to know more about your collection.');
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    });
  }
});
