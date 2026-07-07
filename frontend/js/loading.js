const tasks = [...document.querySelectorAll('[data-loading-list] > div')];
let activeIndex = 2;

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

const timer = window.setInterval(() => {
  activeIndex += 1;
  if (activeIndex >= tasks.length) {
    window.clearInterval(timer);
    tasks.forEach((task) => {
      task.className = 'flex items-center gap-3 text-primary';
      task.querySelector('.material-symbols-outlined').textContent = 'check_circle';
    });
    window.setTimeout(() => { location.href = 'results.html'; }, 450);
    return;
  }
  renderTasks();
}, 850);

renderTasks();
