// ============================================
// ADMIN PANEL - PRODUCT MANAGEMENT (MODULAR)
// ============================================
let editingProductId = null;

import { auth, db, storage } from "./firebase.js";

console.log("1. firebase.js imported successfully");
console.log("2. auth:", auth ? "defined" : "undefined", auth);

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

console.log("3. Auth functions imported OK");


// ==========================
// INIT - Wait for DOM ready
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  console.log("4. DOMContentLoaded - page fully loaded, setting up...");
  setupEventListeners();
  checkAuthState();
});

// ==========================
// AUTH FUNCTIONS (NOW DEFINED)
// ==========================
function checkAuthState() {
  console.log("5. checkAuthState started");
  onAuthStateChanged(auth, (user) => {
    console.log("6. Auth state changed → user:", user ? user.email : "logged out");
    if (user) {
      showDashboard(user);
    } else {
      showLogin();
    }
  });
}

async function handleLogin(e) {
  e.preventDefault();
  console.log("7. LOGIN FORM SUBMITTED!");

  const email = document.getElementById("admin-email").value.trim();
  const password = document.getElementById("admin-password").value;
  const alertDiv = document.getElementById("login-alert");

  console.log("8. Login attempt:", email);

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log("9. LOGIN SUCCESS:", result.user.email);
    showAlert(alertDiv, "Login successful!", "success");
  } catch (err) {
    console.error("10. LOGIN ERROR:", err.message);
    showAlert(alertDiv, err.message, "error");
  }
}

async function logout() {
  console.log("Logout clicked");
  await signOut(auth);
  showLogin();
  resetForm();
}

// ==========================
// UI FUNCTIONS
// ==========================
function showLogin() {
  console.log("Showing login screen");
  document.getElementById("login-screen").style.display = "flex";
  document.getElementById("admin-dashboard").style.display = "none";
}

function showDashboard(user) {
  console.log("11. Showing dashboard for:", user.email);
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("admin-dashboard").style.display = "block";
  document.getElementById("admin-email-display").textContent = user.email;
  loadProducts();
}

function setupEventListeners() {
  console.log("12. setupEventListeners called");

  // Login form
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    console.log("✅ Login form FOUND - attaching listener");
    loginForm.addEventListener("submit", handleLogin);
  } else {
    console.error("❌ Login form NOT FOUND - HTML ID mismatch?");
  }

  // Product form  
  const productForm = document.getElementById("product-form");
  if (productForm) {
    console.log("✅ Product form FOUND - attaching listener");
    productForm.addEventListener("submit", handleProductSubmit);
  } else {
    console.error("❌ Product form NOT FOUND");
  }

  // Image preview
  const productImage = document.getElementById("product-image");
  if (productImage) {
    console.log("✅ Product image FOUND - attaching preview");
    productImage.addEventListener("change", handleImagePreview);
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    console.log("✅ Logout listener attached");
    logoutBtn.addEventListener("click", logout);
  }
}

// ==========================
// PRODUCT FUNCTIONS (with logs)
// ==========================
async function handleProductSubmit(e) {
  e.preventDefault();

  const alertDiv = document.getElementById("form-alert");
  const btn = document.getElementById("submit-btn");

  btn.disabled = true;
  btn.textContent = "Saving...";

  try {
    const data = getProductFormData();

    // 1️⃣ Save product WITHOUT image first (FAST)
    const docRef = await addDoc(collection(db, "products"), {
      ...data,
      imageUrl: "",
      createdAt: new Date()
    });

    showAlert(alertDiv, "Product saved (uploading image…)", "info");
    loadProducts(); // instantly show product

    // 2️⃣ Upload image AFTER save
    const imageFile = document.getElementById("product-image").files[0];
    if (imageFile) {
      const imageUrl = await uploadProductImage(imageFile);
      await updateDoc(doc(db, "products", docRef.id), {
        imageUrl
      });
    }

    showAlert(alertDiv, "✅ Product added successfully", "success");
    resetForm();
    loadProducts();

  } catch (err) {
    console.error(err);
    showAlert(alertDiv, err.message, "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Save Product";
  }
}



// ... rest of your functions unchanged (getProductFormData, uploadProductImage, etc.)
function getProductFormData() {
  return {
    name: document.getElementById("product-name").value.trim(),
    category: document.getElementById("product-category").value,
    price: parseFloat(document.getElementById("product-price").value) || 0,
    colors: document.getElementById("product-colors").value.split(",").map(c => c.trim()).filter(Boolean),
    active: document.getElementById("product-active").checked
  };
}

async function uploadProductImage(file) {
  const imageRef = ref(storage, `products/${Date.now()}_${file.name}`);
  await uploadBytes(imageRef, file);
  return await getDownloadURL(imageRef);
}

function handleImagePreview(e) {
  const file = e.target.files[0];
  const container = document.getElementById("image-preview-container");
  if (!file) return container.innerHTML = "";
  
  const reader = new FileReader();
  reader.onload = ev => container.innerHTML = `<img src="${ev.target.result}" class="image-preview">`;
  reader.readAsDataURL(file);
}

async function loadProducts() {
  console.log("🧾 Loading products from Firestore...");

  const table = document.getElementById("products-table");
  const tbody = document.getElementById("products-tbody");
  const empty = document.getElementById("products-empty");

  tbody.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "products"));

    console.log("📊 Total products found:", snapshot.size);

    if (snapshot.empty) {
      table.style.display = "none";
      empty.style.display = "block";
      return;
    }

    // ✅ SHOW TABLE
    table.style.display = "table";
    empty.style.display = "none";

    snapshot.forEach(docSnap => {
      console.log("➡ Product:", docSnap.id, docSnap.data());
      displayProductRow(
        { id: docSnap.id, ...docSnap.data() },
        tbody
      );
    });

  } catch (err) {
    console.error("❌ Load products error:", err);
  }
}


function displayProductRow(product, tbody) {
  const row = document.createElement("tr");
    // 1. Set the text/images
    row.innerHTML = `
    <td><img src="${product.imageUrl || ''}" style="width:60px;height:60px;object-fit:cover"></td>
    <td>${product.name}</td>
    <td>${product.category}</td>
    <td>₹${product.price}</td>
    <td>${(product.colors||[]).join(", ")}</td>
    <td>${product.active ? "Active" : "Inactive"}</td>
    <td class="actions"></td> 
  `;

  // 2. Create buttons manually (This avoids CSP issues)
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "btn-edit";
  editBtn.addEventListener("click", () => editProduct(product.id));

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "btn-delete";
  deleteBtn.addEventListener("click", () => deleteProduct(product.id));

  // 3. Add them to the last cell
  row.querySelector(".actions").appendChild(editBtn);
  row.querySelector(".actions").appendChild(deleteBtn);

  tbody.appendChild(row);
}


window.editProduct = async function(id) {
  const snap = await getDoc(doc(db, "products", id));
  if (!snap.exists()) return;

  const p = snap.data();
  editingProductId = id;

  document.getElementById("edit-name").value = p.name || "";
  document.getElementById("edit-price").value = p.price || 0;
  document.getElementById("edit-colors").value = (p.colors || []).join(", ");

  const preview = document.getElementById("edit-image-preview");
  if (p.imageUrl) {
    preview.src = p.imageUrl;
    preview.style.display = "block";
  } else {
    preview.style.display = "none";
  }

  document.getElementById("edit-modal").classList.remove("hidden");
};


window.deleteProduct = async function(id) {
  const confirmed = await customConfirm("Delete this product?");
  if (!confirmed) return;

  const scrollY = window.scrollY;

  await deleteDoc(doc(db, "products", id));
  loadProducts();

  window.scrollTo(0, scrollY);
};


function resetForm() {
  document.getElementById("product-form").reset();
  document.getElementById("image-preview-container").innerHTML = "";
}

function showAlert(container, msg, type) {
  container.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
  setTimeout(() => container.innerHTML = "", 5000);
}
function customConfirm(message) {
  return new Promise(resolve => {
    const modal = document.getElementById("confirm-modal");
    const text = document.getElementById("confirm-text");

    text.textContent = message;
    modal.classList.remove("hidden");

    document.getElementById("confirm-yes").onclick = () => {
      modal.classList.add("hidden");
      resolve(true);
    };

    document.getElementById("confirm-no").onclick = () => {
      modal.classList.add("hidden");
      resolve(false);
    };
  });
}
document.getElementById("edit-save").onclick = async () => {
  if (!editingProductId) return;

  const data = {
    name: document.getElementById("edit-name").value,
    price: Number(document.getElementById("edit-price").value),
    colors: document.getElementById("edit-colors").value
      .split(",")
      .map(c => c.trim())
  };

  const imageFile = document.getElementById("edit-image").files[0];
  if (imageFile) {
    data.imageUrl = await uploadProductImage(imageFile);
  }

  await updateDoc(doc(db, "products", editingProductId), data);

  document.getElementById("edit-modal").classList.add("hidden");
  editingProductId = null;

  loadProducts();
};

document.getElementById("edit-cancel").onclick = () => {
  document.getElementById("edit-modal").classList.add("hidden");
  editingProductId = null;
};
