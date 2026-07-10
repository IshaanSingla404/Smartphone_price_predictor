const status = document.querySelector('[data-results-status]');

const storedResult = sessionStorage.getItem('predictionResult');
const storedSpecs = sessionStorage.getItem('phoneSpecs');

if (!storedResult) {
  // Nothing to show — the person likely landed here directly.
  location.href = 'wizard.html';
}

const predictionResult = JSON.parse(storedResult);
const phoneSpecs = storedSpecs ? JSON.parse(storedSpecs) : {};
const recommendations = Array.isArray(predictionResult.recommendations) ? predictionResult.recommendations : [];

function pick(source, keys) {
  for (const key of keys) {
    if (source && source[key] !== undefined && source[key] !== null && source[key] !== '') return source[key];
  }
  return undefined;
}

function formatCurrency(value) {
  const numeric = typeof value === 'number' ? value : Number(value);
  if (Number.isFinite(numeric)) return `₹${Math.round(numeric).toLocaleString('en-IN')}`;
  return 'Price unavailable';
}

function isNumeric(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function titleCase(value) {
  if (!value) return '—';
  return String(value).replace(/\b\w/g, (c) => c.toUpperCase());
}

// --- Hero card: predicted price, preference, spec highlights ---
const predictedPrice = pick(predictionResult, ['predicted_price', 'price']);

document.querySelector('[data-predicted-price]').textContent = formatCurrency(predictedPrice);
document.querySelector('[data-preference-label]').textContent = titleCase(phoneSpecs.preference);

const brandOsPill = document.querySelector('[data-brand-os-pill]');
brandOsPill.textContent = [phoneSpecs.brand_name, phoneSpecs.os].filter(Boolean).join(' • ') || 'Custom Build';

const firstRecPrice = recommendations.length ? pick(recommendations[0], ['price', 'predicted_price', 'market_price', 'actual_price']) : undefined;
const closestMatchEl = document.querySelector('[data-closest-match-price]');
closestMatchEl.textContent = isNumeric(Number(firstRecPrice)) && firstRecPrice !== undefined ? formatCurrency(firstRecPrice) : 'No close match found';

const deltaEl = document.querySelector('[data-price-delta]');
const predictedNumeric = Number(predictedPrice);
const closestNumeric = Number(firstRecPrice);
if (Number.isFinite(predictedNumeric) && Number.isFinite(closestNumeric) && firstRecPrice !== undefined) {
  const diff = Math.round(predictedNumeric - closestNumeric);
  if (diff > 0) deltaEl.textContent = `Your predicted price is ${formatCurrency(diff)} above the closest real match.`;
  else if (diff < 0) deltaEl.textContent = `Your predicted price is ${formatCurrency(Math.abs(diff))} below the closest real match.`;
  else deltaEl.textContent = 'Your predicted price matches the closest real phone almost exactly.';
} else {
  deltaEl.textContent = "Forge's model compared hundreds of phones to generate this prediction.";
}

const chipsEl = document.querySelector('[data-spec-chips]');
const heroChips = [];
if (isNumeric(phoneSpecs.ram) && isNumeric(phoneSpecs.storage)) heroChips.push(`🧠 ${phoneSpecs.ram}GB RAM / ${phoneSpecs.storage}GB`);
if (isNumeric(phoneSpecs.primary_rear_camera)) heroChips.push(`📷 ${phoneSpecs.primary_rear_camera}MP Rear Camera`);
if (isNumeric(phoneSpecs.battery_capacity)) heroChips.push(`🔋 ${phoneSpecs.battery_capacity.toLocaleString('en-IN')}mAh`);
if (phoneSpecs.has_5g === 'Yes') heroChips.push('📶 5G');
if (phoneSpecs.has_fast_charging === 'Yes') heroChips.push('⚡ Fast Charging');
if (phoneSpecs.has_nfc === 'Yes') heroChips.push('💳 NFC');
if (phoneSpecs.has_fingerprint === 'Yes') heroChips.push('🔒 Fingerprint');
chipsEl.innerHTML = heroChips
  .map((label) => `<span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-label-sm">${label}</span>`)
  .join('');

// --- Full spec breakdown, toggled by "View Full Specs" ---
const specLabels = [
  ['brand_name', 'Brand'], ['os', 'Operating System'], ['ram', 'RAM (GB)'], ['storage', 'Storage (GB)'],
  ['processor_brand', 'Processor'], ['num_cores', 'Cores'], ['primary_rear_camera', 'Rear Camera (MP)'],
  ['num_rear_cameras', 'Rear Cameras'], ['primary_front_camera', 'Front Camera (MP)'], ['num_front_cameras', 'Front Cameras'],
  ['display_size', 'Display Size (in)'], ['display_type', 'Display Type'], ['battery_capacity', 'Battery (mAh)'],
  ['has_fast_charging', 'Fast Charging'], ['has_5g', '5G'], ['has_nfc', 'NFC'], ['has_fingerprint', 'Fingerprint'],
  ['preference', 'Preference']
];
const detailsEl = document.querySelector('[data-spec-details]');
detailsEl.innerHTML = specLabels
  .filter(([key]) => phoneSpecs[key] !== undefined)
  .map(([key, label]) => `<dt class="text-on-surface-variant">${label}</dt><dd class="text-right font-bold sm:text-left">${key === 'preference' ? titleCase(phoneSpecs[key]) : phoneSpecs[key]}</dd>`)
  .join('');

document.querySelector('[data-details]')?.addEventListener('click', (event) => {
  const expanded = detailsEl.classList.toggle('hidden') === false;
  detailsEl.classList.toggle('grid', expanded);
  event.currentTarget.textContent = expanded ? 'Hide Full Specs' : 'View Full Specs';
  status.textContent = expanded ? 'Full specification list expanded.' : 'Full specification list collapsed.';
});

// --- Top 5 recommendations grid ---
const gridEl = document.querySelector('[data-recommendations-grid]');
const emptyEl = document.querySelector('[data-recommendations-empty]');
const topFive = recommendations.slice(0, 5);

function recName(rec) {
  const full = pick(rec, [
    'phone_name',
    'name',
    'model_name',
    'device_name'
  ]);
  if (full) return full;
  const brand = pick(rec, ['brand_name', 'brand']);
  const model = pick(rec, ['model']);
  return [brand, model].filter(Boolean).join(' ') || 'Recommended Phone';
}

function recChips(rec) {
  const chips = [];
  const ram = pick(rec, ['ram']);
  const storage = pick(rec, ['storage']);
  if (ram && storage) chips.push(`${ram}GB / ${storage}GB`);
  const battery = pick(rec, ['battery_capacity']);
  if (battery) chips.push(`${battery}mAh`);
  const processor = pick(rec, ['processor_brand']);
  if (processor) chips.push(processor);
  return chips.slice(0, 2);
}

if (!topFive.length) {
  emptyEl.textContent = 'No recommendations were returned for this configuration.';
} else {
  emptyEl.remove();
  gridEl.innerHTML = topFive
    .map((rec, index) => {
      const price = pick(rec, ['price', 'predicted_price', 'market_price', 'actual_price']);
      const chips = recChips(rec).join(' • ');
      const specEntries = Object.entries(rec).filter(([, value]) => typeof value !== 'object');
      const specHtml = specEntries
        .map(([key, value]) => `<dt class="text-on-surface-variant">${titleCase(key.replace(/_/g, ' '))}</dt><dd class="text-right font-bold">${value}</dd>`)
        .join('');
      return `
        <article class="glass-panel glow-hover space-y-4 rounded-xl p-6 text-left">
          <div class="flex items-start justify-between"><div class="text-headline-sm font-bold text-primary">#${index + 1}</div><span class="text-label-sm text-secondary">Similar Match</span></div>
          <img src="assets/images/phone-alternative.png" alt="${recName(rec)}" class="mx-auto h-32 object-contain">
          <div><h3 class="font-bold">${recName(rec)}</h3><p class="text-label-md text-on-surface-variant">${formatCurrency(price)}</p>${chips ? `<p class="mt-1 text-label-sm text-on-surface-variant opacity-80">${chips}</p>` : ''}</div>
          <button type="button" data-toggle-specs class="w-full rounded-full border border-white/10 py-2 text-label-sm transition-all hover:bg-white/5">View Specs</button>
          <dl class="hidden grid-cols-2 gap-x-4 gap-y-1 border-t border-white/10 pt-3 text-label-sm" data-specs-panel>${specHtml || '<dt class="text-on-surface-variant">Details</dt><dd>Not provided</dd>'}</dl>
        </article>
      `;
    })
    .join('');

  gridEl.querySelectorAll('[data-toggle-specs]').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = button.nextElementSibling;
      const expanded = panel.classList.toggle('hidden') === false;
      panel.classList.toggle('grid', expanded);
      button.textContent = expanded ? 'Hide Specs' : 'View Specs';
    });
  });
}
