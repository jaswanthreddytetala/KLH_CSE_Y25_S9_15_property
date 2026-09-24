document.addEventListener('DOMContentLoaded', () => {
  const propertyResults = document.getElementById('propertyResults');
  const featuredProperties = document.getElementById('featuredProperties');
  const recommendedProperties = document.getElementById('recommendedProperties');
  const shortlistList = document.getElementById('shortlistList');
  const compareTable = document.getElementById('compareTable');
  const resultsCount = document.getElementById('resultsCount');
  const totalProperties = document.getElementById('totalProperties');
  const modal = document.getElementById('propertyModal');
  const modalBody = document.getElementById('modalBody');
  const searchForm = document.getElementById('searchForm');
  const searchButton = searchForm ? searchForm.querySelector('button[type="submit"]') : null;

  let allProperties = [];
  let shortlist = [];
  let compareList = [];

  function formatCurrency(value) {
    return `₹${Number(value).toLocaleString('en-IN')}`;
  }

  function sanitize(text) {
    return String(text || '').replace(/[<>]/g, '');
  }

  function renderFeatured(properties) {
    const featured = properties.slice(0, 3);
    featuredProperties.innerHTML = featured.map(property => `
      <article class="feature-card">
        <img src="${property.image}" alt="${sanitize(property.name)}" />
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
            <button class="small-link" data-id="${property.id}" data-action="details">View Details</button>
          </div>
        </div>
      </article>
    `).join('');
  }

  function renderRecommended(properties) {
    const recommended = properties.slice(0, 4);
    recommendedProperties.innerHTML = recommended.map(property => `
      <article class="mini-card">
        <img src="${property.image}" alt="${sanitize(property.name)}" />
        <div>
          <h3>${sanitize(property.name)}</h3>
          <p>${sanitize(property.location)} • ${property.bhk} BHK</p>
          <div class="mini-row">
            <strong>${formatCurrency(property.price)}</strong>
            <span>★ ${property.rating}</span>
          </div>
        </div>
      </article>
    `).join('');
  }

  function propertyCard(property) {
    const isShortlisted = shortlist.includes(property.id);
    const isCompared = compareList.includes(property.id);

    return `
      <article class="property-card">
        <div class="property-image-wrap">
          <img src="${property.image}" alt="${sanitize(property.name)}" />
          <button class="badge-btn ${isShortlisted ? 'active' : ''}" data-id="${property.id}" data-action="shortlist">${isShortlisted ? 'Shortlisted' : 'Shortlist'}</button>
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
            <button class="secondary-btn tiny" data-id="${property.id}" data-action="compare">${isCompared ? 'Compared' : 'Compare'}</button>
            <button class="primary-btn tiny" data-id="${property.id}" data-action="details">View Details</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderProperties(properties) {
    resultsCount.textContent = `${properties.length} properties found`;
    propertyResults.innerHTML = properties.map(propertyCard).join('');
  }

  function renderShortlist() {
    if (!shortlist.length) {
      shortlistList.innerHTML = '<div class="empty-state">No shortlisted properties yet.</div>';
      return;
    }

    const selected = allProperties.filter(item => shortlist.includes(item.id));
    shortlistList.innerHTML = selected.map(property => `
      <article class="shortlist-card">
        <img src="${property.image}" alt="${sanitize(property.name)}" />
        <div>
          <h3>${sanitize(property.name)}</h3>
          <p>${sanitize(property.location)}</p>
          <strong>${formatCurrency(property.price)}</strong>
        </div>
      </article>
    `).join('');
  }

  function renderCompare() {
    if (!compareList.length) {
      compareTable.innerHTML = '<div class="empty-state">Select up to three properties to compare.</div>';
      return;
    }

    const selected = allProperties.filter(item => compareList.includes(item.id));
    const comparisonFields = ['Location', 'Type', 'BHK', 'Area', 'Price', 'Rating'];

    const header = `<div class="compare-grid compare-header">${selected.map(item => `<div><h3>${sanitize(item.name)}</h3></div>`).join('')}</div>`;
    const rows = comparisonFields.map(field => {
      const values = selected.map(item => {
        if (field === 'Location') return sanitize(item.location);
        if (field === 'Type') return sanitize(item.type);
        if (field === 'BHK') return `${item.bhk} BHK`;
        if (field === 'Area') return `${item.area.toLocaleString()} sq ft`;
        if (field === 'Price') return formatCurrency(item.price);
        if (field === 'Rating') return `★ ${item.rating}`;
        return '';
      });
      return `<div class="compare-grid"><div>${field}</div>${values.map(value => `<div>${value}</div>`).join('')}</div>`;
    }).join('');

    compareTable.innerHTML = header + rows;
  }

  function openPropertyModal(propertyId) {
    const property = allProperties.find(item => item.id === propertyId);
    if (!property) return;

    modalBody.innerHTML = `
      <div class="modal-hero">
        <img src="${property.image}" alt="${sanitize(property.name)}" />
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
          <button class="primary-btn">Contact Owner</button>
          <button class="secondary-btn">Schedule Visit</button>
          <button class="ghost-btn">Shortlist</button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  document.getElementById('closeModal').addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const { action, id, target: targetId } = button.dataset;

    if (action === 'scroll' && targetId) {
      const section = document.querySelector(targetId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    if (action === 'open-first-property') {
      if (allProperties.length) {
        openPropertyModal(allProperties[0].id);
      }
      return;
    }

    if (action === 'toggle-technical') {
      const panel = document.getElementById('technicalPanel');
      if (panel) {
        panel.classList.toggle('hidden');
      }
      return;
    }

    if (action === 'contact-owner') {
      window.alert('Owner contact details can be shared after scheduling a visit.');
      return;
    }

    if (action === 'schedule-visit') {
      window.alert('Visit request sent. A property advisor will contact you shortly.');
      return;
    }

    if (action === 'shortlist-modal') {
      const selectedProperty = allProperties[0];
      if (selectedProperty) {
        if (shortlist.includes(selectedProperty.id)) {
          shortlist = shortlist.filter(item => item !== selectedProperty.id);
        } else {
          shortlist.push(selectedProperty.id);
        }
        renderShortlist();
      }
      return;
    }

    if (action === 'details') {
      openPropertyModal(id);
      return;
    }

    if (action === 'shortlist') {
      if (shortlist.includes(id)) {
        shortlist = shortlist.filter(item => item !== id);
      } else {
        shortlist.push(id);
      }
      renderShortlist();
      renderProperties(allProperties.filter(property => propertyMatchesFilters(property)));
      renderFeatured(allProperties.filter(property => propertyMatchesFilters(property)));
      return;
    }

    if (action === 'compare') {
      if (compareList.includes(id)) {
        compareList = compareList.filter(item => item !== id);
      } else if (compareList.length < 3) {
        compareList.push(id);
      }
      renderCompare();
      renderProperties(allProperties.filter(property => propertyMatchesFilters(property)));
    }
  });

  function propertyMatchesFilters(property) {
    const locationValue = document.getElementById('locationInput').value.trim().toLowerCase();
    const typeValue = document.getElementById('typeInput').value.trim();
    const minPrice = Number(document.getElementById('minPriceInput').value || 0);
    const maxPrice = Number(document.getElementById('maxPriceInput').value || Number.MAX_SAFE_INTEGER);
    const bhkValue = Number(document.getElementById('bhkInput').value || 0);
    const minArea = Number(document.getElementById('minAreaInput').value || 0);
    const maxArea = Number(document.getElementById('maxAreaInput').value || Number.MAX_SAFE_INTEGER);
    const amenitiesValue = document.getElementById('amenitiesInput').value.trim().toLowerCase();
    const ratingValue = Number(document.getElementById('ratingInput').value || 0);
    const availabilityValue = document.getElementById('availabilityInput').value.trim();

    const matchesLocation = !locationValue || `${property.location} ${property.city}`.toLowerCase().includes(locationValue) || property.name.toLowerCase().includes(locationValue);
    const matchesType = !typeValue || property.type === typeValue;
    const matchesPrice = property.price >= minPrice && property.price <= maxPrice;
    const matchesBhk = !bhkValue || property.bhk >= bhkValue;
    const matchesArea = property.area >= minArea && property.area <= maxArea;
    const matchesAmenities = !amenitiesValue || property.amenities.some(item => item.toLowerCase().includes(amenitiesValue));
    const matchesRating = !ratingValue || property.rating >= ratingValue;
    const matchesAvailability = !availabilityValue || property.availability === availabilityValue;

    return matchesLocation && matchesType && matchesPrice && matchesBhk && matchesArea && matchesAmenities && matchesRating && matchesAvailability;
  }

  function applyFilters() {
    const filtered = allProperties.filter(propertyMatchesFilters);
    renderProperties(filtered);
    renderFeatured(filtered);
    renderRecommended(filtered);
  }

  if (searchForm) {
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      applyFilters();
    });

    if (searchButton) {
      searchButton.addEventListener('click', (event) => {
        event.preventDefault();
        applyFilters();
      });
    }
  }

  fetch('/api/properties')
    .then(response => response.json())
    .then(data => {
      allProperties = data.properties || [];
      totalProperties.textContent = allProperties.length;
      renderFeatured(allProperties);
      renderRecommended(allProperties);
      renderProperties(allProperties);
      renderShortlist();
      renderCompare();
    })
    .catch(() => {
      allProperties = [];
      totalProperties.textContent = '0';
      renderProperties([]);
      renderFeatured([]);
      renderRecommended([]);
      renderShortlist();
      renderCompare();
    });
});
