// ============================================
// WEBSITE - PRODUCT DISPLAY (REALTIME + FAST)




import { db } from "./firebase.js";

import {
  collection,
  query,
  where,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// --------------------
// CONFIG
// --------------------
const WHATSAPP_NUMBER = "91XXXXXXXXXX";


// --------------------
let unsubscribeProducts = null;

// --------------------
// LOAD PRODUCTS (REALTIME)
// --------------------

function setupHamburgerMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

function loadProducts(category = "all") {
  const grid = document.getElementById("products-grid");
  const loading = document.getElementById("loading");
  const empty = document.getElementById("empty-state");

  // UI reset
  grid.innerHTML = "";
  loading.style.display = "block";
  empty.style.display = "none";

  // Stop previous listener (IMPORTANT)
  if (unsubscribeProducts) {
    unsubscribeProducts();
    unsubscribeProducts = null;
  }

  // Base query
  let q = query(
    collection(db, "products"),
    where("active", "==", true)
  );

  // Category filter
  if (category !== "all") {
    q = query(
      collection(db, "products"),
      where("active", "==", true),
      where("category", "==", category)
    );
  }

  // 🔥 Realtime listener
  unsubscribeProducts = onSnapshot(
    q,
    (snapshot) => {
      loading.style.display = "none";
      grid.innerHTML = "";

      if (snapshot.empty) {
        empty.style.display = "block";
        empty.innerHTML = "<p>No products found.</p>";
        return;
      }

      snapshot.forEach(docSnap => {
        displayProduct({
          id: docSnap.id,
          ...docSnap.data()
        });
      });
    },
    (error) => {
      console.error("Firestore realtime error:", error);
      loading.style.display = "none";
    }
  );
}

// --------------------
// DISPLAY PRODUCT CARD
// --------------------
function displayProduct(product) {
  const grid = document.getElementById("products-grid");

  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
    <img
      src="${product.imageUrl || "https://via.placeholder.com/300"}"
      alt="${product.name}"
      class="product-image"
      loading="lazy"
    >
    <div class="product-info">
      <h3 class="product-name">${product.name}</h3>
      <p class="product-price">₹${product.price}</p>
      <p class="product-colors">
        <strong>Colors:</strong> ${(product.colors || []).join(", ")}
      </p>
      <button
        class="btn btn-whatsapp"
        onclick="openWhatsApp('${product.name}', ${product.price})">
        Order on WhatsApp
      </button>
    </div>
  `;

  grid.appendChild(card);
}

// --------------------
// WHATSAPP HANDLER
// --------------------
window.openWhatsApp = function (name, price) {
  const message = encodeURIComponent(
    `I want ${name}\nPrice: ₹${price}`
  );
  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
    "_blank"
  );
};

// --------------------
// CATEGORY FILTER
// --------------------
function setupCategoryFilters() {
  const cards = document.querySelectorAll(".category-card");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      const category = card.dataset.category || "all";
      loadProducts(category);
    });
  });
}
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  loadProducts("all");
  setupCategoryFilters();
  setupHamburgerMenu();
});