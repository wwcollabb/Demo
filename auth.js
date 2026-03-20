/* =====================================================
   WORLDWIDE COLLAB - Auth Page Logic
   auth.js - Login & Register
   ===================================================== */

'use strict';

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDcvUZkjQYvUFMmS2FC8k0E9XKNXuzPA4k",
  authDomain: "ww-c-5c5c1.firebaseapp.com",
  projectId: "ww-c-5c5c1",
  storageBucket: "ww-c-5c5c1.firebasestorage.app",
  messagingSenderId: "200600278915",
  appId: "1:200600278915:web:654a42ec7f71e9386e08b6"
};

let auth, googleProvider;
let isLoginMode = true;

// ===== INIT FIREBASE =====
document.addEventListener('DOMContentLoaded', () => {
  if (typeof firebase === 'undefined') return;

  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  googleProvider = new firebase.auth.GoogleAuthProvider();

  // Auto redirect if already logged in
  auth.onAuthStateChanged(user => {
    if (user) window.location.href = 'index.html';
  });

  // Init password strength (register)
  initPasswordStrength();

  // Init toggle password visibility
  initPasswordToggles();
});

// ===== TOGGLE LOGIN / REGISTER =====
function toggleAuthMode() {
  isLoginMode = !isLoginMode;

  const title = document.getElementById('formTitle');
  const submitBtn = document.getElementById('submitBtn');
  const toggleText = document.getElementById('toggleText');
  const toggleLink = document.getElementById('toggleLink');
  const nameGroup = document.getElementById('nameGroup');
  const forgotDiv = document.getElementById('forgotPasswordDiv');
  const strengthDiv = document.getElementById('passwordStrength');

  if (isLoginMode) {
    if (title) title.textContent = 'Welcome Back';
    if (submitBtn) submitBtn.textContent = 'Login';
    if (toggleText) toggleText.textContent = "Don't have an account?";
    if (toggleLink) toggleLink.textContent = 'Sign Up';
    if (nameGroup) nameGroup.style.display = 'none';
    if (forgotDiv) forgotDiv.style.display = 'block';
    if (strengthDiv) strengthDiv.style.display = 'none';
  } else {
    if (title) title.textContent = 'Create Account';
    if (submitBtn) submitBtn.textContent = 'Sign Up';
    if (toggleText) toggleText.textContent = 'Already have an account?';
    if (toggleLink) toggleLink.textContent = 'Login';
    if (nameGroup) nameGroup.style.display = 'block';
    if (forgotDiv) forgotDiv.style.display = 'none';
    if (strengthDiv) strengthDiv.style.display = 'block';
  }

  // Clear messages
  hideMessages();
}

// ===== FORM SUBMIT =====
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('authForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const displayNameEl = document.getElementById('displayName');
    const displayName = displayNameEl ? displayNameEl.value.trim() : '';

    hideMessages();
    setLoading(true);

    try {
      if (isLoginMode) {
        await auth.signInWithEmailAndPassword(email, password);
        showSuccess('Login successful! Redirecting...');
        setTimeout(() => { window.location.href = 'index.html'; }, 1000);
      } else {
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        if (displayName) {
          await cred.user.updateProfile({ displayName });
        }
        showSuccess('Account created! Redirecting...');
        setTimeout(() => { window.location.href = 'index.html'; }, 1000);
      }
    } catch (err) {
      showError(getAuthErrorMessage(err.code));
      setLoading(false);
    }
  });
});

// ===== GOOGLE SIGN IN =====
function signInWithGoogle() {
  if (!auth) return;

  hideMessages();
  setLoading(true);

  auth.signInWithPopup(googleProvider)
    .then(() => { window.location.href = 'index.html'; })
    .catch(err => {
      showError(getAuthErrorMessage(err.code));
      setLoading(false);
    });
}

// ===== FORGOT PASSWORD =====
function resetPassword() {
  const email = document.getElementById('email').value.trim();

  if (!email) {
    showError('Please enter your email address first.');
    return;
  }

  auth.sendPasswordResetEmail(email)
    .then(() => { showSuccess('Password reset email sent! Check your inbox.'); })
    .catch(err => { showError(getAuthErrorMessage(err.code)); });
}

// ===== PASSWORD STRENGTH =====
function initPasswordStrength() {
  const passwordInput = document.getElementById('password');
  const strengthEl = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');
  const strengthDiv = document.getElementById('passwordStrength');

  if (!passwordInput) return;

  passwordInput.addEventListener('input', () => {
    if (!isLoginMode || !strengthDiv) return;

    const password = passwordInput.value;
    const strength = getPasswordStrength(password);

    if (strengthEl) {
      strengthEl.style.width = strength.score + '%';
      strengthEl.style.background = strength.color;
    }

    if (strengthText) {
      strengthText.textContent = strength.label;
      strengthText.style.color = strength.color;
    }
  });
}

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 15;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 20;
  if (/[^A-Za-z0-9]/.test(password)) score += 20;

  if (score < 30) return { score: 20, color: '#e74c3c', label: 'Weak' };
  if (score < 50) return { score: 40, color: '#f39c12', label: 'Fair' };
  if (score < 70) return { score: 60, color: '#f1c40f', label: 'Good' };
  if (score < 90) return { score: 80, color: '#27ae60', label: 'Strong' };
  return { score: 100, color: '#16a085', label: 'Very Strong' };
}

// ===== PASSWORD TOGGLE VISIBILITY =====
function initPasswordToggles() {
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
      } else {
        input.type = 'password';
        btn.textContent = '👁️';
      }
    });
  });
}

// ===== UI HELPERS =====
function setLoading(isLoading) {
  const btn = document.getElementById('submitBtn');
  const loadingDiv = document.getElementById('loadingDiv');

  if (btn) btn.disabled = isLoading;
  if (loadingDiv) loadingDiv.style.display = isLoading ? 'block' : 'none';
}

function showError(message) {
  const el = document.getElementById('errorDiv');
  if (el) {
    el.textContent = '❌ ' + message;
    el.style.display = 'block';
  }
}

function showSuccess(message) {
  const el = document.getElementById('successDiv');
  if (el) {
    el.textContent = '✅ ' + message;
    el.style.display = 'block';
  }
}

function hideMessages() {
  const errEl = document.getElementById('errorDiv');
  const sucEl = document.getElementById('successDiv');
  if (errEl) errEl.style.display = 'none';
  if (sucEl) sucEl.style.display = 'none';
}

// ===== ERROR MESSAGES =====
function getAuthErrorMessage(code) {
  const messages = {
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Try again.',
    'auth/email-already-in-use': 'An account already exists with this email.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/popup-closed-by-user': 'Sign in popup was closed.',
    'auth/cancelled-popup-request': 'Sign in was cancelled.',
    'auth/network-request-failed': 'Network error. Check your connection.'
  };
  return messages[code] || 'An error occurred. Please try again.';
}
