'use strict';
const tasks = {
  cube: { title: 'Place a cube into a box', description: 'Predict collision-free placement using the cube and box geometry. Evaluate the trajectory in simulation before executing it on the physical robot.', rate: '80% → 90%', image: 'real-sim-cube-sloth', alt: 'Cube placing and sloth packing sequences. Rows 1 and 3: simulation; rows 2 and 4: real-world rollout.', caption: 'Cube placing (top two rows) and sloth packing (bottom two rows). Each pair compares simulation with real-world execution.' },
  sloth: { title: 'Pack a soft toy into a basket', description: 'Use geometry-aware grasp and placement keypoints to pack a sloth toy. Contact simulation models body-part deformation; success requires the whole toy to be inside the basket.', rate: '40% → 80%', image: 'real-sim-cube-sloth', alt: 'Sloth packing in the bottom two rows: simulated contact and real-world grasping, placing, and release. Cube placing is shown in the top two rows.', caption: 'Focus on the bottom two rows: sloth packing in simulation and on the real robot, from initial state through release.' },
  ducks: { title: 'Rearrange five deformable ducks', description: 'Place five duck toys into a basket in sequence. Each duck requires grasping, moving, and releasing, making this a long-horizon test of subtask consistency.', rate: '46% → 70%', image: 'real-sim', alt: 'Five duck rearrangement sequences from left to right, each comparing simulation and real-world initial state, grasping, and placement.', caption: 'Ducks 1–5, from left to right. Each pair compares simulation and real-world rollout across initial state, grasping, and placement.' }
};
document.querySelectorAll('[data-task]').forEach(button => {
  button.addEventListener('click', () => {
    const task = tasks[button.dataset.task];
    document.querySelectorAll('[data-task]').forEach(other => { const active = other === button; other.classList.toggle('active', active); other.setAttribute('aria-pressed', String(active)); });
    document.getElementById('task-title').textContent = task.title;
    document.getElementById('task-description').textContent = task.description;
    document.getElementById('task-rate').textContent = task.rate;
    const img = document.getElementById('task-image');
    img.src = `assets/images/${task.image}.webp`; img.alt = task.alt;
    document.getElementById('task-image-link').href = img.src;
    document.getElementById('task-caption').textContent = task.caption;
  });
});
const dialog = document.getElementById('figure-dialog');
document.querySelectorAll('[data-zoom]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || typeof dialog.showModal !== 'function') return;
    event.preventDefault();
    const image = link.querySelector('img');
    const enlarged = document.getElementById('enlarged-figure');
    enlarged.src = link.href; enlarged.alt = image.alt;
    document.getElementById('figure-dialog-caption').textContent = link.closest('figure').querySelector('figcaption')?.textContent || image.alt;
    dialog.showModal();
  });
});
document.getElementById('close-figure').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
