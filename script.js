'use strict';
const tasks = {
  cube: {title:'Place a cube into a box',description:'We grasp, transfer and place the cube inside the box without collision.',rate:'80% → 90%',label:'Cube placing'},
  ducks: {title:'Rearrange five toys into a basket',description:'We rearrange five toys through successive grasp, move and release stages.',rate:'46% → 70%',label:'Duck rearrangement'},
  sloth: {title:'Toy packing: from failure to revision',description:'This attempt leaves part of the toy outside the basket. We revise and evaluate the policy to achieve full containment, as shown below.',rate:'40% → 80%',label:'Toy packing'}
};
const videos = ['sim','real'].map(kind=>document.getElementById(`task-${kind}`));
const status = document.getElementById('playback-status');
let taskKey='cube', playToken=0, pairPlaying=false;
function updateOutcome(){
  const failure=taskKey==='sloth'&&videos[1].ended;
  document.getElementById('toy-failure-marker').hidden=!failure;
  document.getElementById('task-outcome').textContent=failure?'Part remains outside the basket → Revise the policy and evaluate again.':'';
}
function stopPair(){playToken++;pairPlaying=false;videos.forEach(v=>v.pause())}
document.querySelectorAll('[data-task]').forEach(button=>button.addEventListener('click',()=>{
  stopPair();taskKey=button.dataset.task;const task=tasks[taskKey];
  document.querySelectorAll('[data-task]').forEach(other=>{const active=other===button;other.classList.toggle('active',active);other.setAttribute('aria-pressed',String(active))});
  document.getElementById('task-title').textContent=task.title;
  document.getElementById('task-description').textContent=task.description;
  document.getElementById('task-rate').textContent=task.rate;status.textContent='';
  videos.forEach((v,i)=>{const kind=i?'real':'sim';v.poster=`assets/videos/${taskKey}-${kind}.jpg`;v.querySelector('source').src=`assets/videos/${taskKey}-${kind}.mp4`;v.setAttribute('aria-label',`${task.label} — ${i?'real world':'simulation'}`);v.load()});
  document.getElementById('toy-failure-marker').hidden=true;document.getElementById('task-outcome').textContent='';
}));
function ready(v){return new Promise((resolve,reject)=>{
  const cleanup=()=>{v.removeEventListener('canplay',check);v.removeEventListener('seeked',check);v.removeEventListener('error',fail);clearTimeout(timer)};
  const check=()=>{if(v.readyState>=3&&!v.seeking){cleanup();resolve()}};
  const fail=()=>{cleanup();reject(new Error('Video unavailable'))};
  const timer=setTimeout(fail,15000);v.addEventListener('canplay',check);v.addEventListener('seeked',check);v.addEventListener('error',fail);check();
})}
document.getElementById('play-pair').addEventListener('click',async()=>{
  stopPair();const token=playToken;status.textContent='Loading paired videos…';
  videos.forEach(v=>{v.preload='auto';v.currentTime=0});updateOutcome();
  try{await Promise.all(videos.map(ready));if(token!==playToken)return;
    pairPlaying=true;await Promise.all(videos.map(v=>v.play()));if(token===playToken)status.textContent='';
  }catch{if(token===playToken){stopPair();status.textContent='Use the individual video controls to play each demonstration.'}}
});
document.getElementById('pause-pair').addEventListener('click',stopPair);
videos.forEach(v=>{v.addEventListener('ended',updateOutcome);v.addEventListener('seeked',updateOutcome);v.addEventListener('pause',()=>{if(pairPlaying&&!v.ended)stopPair()})});
setInterval(()=>{if(!pairPlaying)return;const [a,b]=videos;if(a.ended&&b.ended){pairPlaying=false;return}if(!a.seeking&&!b.seeking&&b.readyState>=3&&Math.abs(a.currentTime-b.currentTime)>.12)b.currentTime=a.currentTime},250);
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

const codeDialog = document.getElementById('code-dialog');
const codeButton = document.getElementById('open-code');
codeButton.addEventListener('click', () => codeDialog.showModal());
document.getElementById('close-code').addEventListener('click', () => codeDialog.close());
codeDialog.addEventListener('close', () => codeButton.focus());
codeDialog.addEventListener('click', event => {
  if (event.target !== codeDialog) return;
  const box = codeDialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) codeDialog.close();
});
