// ============================================
// ADMIN PANEL - PRODUCT MANAGEMENT
// ============================================

let currentEditingProductId = null;

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
  checkAuthState();
  setupEventListeners();
});

// Check authentication state
function checkAuthState() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      showDashboard(user);
    } else {
      showLogin();
    }
  });
}

// Show login screen
function showLogin() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('admin-dashboard').style.display = 'none';
}

// Show dashboard
function showDashboard(user) {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('admin-dashboard').style.display = 'block';
  document.getElementById('admin-email-display').textContent = user.email;
  loadProducts();
}

// Setup event listeners
function setupEventListeners() {
  // Login form
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  
  // Product form
  document.getElementById('product-form').addEventListener('submit', handleProductSubmit);
  
  // Image preview
  document.getElementById('product-image').addEventListener('change', handleImagePreview);
}

// Handle login
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;
  const alertDiv = document.getElementById('login-alert');
  
  try {
    await auth.signInWithEmailAndPassword(email, password);
    showAlert(alertDiv, 'Login successful!', 'success');
  } catch (error) {
    showAlert(alertDiv, error.message, 'error');
  }
}

// Handle logout
function logout() {
  auth.signOut().then(() => {
    showLogin();
    resetForm();
  });
}

// Handle product form submit
async function handleProductSubmit(e) {
  e.preventDefault();
  const alertDiv = document.getElementById('form-alert');
  
  try {
    const productData = getProductFormData();
    
    // Upload image if new file selected
    if (document.getElementById('product-image').files[0]) {
      productData.imageUrl = await uploadProductImage(document.getElementById('product-image').files[0]);
    }
    
    if (currentEditingProductId) {
      // Update existing product
      await db.collection('products').doc(currentEditingProductId).update(productData);
      showAlert(alertDiv, 'Product updated successfully!', 'success');
    } else {
      // Add new product
      productData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection('products').add(productData);
      showAlert(alertDiv, 'Product added successfully!', 'success');
    }
    
    resetForm();
    loadProducts();
    
    // Clear alert after 3 seconds
    setTimeout(() => {
      alertDiv.innerHTML = '';
    }, 3000);
    
  } catch (error) {
    console.error('Error saving product:', error);
    showAlert(alertDiv, 'Error: ' + error.message, 'error');
  }
}

// Get product form data
function getProductFormData() {
  const colors = document.getElementById('product-colors').value
    .split(',')
    .map(c => c.trim())
    .filter(c => c);
  
  return {
    name: document.getElementById('product-name').value.trim(),
    category: document.getElementById('product-category').value,
    price: parseFloat(document.getElementById('product-price').value),
    colors: colors,
    active: document.getElementById('product-active').checked
  };
}

// Upload product image
async function uploadProductImage(file) {
  const storageRef = storage.ref();
  const imageRef = storageRef.child(`products/${Date.now()}_${file.name}`);
  
  try {
    const snapshot = await imageRef.put(file);
    const downloadURL = await snapshot.ref.getDownloadURL();
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

// Handle image preview
function handleImagePreview(e) {
  const file = e.target.files[0];
  const previewContainer = document.getElementById('image-preview-container');
  
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      previewContainer.innerHTML = `<img src="${event.target.result}" alt="Preview" class="image-preview">`;
    };
    reader.readAsDataURL(file);
  } else {
    previewContainer.innerHTML = '';
  }
}

// Load products
async function loadProducts() {
  const loadingEl = document.getElementById('products-loading');
  const emptyEl = document.getElementById('products-empty');
  const tableEl = document.getElementById('products-table');
  const tbody = document.getElementById('products-tbody');
  
  loadingEl.style.display = 'block';
  emptyEl.style.display = 'none';
  tableEl.style.display = 'none';
  tbody.innerHTML = '';
  
  try {
    const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
    
    loadingEl.style.display = 'none';
    
    if (snapshot.empty) {
      emptyEl.style.display = 'block';
      return;
    }
    
    tableEl.style.display = 'table';
    
    snapshot.forEach(doc => {
      const product = { id: doc.id, ...doc.data() };
      displayProductRow(product, tbody);
    });
    
  } catch (error) {
    console.error('Error loading products:', error);
    loadingEl.style.display = 'none';
    showAlert(emptyEl, 'Error loading products: ' + error.message, 'error');
    emptyEl.style.display = 'block';
  }
}

// Display product row in table
function displayProductRow(product, tbody) {
  const row = document.createElement('tr');
  
  const colorsText = Array.isArray(product.colors) 
    ? product.colors.join(', ') 
    : product.colors || 'N/A';
  
  row.innerHTML = `
    <td>
      <img src="${product.imageUrl || 'https://via.placeholder.com/80x80?text=No+Image'}" 
           alt="${product.name}"
           onerror="this.src='https://via.placeholder.com/80x80?text=No+Image'">
    </td>
    <td>${product.name}</td>
    <td>${product.category || 'N/A'}</td>
    <td>₹${product.price || 'N/A'}</td>
    <td>${colorsText}</td>
    <td>
      <span class="product-status ${product.active ? 'active' : 'inactive'}">
        ${product.active ? 'Active' : 'Inactive'}
      </span>
    </td>
    <td>
      <div class="action-buttons">
        <button class="btn btn-success" onclick="editProduct('${product.id}')">Edit</button>
        <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">Delete</button>
      </div>
    </td>
  `;
  
  tbody.appendChild(row);
}

// Edit product
async function editProduct(productId) {
  try {
    const doc = await db.collection('products').doc(productId).get();
    
    if (!doc.exists) {
      alert('Product not found');
      return;
    }
    
    const product = doc.data();
    currentEditingProductId = productId;
    
    // Fill form
    document.getElementById('product-name').value = product.name || '';
    document.getElementById('product-category').value = product.category || '';
    document.getElementById('product-price').value = product.price || '';
    document.getElementById('product-colors').value = Array.isArray(product.colors) 
      ? product.colors.join(', ') 
      : product.colors || '';
    document.getElementById('product-active').checked = product.active !== false;
    
    // Show existing image
    if (product.imageUrl) {
      document.getElementById('image-preview-container').innerHTML = 
        `<img src="${product.imageUrl}" alt="Current Image" class="image-preview">`;
    }
    
    // Update form title and buttons
    document.getElementById('form-title').textContent = 'Edit Product';
    document.getElementById('submit-btn').textContent = 'Update Product';
    document.getElementById('cancel-btn').style.display = 'block';
    document.getElementById('product-image').required = false;
    
    // Scroll to form
    document.querySelector('.product-form').scrollIntoView({ behavior: 'smooth' });
    
  } catch (error) {
    console.error('Error loading product:', error);
    alert('Error loading product: ' + error.message);
  }
}

// Delete product
async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) {
    return;
  }
  
  try {
    await db.collection('products').doc(productId).delete();
    loadProducts();
    alert('Product deleted successfully!');
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('Error deleting product: ' + error.message);
  }
}

// Reset form
function resetForm() {
  document.getElementById('product-form').reset();
  document.getElementById('product-id').value = '';
  document.getElementById('image-preview-container').innerHTML = '';
  document.getElementById('form-title').textContent = 'Add New Product';
  document.getElementById('submit-btn').textContent = 'Save Product';
  document.getElementById('cancel-btn').style.display = 'none';
  document.getElementById('product-image').required = true;
  currentEditingProductId = null;
}

// Show alert
function showAlert(container, message, type) {
  container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}
