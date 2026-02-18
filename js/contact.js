const contactSubmit = document.getElementById('contactSubmit');
const successMsg    = document.getElementById('successMsg');

if (contactSubmit) {
  contactSubmit.addEventListener('click', () => {
    const name    = document.getElementById('contactName').value.trim();
    const email   = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    contactSubmit.textContent = 'Sending...';
    contactSubmit.disabled = true;

    setTimeout(() => {
      successMsg.style.display = 'block';
      contactSubmit.textContent = 'Send Message 🚀';
      contactSubmit.disabled = false;
      document.getElementById('contactName').value = '';
      document.getElementById('contactEmail').value = '';
      document.getElementById('contactMessage').value = '';
      setTimeout(() => { successMsg.style.display = 'none'; }, 4000);
    }, 1000);
  });
}
