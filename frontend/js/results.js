const status = document.querySelector('[data-results-status]');
const compareButtons = [...document.querySelectorAll('[data-compare]')];

compareButtons.forEach((button) => button.addEventListener('click', () => {
  const selected = button.classList.toggle('compare-selected');
  button.textContent = selected ? 'Added' : 'Compare';
  button.setAttribute('aria-pressed', String(selected));
  status.textContent = `${button.dataset.compare} ${selected ? 'added to' : 'removed from'} comparison.`;
}));

document.querySelector('[data-details]')?.addEventListener('click', () => {
  const card = document.querySelector('#recommendation');
  card.classList.remove('glow-hover');
  card.animate([
    { boxShadow: '0 0 0 rgba(160,120,255,0)' },
    { boxShadow: '0 0 45px rgba(160,120,255,.28)' },
    { boxShadow: '0 0 0 rgba(160,120,255,0)' }
  ], { duration: 800, easing: 'ease-out' });
  status.textContent = 'Nothing Phone (3) recommendation details are shown in this card.';
});
