document.addEventListener('DOMContentLoaded', () => {
  const buckets = {
    Pending: document.getElementById('pendingProperties'),
    Approved: document.getElementById('approvedProperties'),
    Rejected: document.getElementById('rejectedProperties')
  };
  const counts = {
    Pending: document.getElementById('pendingCount'),
    Approved: document.getElementById('approvedCount'),
    Rejected: document.getElementById('rejectedCount')
  };
  const message = document.getElementById('adminMessage');

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  }

  function currency(property) {
    const symbol = property.currency === 'USD' ? '$' : '₹';
    return `${symbol}${Number(property.price).toLocaleString(property.currency === 'USD' ? 'en-US' : 'en-IN')}`;
  }

  function showMessage(text, isError = false) {
    message.textContent = text;
    message.classList.toggle('error', isError);
    message.classList.remove('hidden');
  }

  async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
    });
    const result = await response.json();
    if (response.status === 401) {
      window.location.replace('/admin/login');
      throw new Error('Admin session expired. Please sign in again.');
    }
    if (!response.ok) throw new Error(result.message || 'The request could not be completed.');
    return result;
  }

  function renderCard(property) {
    const amenities = Array.isArray(property.amenities) ? property.amenities.join(', ') : '';
    const local = [property.location, property.city && property.city !== property.location ? property.city : ''].filter(Boolean).join(', ');
    const buttons = property.status === 'Pending'
      ? `<button class="primary-btn tiny" data-status="Approved" data-id="${escapeHtml(property.id)}">Approve</button>
         <button class="ghost-btn tiny reject-action" data-status="Rejected" data-id="${escapeHtml(property.id)}">Reject</button>
         <button class="ghost-btn tiny delete-action" data-delete="${escapeHtml(property.id)}">Delete</button>`
      : property.status === 'Approved'
        ? `<button class="ghost-btn tiny reject-action" data-status="Rejected" data-id="${escapeHtml(property.id)}">Unpublish</button>
           <button class="ghost-btn tiny delete-action" data-delete="${escapeHtml(property.id)}">Delete</button>`
        : `<button class="primary-btn tiny" data-status="Approved" data-id="${escapeHtml(property.id)}">Approve</button>
           <button class="ghost-btn tiny delete-action" data-delete="${escapeHtml(property.id)}">Delete</button>`;

    return `<article class="admin-property-card">
      <div class="panel-title-row">
        <span class="mini-tag">${escapeHtml(property.status)}</span>
        <span class="availability-tag">${escapeHtml(property.type)}</span>
      </div>
      <h3>${escapeHtml(property.name)}</h3>
      <p>${escapeHtml(local)} · ${currency(property)}</p>
      <div class="admin-property-meta">
        <span>${escapeHtml(property.bedrooms)} bedrooms</span>
        <span>${escapeHtml(property.bathrooms)} bathrooms</span>
        <span>${escapeHtml(property.area)} sq ft</span>
      </div>
      <details>
        <summary>View Details</summary>
        ${property.image ? `<img class="admin-property-image" src="${escapeHtml(property.image)}" alt="${escapeHtml(property.name)}" loading="lazy" decoding="async" />` : ''}
        <p>${escapeHtml(property.description)}</p>
        <p><strong>Owner:</strong> ${escapeHtml(property.ownerName)} · ${escapeHtml(property.phone)}</p>
        <p><strong>Amenities:</strong> ${escapeHtml(amenities || 'Not specified')}</p>
        <p><strong>Submitted:</strong> ${escapeHtml(property.submittedAt)}</p>
      </details>
      <div class="admin-card-actions">${buttons}</div>
    </article>`;
  }

  async function loadProperties() {
    try {
      const result = await apiRequest('/api/admin/properties');
      Object.keys(buckets).forEach(status => {
        const properties = result.properties.filter(property => property.status === status);
        counts[status].textContent = String(properties.length);
        buckets[status].innerHTML = properties.length
          ? properties.map(renderCard).join('')
          : '<div class="empty-state">No properties in this section.</div>';
      });
    } catch (error) {
      showMessage(error.message || 'Unable to load property submissions.', true);
    }
  }

  document.addEventListener('click', async event => {
    const button = event.target.closest('button[data-status], button[data-delete]');
    if (!button) return;

    button.disabled = true;
    try {
      if (button.dataset.status) {
        const result = await apiRequest(`/api/admin/properties/${encodeURIComponent(button.dataset.id)}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: button.dataset.status })
        });
        showMessage(result.message);
      } else {
        if (!window.confirm('Delete this submitted property permanently?')) return;
        const result = await apiRequest(`/api/admin/properties/${encodeURIComponent(button.dataset.delete)}`, { method: 'DELETE' });
        showMessage(result.message);
      }
      await loadProperties();
    } catch (error) {
      showMessage(error.message || 'Unable to update this property.', true);
    } finally {
      button.disabled = false;
    }
  });

  document.getElementById('adminLogout').addEventListener('click', async () => {
    try {
      await apiRequest('/api/admin/logout', { method: 'POST' });
      window.location.replace('/admin/login');
    } catch (error) {
      showMessage(error.message || 'Unable to log out.', true);
    }
  });

  loadProperties();
});
