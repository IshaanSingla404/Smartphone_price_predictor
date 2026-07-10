const tasks = [...document.querySelectorAll('[data-loading-list] > div')];
const subtitle = document.querySelector('main p.mt-8');
let activeIndex = 2;
let animationDone = false;
let fetchStatus = 'pending'; // 'pending' | 'success' | 'error'
let fetchPayload = null;

function renderTasks() {
  tasks.forEach((task, index) => {
    const icon = task.querySelector('.material-symbols-outlined');
    const complete = index < activeIndex;
    const active = index === activeIndex;
    task.className = `flex items-center gap-3 ${complete ? 'text-primary' : active ? 'text-on-surface' : 'text-on-surface-variant opacity-50'}`;
    icon.textContent = complete ? 'check_circle' : active ? 'sync' : 'radio_button_unchecked';
    icon.classList.toggle('animate-spin', active);
  });
}

function markAllComplete() {
  tasks.forEach((task) => {
    task.className = 'flex items-center gap-3 text-primary';
    task.querySelector('.material-symbols-outlined').textContent = 'check_circle';
  });
}

function showError(message) {
  const lastTask = tasks[tasks.length - 1];
  lastTask.className = 'flex items-center gap-3 text-on-surface-variant';
  const icon = lastTask.querySelector('.material-symbols-outlined');
  icon.textContent = 'error';
  icon.classList.remove('animate-spin');
  if (subtitle) subtitle.textContent = message;
}

function finalize() {
  if (!animationDone || fetchStatus === 'pending') return;

  if (fetchStatus === 'error') {
    showError('We could not reach the prediction service. Please check your connection and try again.');
    return;
  }

  markAllComplete();
  sessionStorage.setItem('predictionResult', JSON.stringify(fetchPayload));
  window.setTimeout(() => { location.href = 'results.html'; }, 450);
}

const timer = window.setInterval(() => {
  activeIndex += 1;
  if (activeIndex >= tasks.length) {
    window.clearInterval(timer);
    animationDone = true;
    finalize();
    return;
  }
  renderTasks();
}, 850);

renderTasks();

const storedSpecs = sessionStorage.getItem('phoneSpecs');

if (!storedSpecs) {
  // Nothing to predict on — send the person back to the wizard.
  location.href = 'wizard.html';
} else {
  const phoneSpecs = JSON.parse(storedSpecs);

  fetch('https://forge-backend-dh8s.onrender.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(phoneSpecs)
  })
    .then((response) => {
      if (!response.ok) throw new Error(`Prediction request failed with status ${response.status}`);
      return response.json();
    })
    .then((data) => {
      fetchPayload = data;
      fetchStatus = 'success';
      finalize();
    })
    .catch((error) => {
      console.error('Prediction request failed:', error);
      fetchStatus = 'error';
      finalize();
    });
}
