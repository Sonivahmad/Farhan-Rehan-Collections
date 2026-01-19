# 🔧 COMPLETE SETUP GUIDE - What to Replace & Where

Follow these steps **in order** to make your website work completely.

---

## 📍 STEP 1: Firebase Configuration

### File: `js/firebase.js`

**What to do:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Click the **Web icon** (`</>`) to add a web app
4. Copy your Firebase config
5. Replace the placeholder values in `js/firebase.js`

**Replace these lines (4-9):**
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",                    // ← Replace this
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",  // ← Replace this
  projectId: "YOUR_PROJECT_ID",              // ← Replace this
  storageBucket: "YOUR_PROJECT_ID.appspot.com",  // ← Replace this
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // ← Replace this
  appId: "YOUR_APP_ID"                        // ← Replace this
};
```

**Example after replacement:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB1234567890abcdefghijklmnopqrstuv",
  authDomain: "my-shop-12345.firebaseapp.com",
  projectId: "my-shop-12345",
  storageBucket: "my-shop-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

---

## 📍 STEP 2: Enable Firebase Services

### In Firebase Console:

1. **Authentication:**
   - Go to: Authentication → Sign-in method
   - Enable: **Email/Password**
   - Click "Save"

2. **Firestore Database:**
   - Go to: Firestore Database → Create database
   - Choose: **Production mode** (for now)
   - Select location (choose closest to India)
   - Click "Enable"

3. **Storage:**
   - Go to: Storage → Get started
   - Start in **Production mode**
   - Use same location as Firestore
   - Click "Done"

---

## 📍 STEP 3: Set Firebase Security Rules

### Firestore Rules:
1. Go to: Firestore Database → Rules
2. Replace with:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
3. Click "Publish"

### Storage Rules:
1. Go to: Storage → Rules
2. Replace with:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
3. Click "Publish"

---

## 📍 STEP 4: Create Admin Account

### In Firebase Console:
1. Go to: Authentication → Users
2. Click: **Add user**
3. Enter:
   - Email: `admin@yourshop.com` (use your email)
   - Password: (create a strong password)
4. Click: **Add user**
5. **Save these credentials** - you'll use them to login to admin panel

---

## 📍 STEP 5: WhatsApp Number Configuration

### File: `js/app.js`

**Find line 6:**
```javascript
const WHATSAPP_NUMBER = '91XXXXXXXXXX';
```

**Replace with your WhatsApp number:**
- Format: Country code + number (no + sign, no spaces)
- Example: `919876543210` (for Indian number 9876543210)
- Example: `919123456789` (for Indian number 9123456789)

**After replacement:**
```javascript
const WHATSAPP_NUMBER = '919876543210';  // Your actual WhatsApp number
```

---

## 📍 STEP 6: Update Contact Information

### File: `index.html`

**Find lines 98-100 (in footer):**
```html
<p>📍 Address: [Your Shop Address]</p>
<p>📞 Phone: [Your Phone Number]</p>
<p>📧 Email: [Your Email]</p>
```

**Replace with:**
```html
<p>📍 Address: 123 Main Street, City, State 123456</p>
<p>📞 Phone: +91 9876543210</p>
<p>📧 Email: info@yourshop.com</p>
```

---

### File: `contact.html`

**Find line 39:**
```html
<span>[Your Shop Address, City, State, PIN Code]</span>
```
**Replace with your actual address**

**Find line 43:**
```html
<span><a href="tel:+91XXXXXXXXXX">+91 XXXXXXXXXX</a></span>
```
**Replace with your phone number:**
```html
<span><a href="tel:+919876543210">+91 9876543210</a></span>
```

**Find line 47:**
```html
<span><a href="mailto:info@example.com">info@example.com</a></span>
```
**Replace with your email:**
```html
<span><a href="mailto:info@yourshop.com">info@yourshop.com</a></span>
```

**Find line 51:**
```html
<span><a href="https://wa.me/91XXXXXXXXXX" target="_blank">Click to Chat</a></span>
```
**Replace with same WhatsApp number from Step 5:**
```html
<span><a href="https://wa.me/919876543210" target="_blank">Click to Chat</a></span>
```

**Find lines 85-88 (in footer):**
```html
<p>📍 Address: [Your Shop Address]</p>
<p>📞 Phone: [Your Phone Number]</p>
<p>📧 Email: [Your Email]</p>
```
**Replace with your actual contact info**

---

### File: `about.html`

**Find lines 85-88 (in footer):**
```html
<p>📍 Address: [Your Shop Address]</p>
<p>📞 Phone: [Your Phone Number]</p>
<p>📧 Email: [Your Email]</p>
```
**Replace with your actual contact info**

---

## 📍 STEP 7: Update Shop Name (Optional)

If you want to change "Farhan Rehan Collections" to a different name:

### Files to update:
- `index.html` - Line 7 (title), Line 22 (logo), Line 87 (footer)
- `about.html` - Line 6 (title), Line 16 (logo), Line 75 (footer)
- `contact.html` - Line 6 (title), Line 16 (logo), Line 75 (footer)
- `admin.html` - Line 4 (title)

**Find and replace:** `Farhan Rehan Collections` with your shop name

---

## ✅ TESTING CHECKLIST

After completing all steps:

### Test Customer Website:
1. Open `index.html` in browser
2. Check if products load (will be empty initially - that's normal)
3. Click "Order on WhatsApp" button - should open WhatsApp
4. Test category filters
5. Test mobile menu (resize browser)

### Test Admin Panel:
1. Open `admin.html` in browser
2. Login with Firebase credentials (from Step 4)
3. Try adding a product:
   - Fill all fields
   - Upload an image
   - Click "Save Product"
4. Check if product appears on customer website
5. Test Edit and Delete functions

---

## 🚨 COMMON ISSUES & FIXES

### Issue: "Products not loading"
- **Fix:** Check Firebase config in `js/firebase.js`
- **Fix:** Check Firestore rules (Step 3)
- **Fix:** Make sure Firestore is enabled

### Issue: "Cannot login to admin"
- **Fix:** Check if Email/Password auth is enabled (Step 2)
- **Fix:** Verify admin account exists (Step 4)
- **Fix:** Check browser console for errors

### Issue: "Image upload fails"
- **Fix:** Check Storage rules (Step 3)
- **Fix:** Make sure Storage is enabled (Step 2)
- **Fix:** Check image file size (should be under 5MB)

### Issue: "WhatsApp link not working"
- **Fix:** Check WhatsApp number format in `js/app.js` (Step 5)
- **Fix:** Number should be: country code + number (no +, no spaces)
- **Fix:** Test the link manually: `https://wa.me/YOUR_NUMBER`

---

## 📝 QUICK REFERENCE

| What | Where | Example |
|------|-------|---------|
| Firebase Config | `js/firebase.js` | Lines 4-9 |
| WhatsApp Number | `js/app.js` | Line 6 |
| Shop Address | `index.html`, `contact.html`, `about.html` | Footer sections |
| Phone Number | `contact.html` | Lines 43, 51, 87 |
| Email | `contact.html` | Lines 47, 88 |

---

## 🎉 YOU'RE DONE!

Once all steps are complete:
1. Your website is ready to use
2. Add products via admin panel
3. Customers can browse and order via WhatsApp
4. Deploy to Netlify/Vercel when ready

**Need help?** Check browser console (F12) for error messages.
