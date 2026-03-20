/* =====================================================
   WORLDWIDE COLLAB - SMM Services Logic
   services.js - Platform selection & order flow
   ===================================================== */

'use strict';

// ===== SERVICES DATA =====
const SMM_SERVICES = {
  instagram: {
    'Instagram Followers': { price: 0.50, min: 100, step: 100, icon: '👥' },
    'Instagram Likes': { price: 0.10, min: 50, step: 50, icon: '❤️' },
    'Instagram Views': { price: 0.05, min: 500, step: 500, icon: '👁️' },
    'Instagram Comments': { price: 2.00, min: 10, step: 10, icon: '💬' },
    'Instagram Story Views': { price: 0.08, min: 200, step: 200, icon: '📖' },
    'Instagram Reel Views': { price: 0.06, min: 500, step: 500, icon: '🎬' },
    'Instagram Saves': { price: 0.15, min: 50, step: 50, icon: '🔖' }
  },
  youtube: {
    'YouTube Subscribers': { price: 1.50, min: 50, step: 50, icon: '👥' },
    'YouTube Views': { price: 0.20, min: 500, step: 500, icon: '👁️' },
    'YouTube Likes': { price: 0.30, min: 50, step: 50, icon: '👍' },
    'YouTube Comments': { price: 3.00, min: 5, step: 5, icon: '💬' },
    'YouTube Watch Hours': { price: 5.00, min: 10, step: 10, icon: '⏱️' }
  },
  facebook: {
    'Facebook Page Likes': { price: 0.60, min: 100, step: 100, icon: '👍' },
    'Facebook Post Likes': { price: 0.15, min: 50, step: 50, icon: '❤️' },
    'Facebook Followers': { price: 0.70, min: 100, step: 100, icon: '👥' },
    'Facebook Video Views': { price: 0.10, min: 500, step: 500, icon: '👁️' },
    'Facebook Comments': { price: 2.50, min: 10, step: 10, icon: '💬' }
  },
  twitter: {
    'Twitter Followers': { price: 0.80, min: 100, step: 100, icon: '👥' },
    'Twitter Likes': { price: 0.12, min: 50, step: 50, icon: '❤️' },
    'Twitter Retweets': { price: 0.25, min: 20, step: 20, icon: '🔁' },
    'Twitter Views': { price: 0.08, min: 500, step: 500, icon: '👁️' },
    'Twitter Replies': { price: 2.00, min: 10, step: 10, icon: '💬' }
  },
  tiktok: {
    'TikTok Followers': { price: 0.60, min: 100, step: 100, icon: '👥' },
    'TikTok Likes': { price: 0.10, min: 100, step: 100, icon: '❤️' },
    'TikTok Views': { price: 0.05, min: 1000, step: 1000, icon: '👁️' },
    'TikTok Comments': { price: 2.00, min: 10, step: 10, icon: '💬' },
    'TikTok Shares': { price: 0.20, min: 50, step: 50, icon: '🔗' }
  },
  linkedin: {
    'LinkedIn Followers': { price: 1.20, min: 50, step: 50, icon: '👥' },
    'LinkedIn Connections': { price: 2.00, min: 20, step: 20, icon: '🤝' },
    'LinkedIn Post Likes': { price: 0.40, min: 50, step: 50, icon: '👍' },
    'LinkedIn Comments': { price: 3.00, min: 5, step: 5, icon: '💬' }
  },
  spotify: {
    'Spotify Followers': { price: 1.00, min: 50, step: 50, icon: '👥' },
    'Spotify Plays': { price: 0.15, min: 500, step: 500, icon: '▶️' },
    'Spotify Monthly Listeners': { price: 1.50, min: 100, step: 100, icon: '🎵' },
    'Spotify Playlist Followers': { price: 0.80, min: 50, step: 50, icon: '📋' }
  },
  telegram: {
    'Telegram Members': { price: 0.50, min: 100, step: 100, icon: '👥' },
    'Telegram Post Views': { price: 0.08, min: 500, step: 500, icon: '👁️' },
    'Telegram Reactions': { price: 0.15, min: 100, step: 100, icon: '❤️' }
  }
};

let currentPlatform = null;

// ===== SELECT PLATFORM =====
function selectPlatform(platform) {
  currentPlatform = platform;

  // Update active card
  document.querySelectorAll('.platform-card').forEach(card => {
    card.classList.remove('active');
  });

  const activeCard = document.querySelector(`.platform-card[onclick*="${platform}"]`);
  if (activeCard) activeCard.classList.add('active');

  // Populate service dropdown
  const serviceSelect = document.getElementById('service');
  const services = SMM_SERVICES[platform];

  if (!serviceSelect || !services) return;

  serviceSelect.innerHTML = '<option value="">-- Select Service --</option>';

  Object.entries(services).forEach(([name, data]) => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = `${data.icon} ${name} (₹${data.price}/unit)`;
    serviceSelect.appendChild(option);
  });

  // Show service form
  const form = document.getElementById('serviceForm');
  if (form) {
    form.classList.add('show');
    form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Reset fields
  document.getElementById('quantity').value = '';
  document.getElementById('profileLink').value = '';
  document.getElementById('totalPrice').textContent = '0.00';
}

// ===== UPDATE SERVICE SELECTION =====
function updateService() {
  const service = document.getElementById('service').value;
  if (!service || !currentPlatform) return;

  const data = SMM_SERVICES[currentPlatform][service];
  if (!data) return;

  const quantityInput = document.getElementById('quantity');
  quantityInput.min = data.min;
  quantityInput.step = data.step;
  quantityInput.placeholder = `Minimum ${data.min}`;
  quantityInput.value = '';

  document.getElementById('totalPrice').textContent = '0.00';
}

// ===== CALCULATE PRICE =====
function calculatePrice() {
  const service = document.getElementById('service').value;
  const quantity = parseInt(document.getElementById('quantity').value) || 0;

  if (!currentPlatform || !service || !SMM_SERVICES[currentPlatform]?.[service]) {
    document.getElementById('totalPrice').textContent = '0.00';
    return;
  }

  const price = SMM_SERVICES[currentPlatform][service].price;
  const total = (price * quantity).toFixed(2);
  document.getElementById('totalPrice').textContent = total;
}

// ===== PROCEED TO PAYMENT =====
function proceedToPayment() {
  const service = document.getElementById('service').value;
  const link = document.getElementById('profileLink').value.trim();
  const quantity = parseInt(document.getElementById('quantity').value);
  const amount = document.getElementById('totalPrice').textContent;

  // Validate
  if (!currentPlatform) {
    showServiceAlert('Please select a platform first.', 'error');
    return;
  }
  if (!service) {
    showServiceAlert('Please select a service.', 'error');
    return;
  }
  if (!link) {
    showServiceAlert('Please enter your profile link / username.', 'error');
    return;
  }
  if (!quantity || quantity < 1) {
    showServiceAlert('Please enter a valid quantity.', 'error');
    return;
  }

  const serviceData = SMM_SERVICES[currentPlatform][service];
  if (quantity < serviceData.min) {
    showServiceAlert(`Minimum quantity for this service is ${serviceData.min}.`, 'error');
    return;
  }

  if (parseFloat(amount) <= 0) {
    showServiceAlert('Amount cannot be zero.', 'error');
    return;
  }

  // Generate order ID
  const orderId = 'WWC-' + Math.floor(100000 + Math.random() * 900000);

  const orderData = {
    orderId,
    platform: currentPlatform,
    service,
    link,
    quantity: quantity.toString(),
    amount,
    timestamp: new Date().toISOString()
  };

  sessionStorage.setItem('wwc_order', JSON.stringify(orderData));

  // Show success state
  const successEl = document.getElementById('orderSuccess');
  if (successEl) successEl.style.display = 'block';

  setTimeout(() => {
    window.location.href = 'payment.html';
  }, 1500);
}

// ===== ALERT =====
function showServiceAlert(message, type = 'info') {
  const existing = document.getElementById('serviceAlert');
  if (existing) existing.remove();

  const alert = document.createElement('div');
  alert.id = 'serviceAlert';
  alert.style.cssText = `
    padding: 12px 18px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    margin: 12px 0;
    background: ${type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)'};
    color: ${type === 'error' ? '#ef4444' : '#6366f1'};
    border: 1px solid ${type === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.2)'};
  `;
  alert.textContent = message;

  const submitBtn = document.querySelector('.btn-primary');
  if (submitBtn) submitBtn.parentNode.insertBefore(alert, submitBtn);

  setTimeout(() => alert.remove(), 4000);
}

// ===== SUPPORT FORM SUBMIT =====
async function submitSupport(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  try {
    await fetch(`https://formsubmit.co/ajax/${WWC_CONFIG.adminEmail}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        ...data,
        _subject: `Support Request - Order ID: ${data.orderId}`,
        _template: 'table'
      })
    });
    alert('✅ Support request submitted! We will contact you soon.');
    event.target.reset();
    closeModal('supportModal');
  } catch {
    alert('Error submitting request. Please email us directly.');
  }
}

// ===== CONTACT FORM SUBMIT =====
async function submitContact(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  try {
    await fetch(`https://formsubmit.co/ajax/${WWC_CONFIG.adminEmail}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        ...data,
        _subject: `Contact Form: ${data.subject}`,
        _template: 'table'
      })
    });

    const form = document.getElementById('contactForm');
    const success = document.getElementById('contactSuccess');
    if (form) form.style.display = 'none';
    if (success) success.style.display = 'block';
    setTimeout(() => location.reload(), 3000);
  } catch {
    alert('Error sending message. Please try again.');
  }
}

// ===== CREATOR MODAL =====
function showCreatorDetails(name, location, niche, followers, engagement, image) {
  const modal = document.getElementById('creatorModal');
  const details = document.getElementById('creatorDetails');

  if (!details || !modal) return;

  details.innerHTML = `
    <div style="text-align:center;margin-bottom:20px;">
      <img src="${image}" alt="${name}" style="width:120px;height:120px;border-radius:50%;border:4px solid #6366f1;object-fit:cover;margin:0 auto 15px;display:block;box-shadow:0 10px 30px rgba(99,102,241,0.3);">
      <h2 style="color:#6366f1;font-size:24px;margin-bottom:5px;">${name}</h2>
      <p style="color:#64748b;font-size:15px;">📍 ${location} &bull; 🎨 ${niche}</p>
    </div>
    <div style="display:flex;gap:15px;margin:20px 0;">
      <div style="flex:1;text-align:center;background:#f1f5f9;padding:20px;border-radius:14px;">
        <div style="font-size:28px;font-weight:800;color:#6366f1;">${followers}</div>
        <div style="color:#64748b;font-size:13px;font-weight:600;margin-top:5px;">Followers</div>
      </div>
      <div style="flex:1;text-align:center;background:#f1f5f9;padding:20px;border-radius:14px;">
        <div style="font-size:28px;font-weight:800;color:#10b981;">${engagement}</div>
        <div style="color:#64748b;font-size:13px;font-weight:600;margin-top:5px;">Engagement</div>
      </div>
    </div>
    <div style="background:#f8faff;padding:20px;border-radius:14px;margin-bottom:15px;">
      <p style="color:#475569;line-height:1.7;font-size:14px;">This creator is <strong>verified by Worldwide Collab</strong> and has a proven track record of successful brand collaborations worldwide.</p>
    </div>
    <button onclick="alert('🚀 Collaboration request feature coming soon!')" style="width:100%;padding:16px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;border:none;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;">
      🤝 Send Collaboration Request
    </button>
  `;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeCreatorModal() {
  const modal = document.getElementById('creatorModal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}
