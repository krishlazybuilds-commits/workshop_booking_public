/**
 * pg-dropdown.js — Custom Dropdown Component
 * Auto-converts all <select> elements with .pg-input class
 * into styled custom dropdowns. Keeps native <select> hidden
 * for form submission. Includes search for long lists.
 */
(function () {
  'use strict';

  const SEARCH_THRESHOLD = 8; // Show search box if options > this
  const VIEWPORT_GAP = 10;

  function getVisibleOptions(container) {
    return Array.from(container.querySelectorAll('.pg-dropdown__option')).filter(function (option) {
      return option.style.display !== 'none';
    });
  }

  function closeDropdown(wrapper) {
    if (!wrapper) return;
    wrapper.classList.remove('pg-dropdown--open');
    var trigger = wrapper.querySelector('.pg-dropdown__trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    wrapper.style.removeProperty('--pg-dropdown-max-height');
  }

  function closeAllDropdowns(exceptWrapper) {
    document.querySelectorAll('.pg-dropdown--open').forEach(function (dropdown) {
      if (dropdown !== exceptWrapper) {
        closeDropdown(dropdown);
      }
    });
  }

  function updateMenuPlacement(wrapper) {
    var trigger = wrapper.querySelector('.pg-dropdown__typeahead') || wrapper.querySelector('.pg-dropdown__trigger');
    var menu = wrapper.querySelector('.pg-dropdown__menu');

    if (!trigger || !menu) return;

    var triggerRect = trigger.getBoundingClientRect();
    var menuRect = menu.getBoundingClientRect();
    var preferredHeight = menu.scrollHeight;
    var menuHeight = Math.max(menuRect.height, preferredHeight);
    var spaceBelow = Math.max(window.innerHeight - triggerRect.bottom - VIEWPORT_GAP, 0);
    var spaceAbove = Math.max(triggerRect.top - VIEWPORT_GAP, 0);
    var shouldOpenUp = spaceBelow < menuHeight && spaceAbove > spaceBelow;
    var availableHeight = shouldOpenUp ? spaceAbove : spaceBelow;

    wrapper.classList.toggle('pg-dropdown--up', shouldOpenUp);
    wrapper.style.setProperty('--pg-dropdown-max-height', Math.max(Math.min(availableHeight, 320), 120) + 'px');
  }

  function createDropdown(select) {
    // Skip if already upgraded
    if (select.dataset.pgUpgraded || select.dataset.pgSkip) return;
    select.dataset.pgUpgraded = 'true';

    const options = Array.from(select.options);
    const selectedIndex = select.selectedIndex;
    const hasSearch = options.length > SEARCH_THRESHOLD || select.dataset.pgSearchable === 'true';
    const variant = select.dataset.pgVariant || (hasSearch ? 'combobox' : 'default');

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'pg-dropdown';
    wrapper.classList.add('pg-dropdown--' + variant);

    // Create trigger button
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'pg-dropdown__trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-label', select.getAttribute('aria-label') || select.getAttribute('name') || 'Select option');

    const triggerText = document.createElement('span');
    triggerText.className = 'pg-dropdown__trigger-text';
    const selectedOpt = options[selectedIndex];
    triggerText.textContent = selectedOpt ? selectedOpt.textContent : 'Select...';
    if (!selectedOpt || selectedOpt.value === '' || selectedOpt.textContent.startsWith('---')) {
      triggerText.classList.add('pg-dropdown__trigger-text--placeholder');
    }

    const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    chevron.setAttribute('viewBox', '0 0 24 24');
    chevron.classList.add('pg-dropdown__chevron');
    const chevronPath = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    chevronPath.setAttribute('points', '6 9 12 15 18 9');
    chevron.appendChild(chevronPath);

    trigger.appendChild(triggerText);
    trigger.appendChild(chevron);

    // Create menu
    const menu = document.createElement('div');
    menu.className = 'pg-dropdown__menu';
    menu.setAttribute('role', 'listbox');

    let searchInput = null;
    if (hasSearch && variant !== 'typeahead') {
      const searchWrap = document.createElement('div');
      searchWrap.className = 'pg-dropdown__search-wrap';
      searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.className = 'pg-dropdown__search';
      searchInput.placeholder = 'Search...';
      searchInput.setAttribute('autocomplete', 'off');
      searchWrap.appendChild(searchInput);
      menu.appendChild(searchWrap);
    }

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'pg-dropdown__options';

    if (variant === 'pills') {
      optionsContainer.classList.add('pg-dropdown__options--pills');
    }

    // Build option items
    options.forEach(function (opt, i) {
      const item = document.createElement('div');
      item.className = 'pg-dropdown__option';
      item.setAttribute('role', 'option');
      item.dataset.value = opt.value;
      item.dataset.index = i;

      if (variant === 'pills') {
        item.classList.add('pg-dropdown__option--pill');
      }

      if (opt.value === '' || opt.textContent.startsWith('---')) {
        item.classList.add('pg-dropdown__option--placeholder');
      }

      const label = document.createElement('span');
      label.textContent = opt.textContent;

      const check = document.createElement('span');
      check.className = 'pg-dropdown__check';
      check.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>';

      item.appendChild(label);
      item.appendChild(check);

      if (i === selectedIndex) {
        item.classList.add('pg-dropdown__option--selected');
      }

      if (variant === 'pills') {
        item.setAttribute('tabindex', opt.value === '' ? '-1' : '0');
      }

      item.addEventListener('click', function () {
        if (opt.value === '') return;
        selectOption(wrapper, select, item, triggerText, optionsContainer);
      });

      item.addEventListener('keydown', function (e) {
        if (variant !== 'pills') return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (opt.value !== '') {
            selectOption(wrapper, select, item, triggerText, optionsContainer);
          }
        }
      });

      optionsContainer.appendChild(item);
    });

    // Pinned / Popular items support
    var pinnedStr = select.dataset.pgPinned;
    if (pinnedStr && variant !== 'pills') {
      var pinnedValues = pinnedStr.split(',').map(function(v) { return v.trim(); });
      var allItems = Array.from(optionsContainer.children);
      var placeholders = [];
      var pinnedItems = [];
      var otherItems = [];

      allItems.forEach(function(el) {
        if (el.classList.contains('pg-dropdown__option--placeholder')) {
          placeholders.push(el);
        } else if (pinnedValues.indexOf(el.dataset.value) !== -1) {
          pinnedItems.push(el);
        } else {
          otherItems.push(el);
        }
      });

      if (pinnedItems.length > 0) {
        while (optionsContainer.firstChild) {
          optionsContainer.removeChild(optionsContainer.firstChild);
        }

        placeholders.forEach(function(p) { optionsContainer.appendChild(p); });

        var popularHeader = document.createElement('div');
        popularHeader.className = 'pg-dropdown__group-header';
        popularHeader.innerHTML = '<span class="pg-dropdown__group-icon">&#9733;</span> Popular';
        optionsContainer.appendChild(popularHeader);
        pinnedItems.forEach(function(el) { optionsContainer.appendChild(el); });

        var allHeader = document.createElement('div');
        allHeader.className = 'pg-dropdown__group-header';
        allHeader.textContent = 'All';
        optionsContainer.appendChild(allHeader);
        otherItems.forEach(function(el) { optionsContainer.appendChild(el); });
      }
    }

    menu.appendChild(optionsContainer);

    // Assemble
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(trigger);
    wrapper.appendChild(menu);
    wrapper.appendChild(select);

    // Hide native select
    select.style.display = 'none';
    select.setAttribute('tabindex', '-1');
    select.setAttribute('aria-hidden', 'true');

    if (variant === 'pills') {
      wrapper.classList.add('pg-dropdown--static');
      menu.classList.add('pg-dropdown__menu--static');
      menu.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-hidden', 'true');
      trigger.tabIndex = -1;
    } else if (variant === 'typeahead') {
      // Typeahead: hide trigger, create text input
      trigger.style.display = 'none';

      var typeaheadInput = document.createElement('input');
      typeaheadInput.type = 'text';
      typeaheadInput.className = 'pg-dropdown__typeahead pg-input';
      typeaheadInput.placeholder = select.dataset.pgPlaceholder || 'Start typing to search…';
      typeaheadInput.setAttribute('autocomplete', 'off');
      typeaheadInput.setAttribute('spellcheck', 'false');

      // Set initial value from selected option
      var selOpt = options[selectedIndex];
      if (selOpt && selOpt.value !== '' && !selOpt.textContent.startsWith('---')) {
        typeaheadInput.value = selOpt.textContent;
      }

      wrapper.insertBefore(typeaheadInput, menu);

      // Open dropdown on focus
      typeaheadInput.addEventListener('focus', function () {
        closeAllDropdowns(wrapper);
        wrapper.classList.add('pg-dropdown--open');
        updateMenuPlacement(wrapper);
        filterOptions(optionsContainer, typeaheadInput.value);
        typeaheadInput.select();

        var menu = wrapper.querySelector('.pg-dropdown__menu');
        if (menu) menu.scrollTop = 0;
        var sel = optionsContainer.querySelector('.pg-dropdown__option--selected');
        if (sel) setTimeout(function () { sel.scrollIntoView({ block: 'nearest' }); }, 50);
      });

      // Filter as user types
      typeaheadInput.addEventListener('input', function () {
        if (!wrapper.classList.contains('pg-dropdown--open')) {
          wrapper.classList.add('pg-dropdown--open');
          updateMenuPlacement(wrapper);
        }
        filterOptions(optionsContainer, typeaheadInput.value);
        // Clear any focused option
        optionsContainer.querySelectorAll('.pg-dropdown__option--focused').forEach(function (o) {
          o.classList.remove('pg-dropdown__option--focused');
        });
      });

      // Reset on blur if nothing selected
      typeaheadInput.addEventListener('blur', function () {
        setTimeout(function () {
          if (wrapper.classList.contains('pg-dropdown--open')) return;
          var sel = optionsContainer.querySelector('.pg-dropdown__option--selected');
          if (sel && !sel.classList.contains('pg-dropdown__option--placeholder')) {
            typeaheadInput.value = sel.querySelector('span').textContent;
          } else {
            typeaheadInput.value = '';
          }
        }, 200);
      });

      // Keyboard navigation for typeahead
      typeaheadInput.addEventListener('keydown', function (e) {
        var isOpen = wrapper.classList.contains('pg-dropdown--open');
        var visOpts = getVisibleOptions(optionsContainer);

        if (e.key === 'Escape') {
          closeDropdown(wrapper);
          typeaheadInput.blur();
          e.preventDefault();
          return;
        }

        if (e.key === 'Enter') {
          e.preventDefault();
          var focused = optionsContainer.querySelector('.pg-dropdown__option--focused');
          if (focused) {
            selectOption(wrapper, select, focused, triggerText, optionsContainer);
          } else if (visOpts.length === 1) {
            selectOption(wrapper, select, visOpts[0], triggerText, optionsContainer);
          }
          return;
        }

        if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && isOpen) {
          e.preventDefault();
          var current = optionsContainer.querySelector('.pg-dropdown__option--focused');
          var idx = current ? visOpts.indexOf(current) : -1;
          if (e.key === 'ArrowDown') { idx = Math.min(idx + 1, visOpts.length - 1); }
          else { idx = Math.max(idx - 1, 0); }
          visOpts.forEach(function (o) { o.classList.remove('pg-dropdown__option--focused'); });
          if (visOpts[idx]) {
            visOpts[idx].classList.add('pg-dropdown__option--focused');
            visOpts[idx].scrollIntoView({ block: 'nearest' });
          }
        }
      });
    } else {
      // Toggle open/close
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleDropdown(wrapper, searchInput);
      });
    }

    // Search filter
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        filterOptions(optionsContainer, searchInput.value);
      });
      // Prevent clicks inside search from closing
      searchInput.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }

    // Keyboard navigation
    if (variant !== 'pills' && variant !== 'typeahead') {
      trigger.addEventListener('keydown', function (e) {
        handleKeyboard(e, wrapper, select, optionsContainer, triggerText, searchInput);
      });
      menu.addEventListener('keydown', function (e) {
        handleKeyboard(e, wrapper, select, optionsContainer, triggerText, searchInput);
      });
    }
  }

  function toggleDropdown(wrapper, searchInput) {
    const isOpen = wrapper.classList.contains('pg-dropdown--open');
    closeAllDropdowns(wrapper);

    if (!isOpen) {
      wrapper.classList.add('pg-dropdown--open');
      wrapper.querySelector('.pg-dropdown__trigger').setAttribute('aria-expanded', 'true');
      updateMenuPlacement(wrapper);

      // Reset menu scroll position
      var menu = wrapper.querySelector('.pg-dropdown__menu');
      if (menu) menu.scrollTop = 0;

      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
        filterOptions(wrapper.querySelector('.pg-dropdown__options'), '');
      }
      // Scroll selected into view
      var sel = wrapper.querySelector('.pg-dropdown__option--selected');
      if (sel) {
        setTimeout(function () { sel.scrollIntoView({ block: 'nearest' }); }, 50);
      }
    }
  }

  function selectOption(wrapper, select, item, triggerText, container) {
    if (item.classList.contains('pg-dropdown__option--placeholder')) {
      return;
    }

    // Update native select
    select.selectedIndex = parseInt(item.dataset.index);
    select.dispatchEvent(new Event('change', { bubbles: true }));

    // Update selected state
    container.querySelectorAll('.pg-dropdown__option').forEach(function (o) {
      o.classList.remove('pg-dropdown__option--selected');
    });
    item.classList.add('pg-dropdown__option--selected');

    // Handle typeahead variant
    var typeaheadInput = wrapper.querySelector('.pg-dropdown__typeahead');
    if (typeaheadInput) {
      typeaheadInput.value = item.querySelector('span').textContent;
      closeDropdown(wrapper);
      return;
    }

    // Update trigger text
    triggerText.textContent = item.querySelector('span').textContent;
    triggerText.classList.remove('pg-dropdown__trigger-text--placeholder');

    if (wrapper.classList.contains('pg-dropdown--pills')) {
      item.focus();
      return;
    }

    // Close
    closeDropdown(wrapper);
    wrapper.querySelector('.pg-dropdown__trigger').focus();
  }

  function filterOptions(container, query) {
    const q = query.toLowerCase().trim();
    let hasVisible = false;
    container.querySelectorAll('.pg-dropdown__option').forEach(function (item) {
      if (item.classList.contains('pg-dropdown__option--placeholder')) {
        item.style.display = 'none';
        return;
      }
      const text = item.querySelector('span').textContent.toLowerCase();
      const match = !q || text.includes(q);
      item.style.display = match ? '' : 'none';
      if (match) hasVisible = true;
    });

    // Hide group headers when filtering
    container.querySelectorAll('.pg-dropdown__group-header').forEach(function(header) {
      header.style.display = q ? 'none' : '';
    });

    // Show/hide empty state
    let emptyEl = container.querySelector('.pg-dropdown__empty');
    if (!hasVisible) {
      if (!emptyEl) {
        emptyEl = document.createElement('div');
        emptyEl.className = 'pg-dropdown__empty';
        emptyEl.textContent = 'No results found';
        container.appendChild(emptyEl);
      }
      emptyEl.style.display = '';
    } else if (emptyEl) {
      emptyEl.style.display = 'none';
    }
  }

  function handleKeyboard(e, wrapper, select, container, triggerText, searchInput) {
    const isOpen = wrapper.classList.contains('pg-dropdown--open');
    const options = getVisibleOptions(container);

    if (e.key === 'Escape') {
      closeDropdown(wrapper);
      wrapper.querySelector('.pg-dropdown__trigger').focus();
      e.preventDefault();
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      if (!isOpen) {
        e.preventDefault();
        toggleDropdown(wrapper, searchInput);
        return;
      }
      // Select focused item
      const focused = container.querySelector('.pg-dropdown__option--focused');
      if (focused) {
        e.preventDefault();
        selectOption(wrapper, select, focused, triggerText, container);
      }
      return;
    }

    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && isOpen) {
      e.preventDefault();
      const current = container.querySelector('.pg-dropdown__option--focused');
      let idx = current ? options.indexOf(current) : -1;

      if (e.key === 'ArrowDown') {
        idx = Math.min(idx + 1, options.length - 1);
      } else {
        idx = Math.max(idx - 1, 0);
      }

      options.forEach(function (o) { o.classList.remove('pg-dropdown__option--focused'); });
      if (options[idx]) {
        options[idx].classList.add('pg-dropdown__option--focused');
        options[idx].scrollIntoView({ block: 'nearest' });
      }
    }
  }

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.pg-dropdown')) {
      closeAllDropdowns();
    }
  });

  window.addEventListener('resize', function () {
    document.querySelectorAll('.pg-dropdown--open').forEach(updateMenuPlacement);
  });

  window.addEventListener('scroll', function () {
    document.querySelectorAll('.pg-dropdown--open').forEach(updateMenuPlacement);
  }, true);

  // Initialize: upgrade all select.pg-input
  function init() {
    document.querySelectorAll('select.pg-input').forEach(createDropdown);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
