// ============================================
// ADMIN PANEL - PRODUCT MANAGEMENT (MODULAR)
// ============================================

import { auth, db, storage } from "./firebase.js";

console.log("firebase.js imported successfully");
console.log("auth:", auth ? "defined" : "undefined", auth);

let currentEditingProductId = null;

// ==========================
// INIT
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  checkAuthState();
});

// ==========================
// AUTH
// ==========================
function checkAuthState() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      showDashboard(user);
    } else {
      showLogin();
    }
  });
}

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("admin-email").value;
  const password = document.getElementById("admin-password").value;
  const alertDiv = document.getElementById("login-alert");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    showAlert(alertDiv, "Login successful!", "success");
  } catch (err) {
    showAlert(alertDiv, err.message, "error");
  }
}

async function logout() {
  await signOut(auth);
  showLogin();
  resetForm();
}

// ==========================
// UI
// ==========================
function showLogin() {
  document.getElementById("login-screen").style.display = "flex";
  document.getElementById("admin-dashboard").style.display = "none";
}

function showDashboard(user) {
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("admin-dashboard").style.display = "block";
  document.getElementById("admin-email-display").textContent = user.email;
  loadProducts();
}

function setupEventListeners() {
  document.getElementById("login-form").addEventListener("submit", handleLogin);
  document.getElementById("product-form").addEventListener("submit", handleProductSubmit);
  document.getElementById("product-image").addEventListener("change", handleImagePreview);
}

// ==========================
// PRODUCTS
// ==========================
async function handleProductSubmit(e) {
  e.preventDefault();
  const alertDiv = document.getElementById("form-alert");

  try {
    const data = getProductFormData();

    if (document.getElementById("product-image").files[0]) {
      data.imageUrl = await uploadProductImage(
        document.getElementById("product-image").files[0]
      );
    }

    if (currentEditingProductId) {
      await updateDoc(doc(db, "products", currentEditingProductId), data);
      showAlert(alertDiv, "Product updated successfully!", "success");
    } else {
      await addDoc(collection(db, "products"), {
        ...data,
        createdAt: serverTimestamp()
      });
      showAlert(alertDiv, "Product added successfully!", "success");
    }

    resetForm();
    loadProducts();
  } catch (err) {
    console.error(err);
    showAlert(alertDiv, err.message, "error");
  }
}

function getProductFormData() {
  return {
    name: document.getElementById("product-name").value.trim(),
    category: document.getElementById("product-category").value,
    price: parseFloat(document.getElementById("product-price").value),
    colors: document.getElementById("product-colors")
      .value.split(",").map(c => c.trim()).filter(Boolean),
    active: document.getElementById("product-active").checked
  };
}

// ==========================
// STORAGE
// ==========================
async function uploadProductImage(file) {
  const imageRef = ref(storage, `products/${Date.now()}_${file.name}`);
  await uploadBytes(imageRef, file);
  return await getDownloadURL(imageRef);
}

function handleImagePreview(e) {
  const file = e.target.files[0];
  const container = document.getElementById("image-preview-container");

  if (!file) return (container.innerHTML = "");

  const reader = new FileReader();
  reader.onload = ev => {
    container.innerHTML = `<img src="${ev.target.result}" class="image-preview">`;
  };
  reader.readAsDataURL(file);
}

// ==========================
// LOAD PRODUCTS
// ==========================
async function loadProducts() {
  const tbody = document.getElementById("products-tbody");
  tbody.innerHTML = "";

  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap => {
    const product = { id: docSnap.id, ...docSnap.data() };
    displayProductRow(product, tbody);
  });
}

function displayProductRow(product, tbody) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><img src="${product.imageUrl || "https://via.placeholder.com/80"}"></td>
    <td>${product.name}</td>
    <td>${product.category}</td>
    <td>₹${product.price}</td>
    <td>${product.colors.join(", ")}</td>
    <td>${product.active ? "Active" : "Inactive"}</td>
    <td>
      <button onclick="editProduct('${product.id}')">Edit</button>
      <button onclick="deleteProduct('${product.id}')">Delete</button>
    </td>
  `;
  tbody.appendChild(row);
}

// ==========================
// EDIT / DELETE
// ==========================
window.editProduct = async function (id) {
  const snap = await getDoc(doc(db, "products", id));
  if (!snap.exists()) return;

  const p = snap.data();
  currentEditingProductId = id;

  document.getElementById("product-name").value = p.name;
  document.getElementById("product-category").value = p.category;
  document.getElementById("product-price").value = p.price;
  document.getElementById("product-colors").value = p.colors.join(", ");
  document.getElementById("product-active").checked = p.active;
};

window.deleteProduct = async function (id) {
  if (!confirm("Delete product?")) return;
  await deleteDoc(doc(db, "products", id));
  loadProducts();
};

// ==========================
function resetForm() {
  document.getElementById("product-form").reset();
  currentEditingProductId = null;
}

function showAlert(container, msg, type) {
  container.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
}
