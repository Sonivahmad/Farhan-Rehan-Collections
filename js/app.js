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
const WHATSAPP_NUMBER = "917701853043";


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
        data-name="${product.name || ''}"
        data-price="${product.price || 0}"
        data-colors="${(product.colors || []).join(', ')}"
        data-image="${product.imageUrl || ''}"
        data-desc="${product.description || ''}"   // ← make sure this field exists in Firestore
      >
        Order on WhatsApp
      </button>
    </div>
  `;

  grid.appendChild(card);
}

// --------------------
// WHATSAPP HANDLER – UPDATED VERSION
// --------------------
window.openWhatsApp = function (buttonElement) {
  // Read all data from the button
  const name        = buttonElement.dataset.name        || "Product";
  const price       = buttonElement.dataset.price       || "0";
  const colors      = buttonElement.dataset.colors      || "";
  const imageUrl    = buttonElement.dataset.image       || "";
  const description = buttonElement.dataset.desc        || "";

  // Build a clean, professional message (use WhatsApp markdown for bold/emoji)
  let message = `Hello! I'm interested in this product:\n\n`;
  message += `*${name}*\n`;                    // bold name
  message += `💰 *Price:* ₹${price}\n`;

  if (colors.trim()) {
    message += `🎨 *Colors:* ${colors}\n`;
  }

  if (description.trim()) {
    message += `\n${description}\n\n`;         // extra line for readability
  }

  if (imageUrl.trim()) {
    message += `🖼️ *Product Image:*\n${imageUrl}\n\n`;
  }

  message += `Please check availability, size options, and help me place the order. Thank you! 🙏`;

  // Encode and open WhatsApp
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  window.open(whatsappUrl, "_blank");
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
document.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("btn-whatsapp")) {
    openWhatsApp(e.target);          // pass the button element itself
  }
});

