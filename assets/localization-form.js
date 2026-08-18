if (!customElements.get('localization-form')) {
	class LocalizationForm extends HTMLElement {
		constructor() {
			super();
			this.elements = {
				input: this.querySelector('input[name="locale_code"], input[name="country_code"]'),
				button: this.querySelector('[data-disclosure-toggle]'),
				panel: this.querySelector('.f-disclosure-list')
			};

			this.onDocumentClick = this.onDocumentClick.bind(this);

			if (this.elements.panel) {
				this.elements.panel.removeAttribute('hidden');
			}

			if (this.elements.button) {
				this.elements.button.addEventListener('click', this.openSelector.bind(this));
			}

			this.addEventListener('keyup', this.onContainerKeyUp.bind(this));
			this.querySelectorAll('a[data-disclosure-option]').forEach((item) =>
				item.addEventListener('click', this.onItemClick.bind(this))
			);

			this.handleDropdownPos();
		}

		disconnectedCallback() {
			document.removeEventListener('click', this.onDocumentClick);
		}

		handleDropdownPos() {
			if (!this.elements.button || !this.elements.panel) return;

			const offsetButton = this.elements.button.getBoundingClientRect().right;
			if (window.innerWidth - offsetButton < 220) {
				this.elements.panel.classList.add('f-disclosure-list__right');
			}
		}

		hidePanel() {
			if (!this.elements.button) return;

			this.elements.button.setAttribute('aria-expanded', 'false');
			this.removeAttribute('open');
			document.removeEventListener('click', this.onDocumentClick);
		}

		onContainerKeyUp(event) {
			if (event.code.toUpperCase() !== 'ESCAPE') return;

			this.hidePanel();
			this.elements.button.focus();
		}

		onDocumentClick(event) {
			if (!this.contains(event.target)) {
				this.hidePanel();
			}
		}

		onItemClick(event) {
			event.preventDefault();
			const form = this.querySelector('form');
			this.elements.input.value = event.currentTarget.dataset.value;
			if (form) form.submit();
		}

		openSelector(event) {
			event.preventDefault();
			event.stopPropagation();

			const isOpen = this.hasAttribute('open');

			if (isOpen) {
				this.hidePanel();
				return;
			}

			document.querySelectorAll('localization-form[open]').forEach((form) => {
				if (form !== this) form.hidePanel();
			});

			this.setAttribute('open', '');
			this.elements.button.setAttribute('aria-expanded', 'true');
			document.addEventListener('click', this.onDocumentClick);
		}
	}

	customElements.define('localization-form', LocalizationForm);
}
