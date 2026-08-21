/**
 * Description tab images: one image per cell, Show more, desktop 2/4 toggle.
 */
(() => {
  const LIMIT = 4;
  const STORAGE_KEY = 'valore-desc-image-cols';

  function isImageOnlyBlock(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.matches('img')) return true;
    if (!el.matches('p, figure, div')) return false;
    if (!el.querySelector('img')) return false;
    const clone = el.cloneNode(true);
    clone.querySelectorAll('img, br, script, style').forEach((n) => n.remove());
    const text = (clone.textContent || '').replace(/\s+/g, ' ').trim();
    return text.length < 40;
  }

  function consecutiveRuns(children) {
    const runs = [];
    let current = [];

    children.forEach((child) => {
      if (isImageOnlyBlock(child)) {
        current.push(child);
      } else if (current.length) {
        runs.push(current);
        current = [];
      }
    });
    if (current.length) runs.push(current);
    return runs;
  }

  /** One grid cell per <img> so 4-col shows 4 images per row. */
  function flattenToCells(blocks) {
    const cells = [];
    blocks.forEach((block) => {
      const imgs = block.matches('img') ? [block] : Array.from(block.querySelectorAll('img'));
      imgs.forEach((img) => {
        const cell = document.createElement('div');
        cell.className = 'f-rte-image-cell';
        cell.appendChild(img);
        cells.push(cell);
      });
      if (block.parentNode) block.remove();
    });
    return cells;
  }

  function applyLimitToGrid(grid, limit) {
    Array.from(grid.children).forEach((cell, index) => {
      if (index >= limit) cell.classList.add('f-rte-image-block--hidden');
    });
  }

  function getSection(rte) {
    return rte.closest('.f-information-tabs');
  }

  function setSectionCols(section, cols) {
    if (!section) return;
    section.classList.remove('f-information-tabs--images-2', 'f-information-tabs--images-4');
    section.classList.add(`f-information-tabs--images-${cols}`);
    section.dataset.descImageCols = String(cols);
    section.style.setProperty('--f-rte-image-cols', String(cols));
    section.querySelectorAll('.f-rte-images-grid').forEach((grid) => {
      grid.style.setProperty('--f-rte-image-cols', String(cols));
      grid.dataset.cols = String(cols);
    });
  }

  function preferredCols(section) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === '2' || stored === '4') return stored;
    } catch (e) {
      /* ignore */
    }
    const fromSection = section && section.dataset.descImageCols;
    return fromSection === '2' || fromSection === '4' ? fromSection : '4';
  }

  function syncColsSwitch(wrap, active) {
    if (!wrap) return;
    wrap.querySelectorAll('.f-rte-cols-switch__btn').forEach((btn) => {
      const on = btn.dataset.cols === active;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function wireColsSwitch(section, wrap) {
    if (!section || !wrap || wrap.dataset.wired === 'true') return;
    wrap.dataset.wired = 'true';

    const cols = preferredCols(section);
    setSectionCols(section, cols);
    syncColsSwitch(wrap, cols);
    wrap.hidden = false;

    wrap.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-cols]');
      if (!btn) return;
      const next = btn.dataset.cols;
      if (next !== '2' && next !== '4') return;
      setSectionCols(section, next);
      syncColsSwitch(wrap, next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        /* ignore */
      }
    });
  }

  function moveSwitchAboveGrid(contentInner, firstGrid) {
    const wrap = contentInner && contentInner.querySelector(':scope > .f-rte-cols-switch');
    if (!wrap || !firstGrid) return wrap;
    firstGrid.insertAdjacentElement('beforebegin', wrap);
    return wrap;
  }

  function appendShowMore(rte, afterEl) {
    if (rte.parentElement && rte.parentElement.querySelector('.f-rte-images-toggle')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'f-rte-images-toggle btn btn--underline';
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML =
      '<span class="f-rte-images-toggle__more">Show more</span>' +
      '<span class="f-rte-images-toggle__less hidden">Show less</span>';

    afterEl.insertAdjacentElement('afterend', btn);

    btn.addEventListener('click', () => {
      const expanded = rte.classList.toggle('is-images-expanded');
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      btn.querySelector('.f-rte-images-toggle__more').classList.toggle('hidden', expanded);
      btn.querySelector('.f-rte-images-toggle__less').classList.toggle('hidden', !expanded);
    });
  }

  function initRte(rte) {
    if (!rte || rte.dataset.imagesCollapseInit === 'true') return;

    const section = getSection(rte);
    const contentInner = rte.closest('.f-tabs__content-inner');
    const limit = Number(rte.dataset.imageLimit || LIMIT);
    const runs = consecutiveRuns(Array.from(rte.children));

    const hasAnyImage = rte.querySelector('img');
    const switchEl = contentInner && contentInner.querySelector(':scope > .f-rte-cols-switch');
    if (hasAnyImage && section && switchEl) {
      wireColsSwitch(section, switchEl);
    }

    if (!runs.length) {
      if (hasAnyImage && switchEl) switchEl.hidden = false;
      return;
    }

    const cols = preferredCols(section);
    const grids = [];
    let totalImages = 0;

    runs.forEach((run) => {
      if (run.length < 1) return;

      const grid = document.createElement('div');
      grid.className = 'f-rte-images-grid';
      grid.dataset.cols = cols;
      grid.style.setProperty('--f-rte-image-cols', cols);
      run[0].parentNode.insertBefore(grid, run[0]);

      const cells = flattenToCells(run);
      cells.forEach((cell) => grid.appendChild(cell));

      totalImages += cells.length;
      grids.push(grid);
    });

    if (!grids.length) return;
    rte.dataset.imagesCollapseInit = 'true';

    const placedSwitch = moveSwitchAboveGrid(contentInner, grids[0]);
    if (section && placedSwitch) wireColsSwitch(section, placedSwitch);
    setSectionCols(section, cols);

    if (totalImages <= limit) return;

    let remaining = limit;
    let toggleHost = null;

    grids.forEach((grid) => {
      const count = grid.children.length;
      if (remaining <= 0) {
        Array.from(grid.children).forEach((cell) => cell.classList.add('f-rte-image-block--hidden'));
        return;
      }
      if (count > remaining) {
        applyLimitToGrid(grid, remaining);
        remaining = 0;
        toggleHost = grid;
      } else {
        remaining -= count;
        if (remaining === 0) toggleHost = grid;
      }
    });

    if (!toggleHost) {
      const firstHidden = rte.querySelector('.f-rte-image-block--hidden');
      if (firstHidden) toggleHost = firstHidden.closest('.f-rte-images-grid');
    }

    if (toggleHost && rte.querySelector('.f-rte-image-block--hidden')) {
      appendShowMore(rte, toggleHost);
    }
  }

  function initAll(root = document) {
    root
      .querySelectorAll('.f-information-tabs .f-tabs__content-inner .rte.f-rte--collapse-images')
      .forEach(initRte);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initAll());
  } else {
    initAll();
  }

  document.addEventListener('shopify:section:load', (event) => {
    initAll(event.target);
  });
})();
