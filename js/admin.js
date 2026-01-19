// ============================================
// ADMIN PANEL - PRODUCT MANAGEMENT (MODULAR)
// ============================================

import { auth, db, storage } from "./firebase.js";

console.log("firebase.js imported successfully");
console.log("auth:", auth ? "defined" : "undefined", auth);

// Replace the existing import blocks for auth, firestore, storage with these

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-storage.js";

console.log("Auth functions imported?");
console.log("onAuthStateChanged:", typeof onAuthStateChanged === 'function' ? 'YES' : 'NO');
console.log("signInWithEmailAndPassword:", !!signInWithEmailAndPassword);

// ==========================
// UI
// ==========================
// ==========================
// INIT
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded fired - page ready");
  setupEventListeners();
  checkAuthState();
});

// ==========================
// AUTH
// ==========================
function checkAuthState() {
  console.log("checkAuthState() called");
  onAuthStateChanged(auth, (user) => {
    console.log("onAuthStateChanged triggered → user:", user ? user.email : "null / not logged in");
    if (user) {
      console.log("User logged in → showing dashboard");
      showDashboard(user);
    } else {
      console.log("No user → showing login screen");
      showLogin();
    }
  });
}

async function handleLogin(e) {
  e.preventDefault();
  console.log("handleLogin() STARTED - form submitted");

  const email = document.getElementById("admin-email")?.value?.trim() || "";
  const password = document.getElementById("admin-password")?.value || "";
  const alertDiv = document.getElementById("login-alert");

  console.log("Login attempt → email:", email, " | password length:", password.length);

  if (!email || !password) {
    console.warn("Missing email or password");
    showAlert(alertDiv, "Please enter email and password", "error");
    return;
  }

  try {
    console.log("Calling signInWithEmailAndPassword...");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("LOGIN SUCCESS →", userCredential.user.email, "UID:", userCredential.user.uid);
    showAlert(alertDiv, "Login successful!", "success");
    // Force UI update in case listener is slow
    showDashboard(userCredential.user);
  } catch (err) {
    console.error("LOGIN ERROR:", err.code || "unknown", err.message);
    showAlert(alertDiv, err.message || "Login failed – check console", "error");
  }

  console.log("handleLogin() FINISHED");
}

async function logout() {
  console.log("Logout requested");
  await signOut(auth);
  console.log("Signed out successfully");
  showLogin();
  resetForm();
}

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
  console.log("setupEventListeners() called");

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    console.log("Login form FOUND - attaching submit listener");
    loginForm.addEventListener("submit", handleLogin);
  } else {
    console.error("Login form NOT FOUND - check ID or script placement in HTML");
  }

  const productForm = document.getElementById("product-form");
  if (productForm) {
    console.log("Product form FOUND - attaching submit listener");
    productForm.addEventListener("submit", handleProductSubmit);
  }

  const productImage = document.getElementById("product-image");
  if (productImage) {
    console.log("Product image input FOUND - attaching change listener");
    productImage.addEventListener("change", handleImagePreview);
  }
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
