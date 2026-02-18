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