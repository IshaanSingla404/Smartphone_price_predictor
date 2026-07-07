const steps = [...document.querySelectorAll('[data-step]')];
const progressBars = document.querySelectorAll('[data-progress]');
const previousButton = document.querySelector('[data-previous]');
const nextButton = document.querySelector('[data-next]');
const announcer = document.querySelector('[data-announcer]');
const budgetInput = document.querySelector('[data-budget]');
const budgetDisplay = document.querySelector('[data-budget-display]');

const requestedStep = Number(new URLSearchParams(location.search).get('step'));
let currentStep = requestedStep >= 1 && requestedStep <= 4 ? requestedStep : 1;

const preferences = {
  priorities: ['photography'],
  budget: Number(budgetInput.value),
  brand: 'No Preference',
  longevity: ''
};

function renderStep() {
  steps.forEach((step) => step.classList.toggle('active', Number(step.dataset.step) === currentStep));
  progressBars.forEach((bar) => { bar.style.width = `${currentStep * 25}%`; });
  previousButton.textContent = currentStep === 1 ? 'Back to Home' : 'Previous';
  nextButton.firstChild.textContent = currentStep === 4 ? 'Find My Perfect Phone ' : 'Continue ';
  announcer.textContent = `Step ${currentStep} of 4`;
  history.replaceState(null, '', `wizard.html?step=${currentStep}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setSingleSelection(buttons, selected) {
  buttons.forEach((button) => {
    const active = button === selected;
    button.classList.toggle('active-selection', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

document.querySelectorAll('[data-priority]').forEach((button) => {
  button.addEventListener('click', () => {
    button.classList.toggle('active-selection');
    const active = button.classList.contains('active-selection');
    button.setAttribute('aria-pressed', String(active));
    preferences.priorities = [...document.querySelectorAll('[data-priority].active-selection')].map((item) => item.dataset.priority);
  });
});

function updateBudget(value) {
  const amount = Number(value);
  preferences.budget = amount;
  budgetInput.value = amount;
  budgetDisplay.textContent = `₹${amount.toLocaleString('en-IN')}`;
  document.querySelectorAll('[data-budget-presets] button').forEach((button) => {
    button.classList.toggle('active-selection', Number(button.dataset.value) === amount);
  });
}

budgetInput.addEventListener('input', (event) => updateBudget(event.target.value));
document.querySelectorAll('[data-budget-presets] button').forEach((button) => button.addEventListener('click', () => updateBudget(button.dataset.value)));

const brandButtons = [...document.querySelectorAll('[data-brand]')];
brandButtons.forEach((button) => button.addEventListener('click', () => {
  setSingleSelection(brandButtons, button);
  preferences.brand = button.dataset.brand;
}));

const longevityButtons = [...document.querySelectorAll('[data-longevity]')];
longevityButtons.forEach((button) => button.addEventListener('click', () => {
  setSingleSelection(longevityButtons, button);
  preferences.longevity = button.dataset.longevity;
}));

previousButton.addEventListener('click', () => {
  if (currentStep === 1) location.href = 'index.html';
  else { currentStep -= 1; renderStep(); }
});

nextButton.addEventListener('click', () => {
  if (currentStep < 4) { currentStep += 1; renderStep(); return; }
  sessionStorage.setItem('forgePreferences', JSON.stringify(preferences));
  location.href = 'loading.html';
});

updateBudget(preferences.budget);
renderStep();
