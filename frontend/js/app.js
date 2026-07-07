const navbar = document.querySelector('#navbar');
if (navbar) {
  const updateNavbar = () => {
    navbar.classList.toggle('bg-background/90', window.scrollY > 50);
    navbar.classList.toggle('shadow-md', window.scrollY > 50);
  };
  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });
}
