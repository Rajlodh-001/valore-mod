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

    this.onDocumentClick = (event) => {
      if (!this.root.isConnected) {
        document.removeEventListener('click', this.onDocumentClick);
        return;
      }
      if (!this.root.contains(event.target)) {
        this.sortToggle.setAttribute('aria-expanded', 'false');
        this.sortPanel.hidden = true;
      }
    };
    document.addEventListener('click', this.onDocumentClick);

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
    this.productGrid = document.querySelector('[data-products-grid]');
    if (!this.productGrid) return;
    this.productGrid.dataset.desktopColumns = columns;
    localStorage.setItem(this.storageKey, columns);
    this.layoutButtons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.prestigeDesktopColumns === columns);
    });
  }
}

function initPrestigeCollectionToolbars(scope) {
  const root = scope || document;
  root.querySelectorAll('[data-prestige-collection-toolbar]').forEach((toolbar) => {
    if (toolbar.dataset.prestigeInit === 'true') return;
    toolbar.dataset.prestigeInit = 'true';
    new PrestigeCollectionToolbar(toolbar);
  });
}

window.initPrestigeCollectionToolbars = initPrestigeCollectionToolbars;

document.addEventListener('DOMContentLoaded', () => {
  initPrestigeCollectionToolbars();
});

document.addEventListener('shopify:section:load', (event) => {
  initPrestigeCollectionToolbars(event.target);
});
