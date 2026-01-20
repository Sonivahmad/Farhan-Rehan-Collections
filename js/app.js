// ============================================
// WEBSITE - PRODUCT DISPLAY (MODULAR FIREBASE)
// ============================================

import { db } from "./firebase.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const WHATSAPP_NUMBER = "91XXXXXXXXXX";

document.addEventListener("DOMContentLoaded", () => {
  loadProducts("all");
  setupCategoryFilters();
});

// --------------------
// LOAD PRODUCTS
// --------------------
async function loadProducts(category) {
  const grid = document.getElementById("products-grid");
  const loading = document.getElementById("loading");
  const empty = document.getElementById("empty-state");

  grid.innerHTML = "";
  loading.style.display = "block";
  empty.style.display = "none";

  try {
    let q = query(
      collection(db, "products"),
      where("active", "==", true)
    );

    if (category !== "all") {
      q = query(
        collection(db, "products"),
        where("active", "==", true),
        where("category", "==", category)
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
    console.error("Website load error:", err);
  }
}

// --------------------
// DISPLAY PRODUCT
// --------------------
function displayProduct(product) {
  const grid = document.getElementById("products-grid");

  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
    <img src="${product.imageUrl}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>₹${product.price}</p>
    <p>Colors: ${(product.colors || []).join(", ")}</p>
    <button onclick="openWhatsApp('${product.name}', ${product.price})">
      Order on WhatsApp
    </button>
  `;

  grid.appendChild(card);
}

// --------------------
// WHATSAPP
// --------------------
window.openWhatsApp = function (name, price) {
  const msg = encodeURIComponent(`I want ${name} for ₹${price}`);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
};

// --------------------
// CATEGORY FILTER
// --------------------
function setupCategoryFilters() {
  document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".category-card")
        .forEach(c => c.classList.remove("active"));

      card.classList.add("active");
      loadProducts(card.dataset.category || "all");
    });
  });
}
