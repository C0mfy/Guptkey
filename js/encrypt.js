// ============================================
// Firebase
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "HIDDEN",
  authDomain: "HIDDEN",
  projectId: "HIDDEN",
  storageBucket: "HIDDEN",
  messagingSenderId: "HIDDEN",
  appId: "HIDDEN"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ============================================
// Helpers
// ============================================
function generateSecurityKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';
  for (let i = 0; i < 24; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

function generateMessageId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

// ============================================
// ENCODE PAGE
// ============================================
const encodeForm   = document.getElementById('encodeForm');
const encodeResult = document.getElementById('encodeResult');
const encodeBtn    = document.getElementById('encodeBtn');
const resetEncBtn  = document.getElementById('resetEncodeBtn');
const messageInput = document.getElementById('messageInput');
const charCount    = document.getElementById('charCount');

if (messageInput) {
  messageInput.addEventListener('input', () => {
    charCount.textContent = messageInput.value.length;
  });
}

if (encodeBtn) {
  encodeBtn.addEventListener('click', async () => {
    const msg = messageInput.value.trim();
    if (!msg) {
      messageInput.style.borderColor = '#E85A4F';
      return;
    }
    messageInput.style.borderColor = '';

    encodeBtn.textContent = 'Encrypting...';
    encodeBtn.disabled = true;

    try {
      const key       = generateSecurityKey();
      const msgId     = generateMessageId();
      const encrypted = CryptoJS.AES.encrypt(msg, key).toString();

      await setDoc(doc(db, 'messages', msgId), {
        encoded:   encrypted,
        used:      false,
        createdAt: new Date()
      });

      document.getElementById('encodedOutput').textContent = `${msgId}::${encrypted}`;
      document.getElementById('securityKey').textContent   = key;

      encodeForm.style.display   = 'none';
      encodeResult.style.display = 'block';

    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      encodeBtn.textContent = 'Encrypt Message';
      encodeBtn.disabled    = false;
    }
  });
}

if (resetEncBtn) {
  resetEncBtn.addEventListener('click', () => {
    messageInput.value    = '';
    charCount.textContent = '0';
    encodeResult.style.display = 'none';
    encodeForm.style.display   = 'block';
  });
}

// ============================================
// DECODE PAGE
// ============================================
const decodeForm   = document.getElementById('decodeForm');
const decodeResult = document.getElementById('decodeResult');
const decodeBtn    = document.getElementById('decodeBtn');
const resetDecBtn  = document.getElementById('resetDecodeBtn');
const encodedInput = document.getElementById('encodedInput');
const keyInput     = document.getElementById('keyInput');
const errorMsg     = document.getElementById('errorMsg');

if (decodeBtn) {
  decodeBtn.addEventListener('click', async () => {
    const fullInput = encodedInput.value.trim();
    const key       = keyInput.value.trim();

    if (!fullInput || !key) {
      errorMsg.textContent   = '❌ Please fill in both fields.';
      errorMsg.style.display = 'block';
      return;
    }

    const parts = fullInput.split('::');
    if (parts.length < 2) {
      errorMsg.textContent   = '❌ Invalid encoded message format.';
      errorMsg.style.display = 'block';
      return;
    }

    const msgId   = parts[0];
    const encoded = parts.slice(1).join('::');

    decodeBtn.textContent = 'Decrypting...';
    decodeBtn.disabled    = true;

    try {
      const docRef  = doc(db, 'messages', msgId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        errorMsg.textContent   = '🔒 Message not found or already expired.';
        errorMsg.style.display = 'block';
        return;
      }

      const data = docSnap.data();

      if (data.used === true) {
        errorMsg.textContent   = '🔒 This message has already been decoded and is now expired. It cannot be decoded again.';
        errorMsg.style.display = 'block';
        return;
      }

      const bytes     = CryptoJS.AES.decrypt(encoded, key);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      if (!decrypted) {
        errorMsg.textContent   = '❌ Invalid security key. Please check and try again.';
        errorMsg.style.display = 'block';
        return;
      }

      await updateDoc(docRef, { used: true, decodedAt: new Date() });

      errorMsg.style.display = 'none';
      document.getElementById('decodedOutput').textContent = decrypted;
      decodeForm.style.display   = 'none';
      decodeResult.style.display = 'block';

    } catch (err) {
      console.error(err);
      errorMsg.textContent   = '❌ Something went wrong. Please try again.';
      errorMsg.style.display = 'block';
    } finally {
      decodeBtn.textContent = 'Decrypt Message';
      decodeBtn.disabled    = false;
    }
  });
}

if (resetDecBtn) {
  resetDecBtn.addEventListener('click', () => {
    encodedInput.value     = '';
    keyInput.value         = '';
    errorMsg.style.display = 'none';
    decodeResult.style.display = 'none';
    decodeForm.style.display   = 'block';
  });
}

// ============================================
// Copy to clipboard
// ============================================
function copyText(elementId, btn) {
  const text = document.getElementById(elementId).textContent;
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.textContent;
    btn.textContent       = '✅ Copied!';
    btn.style.background  = '#27ae60';
    btn.style.color       = '#fff';
    btn.style.borderColor = '#27ae60';
    setTimeout(() => {
      btn.textContent       = original;
      btn.style.background  = '';
      btn.style.color       = '';
      btn.style.borderColor = '';
    }, 2000);
  });
}

// ============================================
// Copy buttons
// ============================================
const copyEncodedBtn = document.getElementById('copyEncoded');
const copyKeyBtn     = document.getElementById('copyKey');

if (copyEncodedBtn) {
  copyEncodedBtn.addEventListener('click', () => {
    copyText('encodedOutput', copyEncodedBtn);
  });
}

if (copyKeyBtn) {
  copyKeyBtn.addEventListener('click', () => {
    copyText('securityKey', copyKeyBtn);
  });
}
