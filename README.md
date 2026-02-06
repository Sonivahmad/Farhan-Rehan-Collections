# Farhan Rehan Collections - Digital Fashion Showroom

A professional digital showroom website for a local Indian clothing shop with WhatsApp ordering integration.

## 🚀 Features

- **Customer Website**: Browse products by category, view details, order via WhatsApp
- **Admin Panel**: Simple product management (Add, Edit, Delete, Enable/Disable)
- **Firebase Integration**: Authentication, Firestore, and Storage
- **Mobile-First Design**: Responsive and optimized for all devices
- **WhatsApp Integration**: Direct ordering through WhatsApp with pre-filled messages

## 📋 Prerequisites

- Firebase account (free tier works)
- Web hosting (Netlify, Vercel, or any static hosting)

## 🔧 Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable the following services:
   - **Authentication**: Enable Email/Password authentication
   - **Firestore Database**: Create database in production mode
   - **Storage**: Enable Firebase Storage

### 2. Firebase Configuration

1. Go to Project Settings → General
2. Scroll down to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Copy your Firebase configuration
5. Open `js/firebase.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Firebase Security Rules

#### Firestore Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products: Read for all, Write for authenticated admin only
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### Storage Rules:
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

### 4. Create Admin Account

1. Go to Firebase Console → Authentication
2. Click "Add user" and create an admin account with email/password
3. Use this account to log in to the admin panel at `admin.html`

### 5. WhatsApp Number Configuration

1. Open `js/app.js`
2. Find the line: `const WHATSAPP_NUMBER = '91XXXXXXXXXX';`
3. Replace with your actual WhatsApp number (with country code, no + sign)

### 6. Update Contact Information

Update the following files with your shop details:
- `index.html` - Footer section
- `about.html` - Shop information
- `contact.html` - Contact details

## 📁 Project Structure

```
/project
 ├── index.html        (Customer website - Home page)
 ├── about.html        (About page)
 ├── contact.html      (Contact page)
 ├── admin.html        (Admin panel)
 ├── css/
 │    ├── style.css    (Customer website styles)
 │    └── admin.css    (Admin panel styles)
 ├── js/
 │    ├── firebase.js  (Firebase configuration)
 │    ├── app.js       (Customer website logic)
 │    └── admin.js     (Admin panel logic)
 └── README.md
```

## 🎯 Usage

### For Customers:
1. Visit `index.html`
2. Browse products by category
3. Click "Order on WhatsApp" to place an order
4. Message is pre-filled with product details

### For Admin:
1. Visit `admin.html`
2. Login with Firebase credentials
3. Add/Edit/Delete products
4. Upload product images
5. Enable/Disable products

## 📱 Deployment

### Netlify:
1. Push code to GitHub
2. Connect repository to Netlify
3. Deploy (no build command needed)

### Vercel:
1. Push code to GitHub
2. Import project in Vercel
3. Deploy (no build command needed)

## 🔒 Security Notes

- Admin authentication is handled by Firebase
- Only authenticated users can modify products
- Public users have read-only access
- No sensitive data is stored in the frontend

## 📝 Product Data Structure

Each product in Firestore has:
```javascript
{
  name: "Product Name",
  price: 3500,
  category: "Bridal",
  colors: ["Red", "Maroon"],
  imageUrl: "firebase-storage-url",
  active: true,
  createdAt: timestamp
}
```

## 🆘 Troubleshooting

- **Products not loading**: Check Firebase configuration and Firestore rules
- **Image upload fails**: Check Storage rules and file size
- **Login not working**: Verify Authentication is enabled in Firebase
- **WhatsApp link not working**: Check WhatsApp number format

## 📞 Support

For issues or questions, refer to Firebase documentation or contact support.

---

**Note**: This is a digital showroom, not a full e-commerce platform. Orders are processed via WhatsApp.
