class PrestigeCollectionToolbar {
  constructor(root) {
    this.root = root;
    this.sortToggle = root.querySelector('[data-prestige-sort-toggle]');
    this.sortPanel = root.querySelector('[data-prestige-sort-panel]');
    this.sortOptions = root.querySelectorAll('[data-prestige-sort-option]');
    this.layoutButtons = root.querySelectorAll('[data-prestige-desktop-columns]');
    this.productGrid = document.querySelector('[data-products-grid]');
    this.storageKey = 'foxtheme:prestige-desktop-columns';

    this.initSort();
    this.initLayout();
  }

  initSort() {
    if (!this.sortToggle || !this.sortPanel) return;

    this.sortToggle.addEventListener('click', () => {
      const expanded = this.sortToggle.getAttribute('aria-expanded') === 'true';
      this.sortToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      this.sortPanel.hidden = expanded;
    });

    document.addEventListener('click', (event) => {
      if (!this.root.contains(event.target)) {
        this.sortToggle.setAttribute('aria-expanded', 'false');
        this.sortPanel.hidden = true;
      }
    });

    this.sortOptions.forEach((button) => {
      button.addEventListener('click', () => {
        const sortForm = document.querySelector('#FacetSortForm');
        const sortSelect = sortForm?.querySelector('[name="sort_by"]');
        if (!sortSelect) return;
        sortSelect.value = button.dataset.prestigeSortOption;
        sortSelect.dispatchEvent(new Event('input', { bubbles: true }));
        this.sortOptions.forEach((opt) => opt.classList.remove('is-selected'));
        button.classList.add('is-selected');
        this.sortToggle.setAttribute('aria-expanded', 'false');
        this.sortPanel.hidden = true;
      });
    });
  }

  initLayout() {
    if (!this.productGrid || !this.layoutButtons.length) return;

    const saved = localStorage.getItem(this.storageKey) || '3';
    this.setDesktopColumns(saved);

    this.layoutButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.setDesktopColumns(button.dataset.prestigeDesktopColumns);
      });
    });
  }

  setDesktopColumns(columns) {
    if (!this.productGrid) return;
    this.productGrid.dataset.desktopColumns = columns;
    localStorage.setItem(this.storageKey, columns);
    this.layoutButtons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.prestigeDesktopColumns === columns);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-prestige-collection-toolbar]').forEach((toolbar) => {
    new PrestigeCollectionToolbar(toolbar);
  });
});

document.addEventListener('shopify:section:load', (event) => {
  event.target.querySelectorAll('[data-prestige-collection-toolbar]').forEach((toolbar) => {
    new PrestigeCollectionToolbar(toolbar);
  });
});
