document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('adminLoginForm');
  const message = document.getElementById('loginMessage');

  try {
    const response = await fetch('/api/admin/session');
    const session = await response.json();
    if (session.authenticated) {
      window.location.replace('/admin/dashboard');
      return;
    }
  } catch (error) {
    showMessage('Unable to check the admin session. Please try again.', true);
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: form.elements.password.value })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Login failed.');
      window.location.assign('/admin/dashboard');
    } catch (error) {
      showMessage(error.message || 'Unable to log in. Please try again.', true);
    } finally {
      button.disabled = false;
    }
  });

  function showMessage(text, isError) {
    message.textContent = text;
    message.className = `form-status ${isError ? 'form-error' : 'form-success'}`;
  }
});
