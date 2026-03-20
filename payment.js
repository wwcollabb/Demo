/* =====================================================
   WORLDWIDE COLLAB - Payment Page Logic
   payment.js
   ===================================================== */

'use strict';

let orderData = null;
let timeLeft = 300; // 5 min
let timerInterval = null;

// ===== ON PAGE LOAD =====
window.addEventListener('DOMContentLoaded', () => {
  loadOrderData();
  startCountdownTimer();
});

// ===== LOAD ORDER FROM SESSION STORAGE =====
function loadOrderData() {
  const stored = sessionStorage.getItem('wwc_order');

  if (!stored) {
    showToast('No order found. Redirecting...', 'error');
    setTimeout(() => { window.location.href = 'index.html'; }, 2000);
    return;
  }

  orderData = JSON.parse(stored);

  // Populate order details
  setEl('displayOrderId', 'Order ID: ' + orderData.orderId);
  setEl('displayPlatform', capitalize(orderData.platform));
  setEl('displayService', orderData.service);
  setEl('displayQuantity', orderData.quantity);
  setEl('displayLink', orderData.link);
  setEl('displayAmount', '₹' + orderData.amount);

  // Generate Dynamic QR Code
  generateDynamicQR(orderData.amount, orderData.orderId);
}

// ===== GENERATE DYNAMIC QR =====
function generateDynamicQR(amount, orderId) {
  QRSystem.initPaymentQR({
    canvasId: 'dynamicQRCanvas',
    loadingId: 'qrLoadingState',
    upiId: WWC_CONFIG.upiId,
    amount: amount,
    name: WWC_CONFIG.upiName,
    note: 'Order ' + orderId,
    size: 220
  });
}

// ===== COPY UPI ID =====
function copyUPI() {
  const btn = document.getElementById('copyUPIBtn');
  copyToClipboard(WWC_CONFIG.upiId, btn, 'Copied!');
}

// ===== DOWNLOAD QR =====
function downloadQR() {
  QRSystem.downloadQR('dynamicQRCanvas', `wwc-payment-${orderData?.orderId || 'qr'}.png`);
}

// ===== OPEN IN UPI APP =====
function openUPIApp() {
  if (!orderData) return;
  QRSystem.openInUPIApp(
    WWC_CONFIG.upiId,
    orderData.amount,
    WWC_CONFIG.upiName,
    'Order ' + orderData.orderId
  );
}

// ===== COUNTDOWN TIMER =====
function startCountdownTimer() {
  const timerEl = document.getElementById('countdown');
  const timerBox = document.querySelector('.timer-box');

  timerInterval = setInterval(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const display = pad(mins) + ':' + pad(secs);

    if (timerEl) timerEl.textContent = display;

    if (timeLeft <= 60 && timerBox) {
      timerBox.classList.add('urgent');
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      sessionStorage.removeItem('wwc_order');
      alert('⏰ Payment window expired. Please place your order again.');
      window.location.href = 'index.html';
    }

    timeLeft--;
  }, 1000);
}

// ===== CONFIRM PAYMENT SUBMIT =====
async function confirmPayment(event) {
  event.preventDefault();

  if (!orderData) {
    showToast('Order data missing. Please start again.', 'error');
    return;
  }

  const btn = document.getElementById('submitBtn');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = 'Processing... <span class="spinner"></span>';
  btn.disabled = true;

  const customerEmail = document.getElementById('customerEmail').value.trim();
  const transactionId = document.getElementById('transactionId').value.trim();
  const screenshotFile = document.getElementById('paymentScreenshot').files[0];

  // Prepare data
  const paymentData = {
    ...orderData,
    customerEmail,
    transactionId,
    paymentDate: new Date().toLocaleString('en-IN'),
    hasScreenshot: screenshotFile ? 'Yes' : 'No'
  };

  try {
    // 1. Send EmailJS confirmation to customer
    if (typeof emailjs !== 'undefined') {
      const customerParams = {
        to_email: customerEmail,
        to_name: customerEmail.split('@')[0],
        order_id: orderData.orderId,
        platform: capitalize(orderData.platform),
        service: orderData.service,
        quantity: orderData.quantity,
        amount: orderData.amount,
        transaction_id: transactionId,
        reply_to: WWC_CONFIG.adminEmail
      };

      emailjs.send(
        WWC_CONFIG.emailjsServiceId,
        WWC_CONFIG.emailjsTemplateId,
        customerParams
      ).catch(err => console.warn('EmailJS error:', err));
    }

    // 2. Send admin notification via FormSubmit
    await fetch(`https://formsubmit.co/ajax/${WWC_CONFIG.adminEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        ...paymentData,
        _subject: `🎉 New Order - ${orderData.orderId}`,
        _template: 'table',
        _captcha: false
      })
    });

    // 3. Show success
    clearInterval(timerInterval);
    sessionStorage.removeItem('wwc_order');

    document.getElementById('paymentForm').style.display = 'none';
    const successEl = document.getElementById('successMessage');
    if (successEl) {
      successEl.classList.add('show');
      document.getElementById('successOrderId').textContent = orderData.orderId;
    }

  } catch (err) {
    console.error('Payment confirmation error:', err);
    showToast(`Error: Please contact support with Order ID: ${orderData.orderId}`, 'error');
    btn.innerHTML = originalHTML;
    btn.disabled = false;
  }
}

// ===== UTILITY FUNCTIONS =====
function setEl(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function pad(n) {
  return n.toString().padStart(2, '0');
}

function showToast(message, type = 'info') {
  const existing = document.getElementById('wwc-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'wwc-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#667eea'};
    color: white;
    padding: 14px 24px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    z-index: 9999;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    animation: slideUpToast 0.3s ease;
  `;
  toast.textContent = message;

  const style = document.createElement('style');
  style.textContent = `@keyframes slideUpToast {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }`;
  document.head.appendChild(style);

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}
