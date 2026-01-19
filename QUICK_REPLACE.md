# ⚡ QUICK REPLACE GUIDE - Exact Locations

## 🔴 MUST REPLACE (Critical for functionality)

### 1️⃣ `js/firebase.js` - Lines 4-9
```javascript
// BEFORE:
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// AFTER (replace with your Firebase config):
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "my-shop.firebaseapp.com",
  projectId: "my-shop-12345",
  storageBucket: "my-shop-12345.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

### 2️⃣ `js/app.js` - Line 6
```javascript
// BEFORE:
const WHATSAPP_NUMBER = '91XXXXXXXXXX';

// AFTER (your WhatsApp number, no +, no spaces):
const WHATSAPP_NUMBER = '919876543210';
```

---

## 🟡 SHOULD REPLACE (Contact Information)

### 3️⃣ `index.html` - Lines 98-100
```html
<!-- BEFORE: -->
<p>📍 Address: [Your Shop Address]</p>
<p>📞 Phone: [Your Phone Number]</p>
<p>📧 Email: [Your Email]</p>

<!-- AFTER: -->
<p>📍 Address: 123 Main Street, Mumbai, Maharashtra 400001</p>
<p>📞 Phone: +91 9876543210</p>
<p>📧 Email: info@yourshop.com</p>
```

---

### 4️⃣ `contact.html` - Line 39
```html
<!-- BEFORE: -->
<span>[Your Shop Address, City, State, PIN Code]</span>

<!-- AFTER: -->
<span>123 Main Street, Mumbai, Maharashtra 400001</span>
```

---

### 5️⃣ `contact.html` - Line 43
```html
<!-- BEFORE: -->
<span><a href="tel:+91XXXXXXXXXX">+91 XXXXXXXXXX</a></span>

<!-- AFTER: -->
<span><a href="tel:+919876543210">+91 9876543210</a></span>
```

---

### 6️⃣ `contact.html` - Line 47
```html
<!-- BEFORE: -->
<span><a href="mailto:info@example.com">info@example.com</a></span>

<!-- AFTER: -->
<span><a href="mailto:info@yourshop.com">info@yourshop.com</a></span>
```

---

### 7️⃣ `contact.html` - Line 51
```html
<!-- BEFORE: -->
<span><a href="https://wa.me/91XXXXXXXXXX" target="_blank">Click to Chat</a></span>

<!-- AFTER (use same number from js/app.js): -->
<span><a href="https://wa.me/919876543210" target="_blank">Click to Chat</a></span>
```

---

### 8️⃣ `contact.html` - Lines 86-88
```html
<!-- BEFORE: -->
<p>📍 Address: [Your Shop Address]</p>
<p>📞 Phone: [Your Phone Number]</p>
<p>📧 Email: [Your Email]</p>

<!-- AFTER: -->
<p>📍 Address: 123 Main Street, Mumbai, Maharashtra 400001</p>
<p>📞 Phone: +91 9876543210</p>
<p>📧 Email: info@yourshop.com</p>
```

---

### 9️⃣ `about.html` - Lines 85-88
```html
<!-- BEFORE: -->
<p>📍 Address: [Your Shop Address]</p>
<p>📞 Phone: [Your Phone Number]</p>
<p>📧 Email: [Your Email]</p>

<!-- AFTER: -->
<p>📍 Address: 123 Main Street, Mumbai, Maharashtra 400001</p>
<p>📞 Phone: +91 9876543210</p>
<p>📧 Email: info@yourshop.com</p>
```

---

## 🟢 OPTIONAL (Shop Name)

If you want to change "Farhan Rehan Collections":

**Files to update:**
- `index.html` - Line 7, 22, 87
- `about.html` - Line 6, 16, 75
- `contact.html` - Line 6, 16, 75
- `admin.html` - Line 4

**Find:** `Farhan Rehan Collections`  
**Replace with:** `Your Shop Name`

---

## 📋 REPLACEMENT CHECKLIST

- [ ] `js/firebase.js` - Firebase config (Lines 4-9)
- [ ] `js/app.js` - WhatsApp number (Line 6)
- [ ] `index.html` - Footer contact info (Lines 98-100)
- [ ] `contact.html` - Address (Line 39)
- [ ] `contact.html` - Phone (Line 43)
- [ ] `contact.html` - Email (Line 47)
- [ ] `contact.html` - WhatsApp link (Line 51)
- [ ] `contact.html` - Footer contact info (Lines 86-88)
- [ ] `about.html` - Footer contact info (Lines 85-88)
- [ ] (Optional) Shop name in all HTML files

---

## 🎯 PRIORITY ORDER

1. **FIRST:** Firebase config (`js/firebase.js`) - Without this, nothing works
2. **SECOND:** WhatsApp number (`js/app.js`) - Needed for ordering
3. **THIRD:** Contact info - Makes your site professional

---

## ✅ TEST AFTER EACH STEP

After replacing Firebase config:
- Open `index.html` → Check browser console (F12) for errors
- Open `admin.html` → Try to login

After replacing WhatsApp number:
- Click "Order on WhatsApp" button → Should open WhatsApp

After replacing contact info:
- Check footer on all pages → Should show your info
