document.addEventListener('DOMContentLoaded', () => {
  const propertyResults = document.getElementById('propertyResults');
  const featuredProperties = document.getElementById('featuredProperties');
  const recommendedProperties = document.getElementById('recommendedProperties');
  const rentProperties = document.getElementById('rentProperties');
  const shortlistList = document.getElementById('shortlistList');
  const compareTable = document.getElementById('compareTable');
  const resultsCount = document.getElementById('resultsCount');
  const totalProperties = document.getElementById('totalProperties');
  const apiStatus = document.getElementById('apiStatus');
  const modal = document.getElementById('propertyModal');
  const modalBody = document.getElementById('modalBody');
  const closeModalButton = document.getElementById('closeModal');
  const searchForm = document.getElementById('searchForm');

  const STORAGE_KEYS = {
    shortlist: 'pf-shortlist',
    compare: 'pf-compare',
    listings: 'pf-listings',
    filters: 'pf-search-filters'
  };

  const state = {
    allProperties: [],
    filteredProperties: [],
    shortlist: readSafeArray(STORAGE_KEYS.shortlist),
    compareList: readSafeArray(STORAGE_KEYS.compare)
  };

  function readSafeArray(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch (error) {
      console.warn(`Unable to parse localStorage key ${key}:`, error);
      return [];
    }
  }

  function persistArray(key, values) {
    try {
      localStorage.setItem(key, JSON.stringify(Array.isArray(values) ? values : []));
    } catch (error) {
      console.warn(`Unable to save localStorage key ${key}:`, error);
    }
  }

  function formatCurrency(value) {
    return `₹${Number(value || 0).toLocaleString('en-IN')}`;
  }

  function sanitize(text) {
    return String(text ?? '').replace(/[<>]/g, '').trim();
  }

  function setApiStatus(message) {
    if (!apiStatus) return;
    apiStatus.textContent = message;
    apiStatus.classList.toggle('hidden', !message);
  }

  function imageFallback(event) {
    event.target.onerror = null;
    event.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';
  }

  function getFilterState() {
    const form = searchForm;
    if (!form) return {};

    return {
      location: form.querySelector('#locationInput')?.value.trim() || '',
      type: form.querySelector('#typeInput')?.value || '',
      minPrice: form.querySelector('#minPriceInput')?.value || '',
      maxPrice: form.querySelector('#maxPriceInput')?.value || '',
      bhk: form.querySelector('#bhkInput')?.value || '',
      minArea: form.querySelector('#minAreaInput')?.value || '',
      maxArea: form.querySelector('#maxAreaInput')?.value || '',
      amenities: form.querySelector('#amenitiesInput')?.value.trim() || '',
      rating: form.querySelector('#ratingInput')?.value || '',
      availability: form.querySelector('#availabilityInput')?.value || ''
    };
  }

  function saveFilters() {
    try {
      localStorage.setItem(STORAGE_KEYS.filters, JSON.stringify(getFilterState()));
    } catch (error) {
      console.warn('Unable to save search filters:', error);
    }
  }

  function restoreFilters() {
    if (!searchForm) return;

    try {
      const raw = localStorage.getItem(STORAGE_KEYS.filters);
      if (!raw) return;
      const filters = JSON.parse(raw);
      if (!filters || typeof filters !== 'object') return;

      const fieldMap = {
        location: '#locationInput',
        type: '#typeInput',
        minPrice: '#minPriceInput',
        maxPrice: '#maxPriceInput',
        bhk: '#bhkInput',
        minArea: '#minAreaInput',
        maxArea: '#maxAreaInput',
        amenities: '#amenitiesInput',
        rating: '#ratingInput',
        availability: '#availabilityInput'
      };

      Object.entries(fieldMap).forEach(([key, selector]) => {
        const element = searchForm.querySelector(selector);
        if (!element || filters[key] === undefined) return;
        element.value = filters[key];
      });
    } catch (error) {
      console.warn('Unable to restore search filters:', error);
    }
  }

  function renderEmptyState(target, message) {
    if (!target) return;
    target.innerHTML = `<div class="empty-state">${sanitize(message)}</div>`;
  }

  function renderFeatured(properties) {
    if (!featuredProperties) return;
    if (!properties.length) {
      renderEmptyState(featuredProperties, 'No featured properties match the current filters.');
      return;
    }

    const featured = properties.slice(0, 3);
    featuredProperties.innerHTML = featured.map(property => `
      <article class="feature-card">
        <img src="${property.image}" alt="${sanitize(property.name)}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';" />
        <div class="feature-info">
          <div class="feature-head">
            <span>${sanitize(property.type)}</span>
            <span class="feature-rating">★ ${property.rating}</span>
          </div>
          <h3>${sanitize(property.name)}</h3>
          <p>${sanitize(property.location)}, ${sanitize(property.city)}</p>
          <div class="feature-meta">
            <span>${property.bhk} BHK</span>
            <span>${property.area.toLocaleString()} sq ft</span>
          </div>
          <div class="feature-footer">
            <strong>${formatCurrency(property.price)}</strong>
            <button type="button" class="small-link" data-id="${property.id}" data-action="details">View Details</button>
          </div>
        </div>
      </article>
    `).join('');
  }

  function renderRecommended(properties, target = recommendedProperties) {
    if (!target) return;
    if (!properties.length) {
      renderEmptyState(target, 'No recommended properties available for these filters.');
      return;
    }

    const recommended = properties.slice(0, 4);
    target.innerHTML = recommended.map(property => `
      <article class="mini-card" data-id="${property.id}" data-action="details">
        <img src="${property.image}" alt="${sanitize(property.name)}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';" />
        <div>
          <h3>${sanitize(property.name)}</h3>
          <p>${sanitize(property.location)} • ${property.bhk} BHK</p>
          <div class="mini-row">
            <strong>${formatCurrency(property.price)}</strong>
            <span>★ ${property.rating}</span>
          </div>
          <div class="mini-actions">
            <button type="button" class="primary-btn tiny" data-id="${property.id}" data-action="details">View Details</button>
          </div>
        </div>
      </article>
    `).join('');
  }

  function renderRentProperties(properties) {
    if (!rentProperties) return;
    const rentCandidates = properties.filter(property => property.type === 'Apartment' || property.type === 'Villa').slice(0, 4);
    if (!rentCandidates.length) {
      renderEmptyState(rentProperties, 'No rental homes match your filters.');
      return;
    }

    rentProperties.innerHTML = rentCandidates.map(property => `
      <article class="mini-card" data-id="${property.id}" data-action="details">
        <img src="${property.image}" alt="${sanitize(property.name)}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';" />
        <div>
          <h3>${sanitize(property.name)}</h3>
          <p>${sanitize(property.location)} • ${property.bhk} BHK</p>
          <div class="mini-row">
            <strong>${formatCurrency(property.price)}</strong>
            <span>★ ${property.rating}</span>
          </div>
          <div class="mini-actions">
            <button type="button" class="primary-btn tiny" data-id="${property.id}" data-action="details">View Details</button>
          </div>
        </div>
      </article>
    `).join('');
  }

  function propertyCard(property) {
    const isShortlisted = state.shortlist.includes(property.id);
    const isCompared = state.compareList.includes(property.id);

    return `
      <article class="property-card">
        <div class="property-image-wrap">
          <img src="${property.image}" alt="${sanitize(property.name)}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';" />
          <button type="button" class="badge-btn ${isShortlisted ? 'active' : ''}" data-id="${property.id}" data-action="shortlist">${isShortlisted ? 'Shortlisted' : 'Shortlist'}</button>
        </div>

        <div class="property-body">
          <div class="card-row top-row">
            <div>
              <h3>${sanitize(property.name)}</h3>
              <p class="location-line">📍 ${sanitize(property.location)}, ${sanitize(property.city)}</p>
            </div>
            <span class="rating-pill">★ ${property.rating}</span>
          </div>

          <div class="property-price-row">
            <strong>${formatCurrency(property.price)}</strong>
            <span class="availability-tag">${sanitize(property.availability)}</span>
          </div>

          <div class="meta-grid">
            <span>${property.bhk} BHK</span>
            <span>${property.area.toLocaleString()} sq ft</span>
            <span>${sanitize(property.type)}</span>
          </div>

          <div class="amenities-list">
            ${(property.amenities || []).slice(0, 3).map(item => `<span>${sanitize(item)}</span>`).join('')}
          </div>

          <p class="property-desc">${sanitize(property.description)}</p>

          <div class="card-actions">
            <button type="button" class="secondary-btn tiny" data-id="${property.id}" data-action="compare">${isCompared ? 'Compared' : 'Compare'}</button>
            <button type="button" class="primary-btn tiny" data-id="${property.id}" data-action="details">View Details</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderProperties(properties) {
    if (!propertyResults) return;

    if (!properties.length) {
      propertyResults.innerHTML = '<div class="empty-state">No properties found. Try adjusting the search filters or clear them.</div>';
      if (resultsCount) resultsCount.textContent = '0 properties found';
      return;
    }

    if (resultsCount) {
      resultsCount.textContent = `${properties.length} ${properties.length === 1 ? 'property' : 'properties'} found`;
    }
    propertyResults.innerHTML = properties.map(propertyCard).join('');
  }

  function renderShortlist() {
    if (!shortlistList) return;

    if (!state.shortlist.length) {
      shortlistList.innerHTML = '<div class="empty-state">No shortlisted properties yet.</div>';
      return;
    }

    const selected = state.allProperties.filter(item => state.shortlist.includes(item.id));
    shortlistList.innerHTML = selected.map(property => `
      <article class="shortlist-card">
        <img src="${property.image}" alt="${sanitize(property.name)}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';" />
        <div>
          <h3>${sanitize(property.name)}</h3>
          <p>${sanitize(property.location)}</p>
          <strong>${formatCurrency(property.price)}</strong>
          <div class="shortlist-controls">
            <button type="button" class="secondary-btn tiny" data-id="${property.id}" data-action="details">View Details</button>
            <button type="button" class="ghost-btn tiny" data-id="${property.id}" data-action="shortlist">Remove</button>
          </div>
        </div>
      </article>
    `).join('');
  }

  function renderCompare() {
    if (!compareTable) return;

    if (!state.compareList.length) {
      compareTable.innerHTML = '<div class="empty-state">Select up to three properties to compare.</div>';
      return;
    }

    const selected = state.allProperties.filter(item => state.compareList.includes(item.id));
    const comparisonFields = [
      { key: 'Property', value: item => sanitize(item.name) },
      { key: 'Location', value: item => sanitize(item.location) },
      { key: 'Type', value: item => sanitize(item.type) },
      { key: 'BHK', value: item => `${item.bhk} BHK` },
      { key: 'Area', value: item => `${item.area.toLocaleString()} sq ft` },
      { key: 'Price', value: item => formatCurrency(item.price) },
      { key: 'Rating', value: item => `★ ${item.rating}` },
      { key: 'Availability', value: item => sanitize(item.availability) },
      { key: 'Amenities', value: item => (item.amenities || []).join(', ') }
    ];

    const header = `
      <div class="compare-grid compare-header">
        <div>Feature</div>
        ${selected.map(item => `<div><h3>${sanitize(item.name)}</h3><button type="button" class="small-link" data-action="remove-compare" data-id="${item.id}">Remove</button></div>`).join('')}
      </div>
    `;

    const rows = comparisonFields.map(field => {
      const cells = selected.map(item => `<div>${sanitize(field.value(item))}</div>`).join('');
      return `<div class="compare-grid"><div>${field.key}</div>${cells}</div>`;
    }).join('');

    compareTable.innerHTML = header + rows;
  }

  function openPropertyModal(propertyId) {
    const property = state.allProperties.find(item => item.id === propertyId);
    if (!property) {
      console.warn(`Property ${propertyId} not found in dataset.`);
      return;
    }

    const isShortlisted = state.shortlist.includes(property.id);

    modalBody.innerHTML = `
      <div class="modal-hero">
        <img src="${property.image}" alt="${sanitize(property.name)}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';" />
      </div>
      <div class="modal-main">
        <div class="modal-topline">
          <div>
            <span class="mini-tag">${sanitize(property.type)}</span>
            <h2>${sanitize(property.name)}</h2>
          </div>
          <span class="rating-pill">★ ${property.rating}</span>
        </div>

        <div class="modal-meta">
          <span>📍 ${sanitize(property.location)}, ${sanitize(property.city)}</span>
          <span>🛏 ${property.bhk} BHK</span>
          <span>📐 ${property.area.toLocaleString()} sq ft</span>
          <span>📦 ${sanitize(property.availability)}</span>
        </div>

        <div class="modal-price">${formatCurrency(property.price)}</div>

        <p>${sanitize(property.description)}</p>

        <div class="amenities-list large">
          ${(property.amenities || []).map(item => `<span>${sanitize(item)}</span>`).join('')}
        </div>

        <div class="modal-actions">
          <button type="button" class="primary-btn" data-action="contact-owner" data-id="${property.id}">Contact Owner</button>
          <button type="button" class="secondary-btn" data-action="schedule-visit" data-id="${property.id}">Schedule Visit</button>
          <button type="button" class="ghost-btn ${isShortlisted ? 'active' : ''}" data-action="toggle-shortlist-modal" data-id="${property.id}">${isShortlisted ? 'Shortlisted' : 'Shortlist'}</button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('modal-open');
  }

  function showFormMessage(container, message, type) {
    const wrapper = container.querySelector('.form-status');
    if (wrapper) {
      wrapper.className = type === 'success' ? 'form-success' : 'form-error';
      wrapper.textContent = message;
      return;
    }

    const el = document.createElement('div');
    el.className = type === 'success' ? 'form-success' : 'form-error';
    el.textContent = message;
    el.classList.add('form-status');
    container.appendChild(el);
  }

  function renderContactOwnerForm(propertyId) {
    const property = state.allProperties.find(item => item.id === propertyId) || null;
    modalBody.innerHTML = `
      <div class="modal-main">
        <div class="modal-topline">
          <div>
            <span class="mini-tag">Contact owner</span>
            <h2>Ask about ${property ? sanitize(property.name) : 'this property'}</h2>
          </div>
        </div>
        <form class="form-shell" data-form="contact-owner" data-property-id="${propertyId || ''}">
          <label>
            Name
            <input type="text" name="name" placeholder="Your full name" required />
          </label>
          <label>
            Phone
            <input type="tel" name="phone" placeholder="Your phone number" required />
          </label>
          <label>
            Email
            <input type="email" name="email" placeholder="name@example.com" required />
          </label>
          <label>
            Message
            <textarea name="message" placeholder="Tell the owner about your requirement" required></textarea>
          </label>
          <button type="submit" class="primary-btn">Send Message</button>
        </form>
      </div>
    `;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function renderScheduleVisitForm(propertyId) {
    const property = state.allProperties.find(item => item.id === propertyId) || null;
    modalBody.innerHTML = `
      <div class="modal-main">
        <div class="modal-topline">
          <div>
            <span class="mini-tag">Schedule a visit</span>
            <h2>${property ? sanitize(property.name) : 'Book a visit'}</h2>
          </div>
        </div>
        <form class="form-shell" data-form="schedule-visit" data-property-id="${propertyId || ''}">
          <label>
            Name
            <input type="text" name="name" placeholder="Your full name" required />
          </label>
          <label>
            Phone
            <input type="tel" name="phone" placeholder="Your phone number" required />
          </label>
          <label>
            Email
            <input type="email" name="email" placeholder="name@example.com" required />
          </label>
          <label>
            Preferred date
            <input type="date" name="date" required />
          </label>
          <label>
            Preferred time
            <input type="time" name="time" required />
          </label>
          <label>
            Property name
            <input type="text" name="propertyName" value="${property ? sanitize(property.name) : ''}" required />
          </label>
          <button type="submit" class="primary-btn">Submit Visit Request</button>
        </form>
      </div>
    `;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function renderListPropertyForm() {
    modalBody.innerHTML = `
      <div class="modal-main">
        <div class="modal-topline">
          <div>
            <span class="mini-tag">List your property</span>
            <h2>Sell or rent your home</h2>
          </div>
        </div>
        <form class="form-shell" data-form="list-property">
          <label>
            Owner name
            <input type="text" name="ownerName" placeholder="Owner full name" required />
          </label>
          <label>
            Phone
            <input type="tel" name="phone" placeholder="Phone number" required />
          </label>
          <label>
            Email
            <input type="email" name="email" placeholder="Email address" required />
          </label>
          <label>
            Property name
            <input type="text" name="propertyName" placeholder="Your property name" required />
          </label>
          <label>
            Location
            <input type="text" name="location" placeholder="City or area" required />
          </label>
          <label>
            Property type
            <select name="type" required>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
            </select>
          </label>
          <label>
            Price
            <input type="number" name="price" min="0" placeholder="₹ amount" required />
          </label>
          <label>
            BHK
            <select name="bhk" required>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4 BHK</option>
            </select>
          </label>
          <label>
            Area (sq ft)
            <input type="number" name="area" min="0" placeholder="Area in sq ft" required />
          </label>
          <label>
            Amenities
            <input type="text" name="amenities" placeholder="Gym, Pool, Security" required />
          </label>
          <label>
            Description
            <textarea name="description" placeholder="Brief description of the property" required></textarea>
          </label>
          <button type="submit" class="primary-btn">Submit Property</button>
        </form>
      </div>
    `;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function propertyMatchesFilters(property, filters = getFilterState()) {
    const locationValue = (filters.location || '').toLowerCase();
    const typeValue = (filters.type || '').trim();
    const minPrice = Number(filters.minPrice || 0);
    const maxPrice = Number(filters.maxPrice || Number.MAX_SAFE_INTEGER);
    const bhkValue = Number(filters.bhk || 0);
    const minArea = Number(filters.minArea || 0);
    const maxArea = Number(filters.maxArea || Number.MAX_SAFE_INTEGER);
    const amenitiesValue = (filters.amenities || '').toLowerCase().trim();
    const ratingValue = Number(filters.rating || 0);
    const availabilityValue = (filters.availability || '').trim();

    const matchesLocation = !locationValue || `${property.location} ${property.city} ${property.name}`.toLowerCase().includes(locationValue);
    const matchesType = !typeValue || property.type === typeValue;
    const matchesPrice = property.price >= minPrice && property.price <= maxPrice;
    const matchesBhk = !bhkValue || property.bhk === bhkValue;
    const matchesArea = property.area >= minArea && property.area <= maxArea;
    const matchesAmenities = !amenitiesValue || (property.amenities || []).some(item => item.toLowerCase().includes(amenitiesValue));
    const matchesRating = !ratingValue || property.rating >= ratingValue;
    const matchesAvailability = !availabilityValue || property.availability === availabilityValue;

    return matchesLocation && matchesType && matchesPrice && matchesBhk && matchesArea && matchesAmenities && matchesRating && matchesAvailability;
  }

  function applyFilters() {
    const filters = getFilterState();
    saveFilters();

    state.filteredProperties = state.allProperties.filter(property => propertyMatchesFilters(property, filters));
    renderProperties(state.filteredProperties);
    renderFeatured(state.filteredProperties);
    renderRecommended(state.filteredProperties);
    renderRentProperties(state.filteredProperties);
  }

  function clearFilters() {
    if (!searchForm) return;
    searchForm.reset();
    localStorage.removeItem(STORAGE_KEYS.filters);
    state.filteredProperties = [...state.allProperties];
    renderProperties(state.filteredProperties);
    renderFeatured(state.filteredProperties);
    renderRecommended(state.filteredProperties);
    renderRentProperties(state.filteredProperties);
  }

  function toggleShortlist(propertyId) {
    if (!propertyId) return;

    if (state.shortlist.includes(propertyId)) {
      state.shortlist = state.shortlist.filter(item => item !== propertyId);
    } else {
      state.shortlist = [...state.shortlist, propertyId];
    }

    persistArray(STORAGE_KEYS.shortlist, state.shortlist);
    renderShortlist();

    const rowsToRefresh = document.querySelectorAll('[data-action="shortlist"]');
    rowsToRefresh.forEach(button => {
      const isActive = state.shortlist.includes(button.dataset.id);
      button.textContent = isActive ? 'Shortlisted' : 'Shortlist';
      button.classList.toggle('active', isActive);
    });

    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach(card => {
      const button = card.querySelector('[data-action="shortlist"]');
      if (!button) return;
      const propertyIdFromCard = button.dataset.id;
      const isActive = state.shortlist.includes(propertyIdFromCard);
      button.textContent = isActive ? 'Shortlisted' : 'Shortlist';
      button.classList.toggle('active', isActive);
    });

    if (modal && !modal.classList.contains('hidden')) {
      const button = modal.querySelector('[data-action="toggle-shortlist-modal"]');
      if (button) {
        button.textContent = state.shortlist.includes(button.dataset.id) ? 'Shortlisted' : 'Shortlist';
      }
    }
  }

  function toggleCompare(propertyId) {
    if (!propertyId) return;

    if (state.compareList.includes(propertyId)) {
      state.compareList = state.compareList.filter(item => item !== propertyId);
    } else {
      if (state.compareList.length >= 3) {
        setApiStatus('You can compare up to 3 properties.');
        return;
      }
      state.compareList = [...state.compareList, propertyId];
    }

    persistArray(STORAGE_KEYS.compare, state.compareList);
    renderCompare();

    const compareButtons = document.querySelectorAll('[data-action="compare"]');
    compareButtons.forEach(button => {
      const isSelected = state.compareList.includes(button.dataset.id);
      button.textContent = isSelected ? 'Compared' : 'Compare';
    });
  }

  function handleFormSubmit(event) {
    const form = event.target;
    if (!form || !(form instanceof HTMLFormElement)) return;

    if (form.matches('[data-form="contact-owner"]')) {
      event.preventDefault();
      const name = form.querySelector('input[name="name"]').value.trim();
      const phone = form.querySelector('input[name="phone"]').value.trim();
      const email = form.querySelector('input[name="email"]').value.trim();
      const message = form.querySelector('textarea[name="message"]').value.trim();

      if (!name || !phone || !email || !message) {
        showFormMessage(form, 'Please fill in all required fields.', 'error');
        return;
      }

      showFormMessage(form, 'Thanks! Your message has been sent to the property owner.', 'success');
      form.reset();
      return;
    }

    if (form.matches('[data-form="schedule-visit"]')) {
      event.preventDefault();
      const name = form.querySelector('input[name="name"]').value.trim();
      const phone = form.querySelector('input[name="phone"]').value.trim();
      const email = form.querySelector('input[name="email"]').value.trim();
      const date = form.querySelector('input[name="date"]').value;
      const time = form.querySelector('input[name="time"]').value;
      const propertyName = form.querySelector('input[name="propertyName"]').value.trim();

      if (!name || !phone || !email || !date || !time || !propertyName) {
        showFormMessage(form, 'Please complete all visit details before submitting.', 'error');
        return;
      }

      showFormMessage(form, 'Visit request submitted successfully. Our property advisor will contact you shortly.', 'success');
      form.reset();
      return;
    }

    if (form.matches('[data-form="list-property"]')) {
      event.preventDefault();
      const requiredFields = ['ownerName', 'phone', 'email', 'propertyName', 'location', 'price', 'bhk', 'area', 'amenities', 'description'];
      const missing = requiredFields.some(field => !form.elements[field]?.value.trim());

      if (missing) {
        showFormMessage(form, 'Please complete the listing form in full.', 'error');
        return;
      }

      const listing = {
        id: `LIST-${Date.now()}`,
        ownerName: form.elements.ownerName.value.trim(),
        phone: form.elements.phone.value.trim(),
        email: form.elements.email.value.trim(),
        propertyName: form.elements.propertyName.value.trim(),
        location: form.elements.location.value.trim(),
        type: form.elements.type.value,
        price: Number(form.elements.price.value),
        bhk: Number(form.elements.bhk.value),
        area: Number(form.elements.area.value),
        amenities: form.elements.amenities.value.split(',').map(item => item.trim()).filter(Boolean),
        description: form.elements.description.value.trim(),
        submittedAt: new Date().toISOString()
      };

      try {
        const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.listings) || '[]');
        existing.push(listing);
        localStorage.setItem(STORAGE_KEYS.listings, JSON.stringify(existing));
        showFormMessage(form, 'Property submitted successfully.', 'success');
        form.reset();
      } catch (error) {
        console.error('Unable to save property listing:', error);
        showFormMessage(form, 'There was a problem storing the listing. Please try again.', 'error');
      }
    }
  }

  function loadProperties() {
    fetch('/api/properties')
      .then(async response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const properties = Array.isArray(data.properties) ? data.properties : [];
        state.allProperties = properties;
        state.filteredProperties = [...properties];
        if (totalProperties) totalProperties.textContent = String(properties.length);
        renderFeatured(properties);
        renderRecommended(properties);
        renderRentProperties(properties);
        renderProperties(properties);
        renderShortlist();
        renderCompare();
        restoreFilters();
      })
      .catch(error => {
        console.error('Unable to load properties. Please make sure the Property Finder server is running.', error);
        setApiStatus('Unable to load properties. Please make sure the Property Finder server is running.');
        state.allProperties = [];
        state.filteredProperties = [];
        if (totalProperties) totalProperties.textContent = '0';
        renderFeatured([]);
        renderRecommended([]);
        renderRentProperties([]);
        renderProperties([]);
        renderShortlist();
        renderCompare();
      });
  }

  if (closeModalButton) {
    closeModalButton.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', event => {
      if (event.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  document.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const { action, id, target: targetSelector } = button.dataset;

    if (action === 'scroll') {
      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    if (action === 'clear-filters') {
      clearFilters();
      return;
    }

    if (action === 'book-tour') {
      const property = state.allProperties[0];
      if (property) openPropertyModal(property.id);
      return;
    }

    if (action === 'book-visit') {
      const property = state.allProperties[0];
      renderScheduleVisitForm(property ? property.id : '');
      return;
    }

    if (action === 'list-property') {
      renderListPropertyForm();
      return;
    }

    if (action === 'toggle-technical') {
      const panel = document.getElementById('technicalPanel');
      if (panel) panel.classList.toggle('hidden');
      button.textContent = panel && !panel.classList.contains('hidden') ? 'Hide details' : 'Show details';
      return;
    }

    if (action === 'details') {
      if (id) openPropertyModal(id);
      return;
    }

    if (action === 'shortlist') {
      toggleShortlist(id);
      return;
    }

    if (action === 'compare') {
      toggleCompare(id);
      return;
    }

    if (action === 'remove-compare') {
      toggleCompare(id);
      return;
    }

    if (action === 'toggle-shortlist-modal') {
      toggleShortlist(id);
      const property = state.allProperties.find(item => item.id === id);
      if (property) openPropertyModal(property.id);
      return;
    }

    if (action === 'contact-owner') {
      renderContactOwnerForm(id || '');
      return;
    }

    if (action === 'schedule-visit') {
      renderScheduleVisitForm(id || '');
      return;
    }
  });

  if (searchForm) {
    searchForm.addEventListener('submit', event => {
      event.preventDefault();
      applyFilters();
    });
  }

  document.addEventListener('submit', handleFormSubmit);

  restoreFilters();
  loadProperties();
});
