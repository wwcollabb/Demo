/* =====================================================
   WORLDWIDE COLLAB - Main App JavaScript
   app.js - Shared across all pages
   ===================================================== */

'use strict';

// ===== GLOBAL CONFIG =====
const WWC_CONFIG = {
  adminEmail: 'team.wwcollab@gmail.com',
  emailjsUserId: '5Gvu19EQdBGPu9fXt',
  emailjsServiceId: 'service_xctfgme',
  emailjsTemplateId: 'template_9lzbn59',
  upiId: 'nextune@upi',
  upiName: 'Worldwide Collab',
  siteName: 'Worldwide Collab'
};

// ===== HEADER AUTO HIDE =====
let lastScrollY = 0;

function initHeaderAutoHide() {
  const header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }

    if (currentScrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });
}

// ===== SIDEBAR =====
function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.add('active');
  if (overlay) overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// ===== COLLAPSIBLE =====
function initCollapsibles() {
  document.querySelectorAll('.collapsible').forEach(btn => {
    btn.addEventListener('click', function () {
      const content = this.nextElementSibling;
      this.classList.toggle('active');
      if (content) content.classList.toggle('show');
    });
  });
}

// ===== FAQ =====
function toggleFaq(element) {
  element.classList.toggle('active');
  const answer = element.nextElementSibling;
  if (answer) answer.classList.toggle('show');
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerOffset = 90;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
      closeSidebar();
    });
  });
}

// ===== MODAL UTILITIES =====
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

function initModalOutsideClick() {
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
}

// ===== CLIPBOARD COPY =====
async function copyToClipboard(text, btnEl, successText = 'Copied!') {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  if (btnEl) {
    const originalText = btnEl.innerHTML;
    btnEl.innerHTML = `✅ ${successText}`;
    btnEl.classList.add('copied');
    setTimeout(() => {
      btnEl.innerHTML = originalText;
      btnEl.classList.remove('copied');
    }, 2000);
  }
}

// ===== TESTIMONIAL SLIDER =====
let currentTestimonialSlide = 0;

function initTestimonialSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  if (!slides.length) return;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => { d.style.background = '#cbd5e1'; d.classList.remove('active'); });
    slides[index].classList.add('active');
    if (dots[index]) {
      dots[index].style.background = '#6366f1';
      dots[index].classList.add('active');
    }
    currentTestimonialSlide = index;
  }

  setInterval(() => {
    currentTestimonialSlide = (currentTestimonialSlide + 1) % slides.length;
    showSlide(currentTestimonialSlide);
  }, 5000);

  dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
}

// ===== CREATORS CAROUSEL DRAG =====
function initCreatorsCarousel() {
  const container = document.getElementById('creatorsContainer');
  if (!container) return;

  let isDown = false, startX, scrollLeft;

  container.addEventListener('mousedown', e => {
    isDown = true;
    container.style.cursor = 'grabbing';
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener('mouseleave', () => { isDown = false; container.style.cursor = 'grab'; });
  container.addEventListener('mouseup', () => { isDown = false; container.style.cursor = 'grab'; });

  container.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    container.scrollLeft = scrollLeft - (x - startX) * 2;
  });
}

function scrollCreators(direction) {
  const container = document.getElementById('creatorsContainer');
  if (!container) return;
  container.scrollBy({ left: direction * 325, behavior: 'smooth' });
}

// ===== CONTACT / SUPPORT FORM SUBMIT =====
async function submitFormToAdmin(data, subject) {
  const payload = {
    ...data,
    _subject: subject,
    _template: 'table',
    _captcha: false
  };

  const res = await fetch(`https://formsubmit.co/ajax/${WWC_CONFIG.adminEmail}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  });

  return res.json();
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initHeaderAutoHide();
  initCollapsibles();
  initSmoothScroll();
  initModalOutsideClick();
  initTestimonialSlider();
  initCreatorsCarousel();
});
