// ============================================
// CUSTOMER WEBSITE - MODULAR FIREBASE
// ============================================

import { db } from "./firebase.js";

import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const WHATSAPP_NUMBER = "91XXXXXXXXXX";

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  setupCategoryFilters();
});

// ----------------------
// LOAD PRODUCTS
// ----------------------
async function loadProducts(category = "all") {
  const grid = document.getElementById("products-grid");
  const loading = document.getElementById("loading");
  const empty = document.getElementById("empty-state");

  grid.innerHTML = "";
  empty.style.display = "none";
  loading.style.display = "block";

  try {
    let q = query(
      collection(db, "products"),
      where("active", "==", true),
      orderBy("createdAt", "desc")
    );

    if (category !== "all") {
      q = query(
        collection(db, "products"),
        where("active", "==", true),
        where("category", "==", category),
        orderBy("createdAt", "desc")
      );
    }

    const snapshot = await getDocs(q);

    loading.style.display = "none";

    if (snapshot.empty) {
      empty.style.display = "block";
      empty.innerHTML = "<p>No products found.</p>";
      return;
    }

    snapshot.forEach(docSnap => {
      displayProduct({ id: docSnap.id, ...docSnap.data() });
    });

  } catch (err) {
    console.error("Load error:", err);
    loading.style.display = "none";
  }
}

// ----------------------
// DISPLAY PRODUCT
// ----------------------
function displayProduct(product) {
  const grid = document.getElementById("products-grid");

  const div = document.createElement("div");
  div.className = "product-card";

  div.innerHTML = `
    <img src="${product.imageUrl}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>₹${product.price}</p>
    <p>Colors: ${(product.colors || []).join(", ")}</p>
    <button onclick="openWhatsApp('${product.name}', ${product.price})">
      Order on WhatsApp
    </button>
  `;

  grid.appendChild(div);
}

// ----------------------
// WHATSAPP
// ----------------------
window.openWhatsApp = function(name, price) {
  const msg = encodeURIComponent(`I want ${name} for ₹${price}`);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
};

// ----------------------
// CATEGORY FILTER
// ----------------------
function setupCategoryFilters() {
  document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".category-card")
        .forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      const category = card.dataset.category;
      loadProducts(category);
    });
  });
}
