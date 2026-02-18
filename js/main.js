// Hamburger menu
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// Active nav link highlight
const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
  if (link.getAttribute('href')?.includes(currentPage)) {
    link.classList.add('active');
  }
});
// ============================================
// DARK MODE
// ============================================
const darkToggle = document.getElementById('darkToggle');

// Load saved preference
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
  if (darkToggle) darkToggle.textContent = '☀️';
}

if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    darkToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('darkMode', isDark);
  });
}