(() => {
  'use strict';

  const host = document.getElementById('thesisLineage');
  if (!host) return;

  const path = host.querySelector('.lineage-path');
  if (!path) return;

  const labels = [...path.querySelectorAll('span')]
    .map(node => node.textContent.trim())
    .filter(Boolean);

  const grid = document.createElement('div');
  grid.className = 'lineage-grid';
  grid.setAttribute('aria-label', '박사논문 연구 연속성');

  labels.forEach((label, index) => {
    const cell = document.createElement('div');
    cell.className = 'lineage-step';

    const number = document.createElement('span');
    number.className = 'lineage-step-number';
    number.textContent = String(index + 1).padStart(2, '0');

    const title = document.createElement('span');
    title.className = 'lineage-step-title';
    title.textContent = label;

    cell.append(number, title);
    grid.appendChild(cell);
  });

  path.replaceWith(grid);
})();
