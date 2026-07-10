const steps = [...document.querySelectorAll('[data-step]')];
const progressBars = document.querySelectorAll('[data-progress]');
const previousButton = document.querySelector('[data-previous]');
const nextButton = document.querySelector('[data-next]');
const announcer = document.querySelector('[data-announcer]');

const requestedStep = Number(new URLSearchParams(location.search).get('step'));
let currentStep = requestedStep >= 1 && requestedStep <= 4 ? requestedStep : 1;

// Default payload shape expected by the /predict endpoint.
const phoneSpecs = {
  brand_name: 'Samsung',
  ram: 8,
  os: 'Android',
  storage: 128,
  battery_capacity: 5000,
  has_fast_charging: 'Yes',
  has_5g: 'Yes',
  has_nfc: 'Yes',
  has_fingerprint: 'Yes',
  processor_brand: 'Snapdragon',
  num_cores: 8,
  primary_rear_camera: 50,
  num_rear_cameras: 3,
  primary_front_camera: 16,
  num_front_cameras: 1,
  display_size: 6.7,
  display_type: 'AMOLED',
  preference: 'performance'
};

function renderStep() {
  steps.forEach((step) => step.classList.toggle('active', Number(step.dataset.step) === currentStep));
  progressBars.forEach((bar) => { bar.style.width = `${currentStep * 25}%`; });
  previousButton.textContent = currentStep === 1 ? 'Back to Home' : 'Previous';
  nextButton.firstChild.textContent = currentStep === 4 ? 'Get My Price Prediction ' : 'Continue ';
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

// --- Chip groups (single-select buttons) -> covers brand, ram, storage,
// processor, cores, camera counts, fast charging / 5g / nfc / fingerprint, preference.
document.querySelectorAll('[data-chip-group]').forEach((group) => {
  const field = group.dataset.chipGroup;
  const numeric = group.dataset.numeric === 'true';
  const buttons = [...group.querySelectorAll('button[data-value]')];
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      setSingleSelection(buttons, button);
      phoneSpecs[field] = numeric ? Number(button.dataset.value) : button.dataset.value;
    });
  });
});

// --- Dropdown selects -> os, display_type.
document.querySelectorAll('select[data-field]').forEach((select) => {
  const field = select.dataset.field;
  phoneSpecs[field] = select.value;
  select.addEventListener('change', () => { phoneSpecs[field] = select.value; });
});

// --- Range sliders -> rear/front camera MP, display size, battery capacity.
function formatRangeDisplay(field, value) {
  switch (field) {
    case 'primary_rear_camera':
    case 'primary_front_camera':
      return `${value} MP`;
    case 'display_size':
      return `${value.toFixed(1)}"`;
    case 'battery_capacity':
      return `${value.toLocaleString('en-IN')} mAh`;
    default:
      return `${value}`;
  }
}

document.querySelectorAll('input[type="range"][data-field]').forEach((input) => {
  const field = input.dataset.field;
  const isFloat = input.dataset.float === 'true';
  const display = document.querySelector(`[data-field-display="${field}"]`);

  const applyValue = (raw) => {
    const value = isFloat ? Math.round(parseFloat(raw) * 10) / 10 : Number(raw);
    phoneSpecs[field] = value;
    if (display) display.textContent = formatRangeDisplay(field, value);
    return value;
  };

  applyValue(input.value);
  input.addEventListener('input', (event) => applyValue(event.target.value));
});

// --- Battery quick-select presets, mirrors the range input above.
const batteryInput = document.getElementById('battery');
const batteryPresetButtons = [...document.querySelectorAll('[data-battery-presets] button')];
function syncBatteryPresets(value) {
  batteryPresetButtons.forEach((button) => {
    button.classList.toggle('active-selection', Number(button.dataset.value) === value);
  });
}
batteryPresetButtons.forEach((button) => button.addEventListener('click', () => {
  const value = Number(button.dataset.value);
  batteryInput.value = value;
  phoneSpecs.battery_capacity = value;
  const display = document.querySelector('[data-field-display="battery_capacity"]');
  if (display) display.textContent = formatRangeDisplay('battery_capacity', value);
  syncBatteryPresets(value);
}));
batteryInput.addEventListener('input', (event) => syncBatteryPresets(Number(event.target.value)));
syncBatteryPresets(phoneSpecs.battery_capacity);

previousButton.addEventListener('click', () => {
  if (currentStep === 1) location.href = 'index.html';
  else { currentStep -= 1; renderStep(); }
});

nextButton.addEventListener('click', () => {
  if (currentStep < 4) { currentStep += 1; renderStep(); return; }
  sessionStorage.setItem('phoneSpecs', JSON.stringify(phoneSpecs));
  location.href = 'loading.html';
});

renderStep();
