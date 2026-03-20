# Worldwide Collab - File Structure Guide
## 📁 Project Structure

```
worldwidecollab/
├── index.html              ← Main homepage
├── payment.html            ← Payment page (Dynamic QR)
├── login.html              ← Login / Register page
├── register.html           ← (use login.html - combined)
├── favicon.png             ← Your favicon
├── logo.png                ← Your logo image
│
├── css/
│   ├── styles.css          ← Main shared stylesheet (index.html)
│   ├── payment.css         ← Payment page styles
│   └── auth.css            ← Login/Register page styles
│
└── js/
    ├── app.js              ← Shared JS (header, sidebar, carousel etc.)
    ├── services.js         ← SMM services, platform selection, order logic
    ├── qr-system.js        ← 🔥 Dynamic QR Code system
    ├── payment.js          ← Payment page logic
    └── auth.js             ← Login/Register Firebase logic
```

---

## 🔗 How to Link Files in index.html

Add these in `<head>`:
```html
<link rel="stylesheet" href="css/styles.css">
```

Add these before `</body>`:
```html
<script>
  const WWC_CONFIG = {
    adminEmail: 'team.wwcollab@gmail.com',
    emailjsUserId: '5Gvu19EQdBGPu9fXt',
    emailjsServiceId: 'service_xctfgme',
    emailjsTemplateId: 'template_9lzbn59',
    upiId: 'nextune@upi',
    upiName: 'Worldwide Collab'
  };
</script>
<script src="js/app.js"></script>
<script src="js/services.js"></script>
```

---

## 🔥 Dynamic QR Code System

### Features:
- ✅ **Real UPI QR codes** — works with ALL UPI apps
- ✅ **Amount auto-embedded** in QR (no manual entry needed)
- ✅ **Works with**: Google Pay, PhonePe, Paytm, BHIM, Amazon Pay, any UPI app
- ✅ **Download QR** as PNG
- ✅ **"Open UPI App"** button for mobile users
- ✅ Canvas-based — no external image dependency
- ✅ UPI logo badge overlaid on QR center

### UPI URL Format used:
```
upi://pay?pa=nextune@upi&pn=Worldwide+Collab&am=500&cu=INR&tn=Order+WWC-123456
```

### How QR is generated:
1. Order placed → amount + order ID stored in sessionStorage
2. payment.html loads → reads order data
3. `qr-system.js` builds UPI URL with exact amount
4. QRCode.js renders it on `<canvas>`
5. UPI logo badge added at center
6. User scans → their UPI app auto-fills amount ✅

---

## ⚙️ To update your UPI ID:

In `payment.html` and all JS files, find:
```javascript
upiId: 'nextune@upi'
```
Replace with your actual UPI ID.

---

## 📱 Compatibility

| UPI App | Works? |
|---------|--------|
| Google Pay | ✅ |
| PhonePe | ✅ |
| Paytm | ✅ |
| BHIM | ✅ |
| Amazon Pay | ✅ |
| Any UPI App | ✅ |

---

## 🛠️ Remove Old Inline Styles/Scripts from index.html

1. Delete all `<style>` tags from `index.html`
2. Add `<link rel="stylesheet" href="css/styles.css">` in `<head>`
3. Delete all `<script>` blocks at bottom of `index.html`
4. Add the script tags listed above before `</body>`
