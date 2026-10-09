const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const CORPUS_DIR = path.join(__dirname, '..', 'corpus');
const SUBMISSIONS_FILE = path.join(__dirname, 'data', 'submissions.json');
const ADMIN_PASSWORD = '5566';
const SESSION_COOKIE = 'pf_admin_session';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const sessions = new Map();
const fallbackImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';

app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));

function parseCorpusProperty(fileName) {
  const contents = fs.readFileSync(path.join(CORPUS_DIR, fileName), 'utf8');
  const fields = {};
  contents.split(/\r?\n/).forEach(line => {
    const separator = line.indexOf(':');
    if (separator < 0) return;
    fields[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  });

  const id = fields['Property ID'];
  const location = fields.Location;
  const bedrooms = Number(fields.Bedrooms || (fields['BHK Type'] || '').match(/\d+/)?.[0]);
  const priceText = fields.Price || '0';
  const price = Number(priceText.replace(/[^\d.-]/g, ''));
  const features = (fields.Features || '').split(',').map(item => item.trim()).filter(Boolean);

  return {
    id,
    name: fields['Property Name'] || fields.Title || `${bedrooms || ''} BHK in ${location || 'Unknown location'}`.trim(),
    location: location || 'Unknown location',
    city: fields.City || '',
    price: Number.isFinite(price) ? price : 0,
    currency: priceText.includes('$') ? 'USD' : 'INR',
    bhk: Number.isFinite(bedrooms) ? bedrooms : 0,
    bedrooms: Number.isFinite(bedrooms) ? bedrooms : 0,
    bathrooms: Number(fields.Bathrooms) || 0,
    area: Number(fields['Square Feet']) || 0,
    type: fields['Property Type'] || 'Apartment',
    amenities: (fields.Amenities || '').split(',').map(item => item.trim()).filter(Boolean).length
      ? fields.Amenities.split(',').map(item => item.trim()).filter(Boolean)
      : features,
    features,
    description: fields.Description || '',
    image: fields.Image || fallbackImage,
    rating: Number(fields.Rating) || 0,
    availability: fields.Status || 'Available',
    yearBuilt: Number(fields['Year Built']) || null,
    contact: fields.Contact || '',
    nearbySchools: fields['Nearby Schools'] || '',
    shopping: fields.Shopping || '',
    transportation: fields.Transportation || '',
    status: 'Approved',
    source: 'corpus'
  };
}

function getCorpusProperties() {
  return fs.readdirSync(CORPUS_DIR)
    .filter(fileName => /^property\d+\.txt$/i.test(fileName))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))
    .map(parseCorpusProperty);
}

function readSubmissions() {
  try {
    const submissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf8'));
    if (!Array.isArray(submissions)) throw new Error('Property submissions must be a JSON array.');
    return submissions;
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

function saveSubmissions(submissions) {
  const temporaryFile = `${SUBMISSIONS_FILE}.tmp`;
  fs.writeFileSync(temporaryFile, `${JSON.stringify(submissions, null, 2)}\n`, 'utf8');
  fs.renameSync(temporaryFile, SUBMISSIONS_FILE);
}

function allProperties() {
  return [...getCorpusProperties(), ...readSubmissions().filter(property => property.status === 'Approved')];
}

function publicProperty(property) {
  const { ownerName, phone, contact, ...listing } = property;
  return listing;
}

function sessionToken(req) {
  const cookieHeader = req.headers.cookie || '';
  const entry = cookieHeader.split(';').map(cookie => cookie.trim()).find(cookie => cookie.startsWith(`${SESSION_COOKIE}=`));
  return entry ? decodeURIComponent(entry.slice(SESSION_COOKIE.length + 1)) : '';
}

function isAdmin(req) {
  const token = sessionToken(req);
  const expiresAt = sessions.get(token);
  if (!expiresAt) return false;
  if (expiresAt <= Date.now()) {
    sessions.delete(token);
    return false;
  }
  return true;
}

function requireAdmin(req, res, next) {
  if (!isAdmin(req)) return res.status(401).json({ message: 'Administrator authentication required.' });
  next();
}

function textField(value, label, maxLength) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) {
    throw new Error(`${label} is required and must be at most ${maxLength} characters.`);
  }
  return value.trim();
}

function numberField(value, label, { integer = false, maximum = Number.MAX_SAFE_INTEGER } = {}) {
  const text = typeof value === 'number' ? String(value) : typeof value === 'string' ? value.trim() : '';
  if (!/^\d+(?:\.\d+)?$/.test(text)) {
    throw new Error(`${label} must be a valid positive number.`);
  }
  const number = Number(text);
  if (!Number.isFinite(number) || number <= 0 || number > maximum || (integer && !Number.isSafeInteger(number))) {
    throw new Error(`${label} must be a valid positive ${integer ? 'whole number' : 'number'}.`);
  }
  return number;
}

function validateSubmission(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new Error('A valid property submission is required.');
  }

  const phone = textField(body.phone, 'Contact number', 30);
  if (!/^\+?[0-9][0-9\s().-]{6,19}$/.test(phone)) {
    throw new Error('Enter a valid contact number.');
  }

  const image = body.image ? textField(body.image, 'Image URL', 2048) : '';
  if (image) {
    let parsedImage;
    try {
      parsedImage = new URL(image);
    } catch {
      throw new Error('Image must be a valid http or https URL.');
    }
    if (!['http:', 'https:'].includes(parsedImage.protocol)) {
      throw new Error('Image must be a valid http or https URL.');
    }
  }

  const amenities = Array.isArray(body.amenities)
    ? body.amenities
    : String(body.amenities || '').split(',');
  const normalizedAmenities = amenities
    .map(item => String(item).trim())
    .filter(Boolean)
    .slice(0, 30);

  return {
    id: `USER-${crypto.randomUUID()}`,
    name: textField(body.name, 'Property title', 120),
    ownerName: textField(body.ownerName, 'Owner name', 100),
    phone,
    location: textField(body.location, 'Location', 160),
    city: typeof body.city === 'string' ? body.city.trim().slice(0, 100) : '',
    type: textField(body.type, 'Property type', 40),
    price: numberField(body.price, 'Price', { maximum: 1e15 }),
    currency: 'INR',
    bhk: numberField(body.bedrooms, 'Bedrooms', { integer: true, maximum: 30 }),
    bedrooms: numberField(body.bedrooms, 'Bedrooms', { integer: true, maximum: 30 }),
    bathrooms: numberField(body.bathrooms, 'Bathrooms', { maximum: 30 }),
    area: numberField(body.area, 'Area', { maximum: 10000000 }),
    amenities: normalizedAmenities,
    description: textField(body.description, 'Description', 3000),
    image: image || fallbackImage,
    rating: 0,
    availability: 'New Listing',
    status: 'Pending',
    source: 'user',
    submittedAt: new Date().toISOString()
  };
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

app.get('/admin/dashboard', (req, res) => {
  if (!isAdmin(req)) return res.redirect('/admin/login');
  res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

app.get('/api/properties', (req, res) => {
  const properties = allProperties();
  res.json({
    total: properties.length,
    properties: properties.map(property => ({
      ...publicProperty(property),
      priceLabel: `${property.currency === 'USD' ? '$' : '₹'}${property.price.toLocaleString(property.currency === 'USD' ? 'en-US' : 'en-IN')}`
    }))
  });
});

app.get('/api/properties/:id', (req, res) => {
  const property = allProperties().find(item => item.id === req.params.id);
  if (!property) return res.status(404).json({ message: 'Property not found.' });
  res.json(publicProperty(property));
});

app.post('/api/properties', (req, res) => {
  let property;
  try {
    property = validateSubmission(req.body);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  const submissions = readSubmissions();
  submissions.push(property);
  saveSubmissions(submissions);
  res.status(201).json({
    message: 'Property submitted successfully and is waiting for admin approval.',
    property
  });
});

app.get('/api/admin/session', (req, res) => {
  res.json({ authenticated: isAdmin(req) });
});

app.post('/api/admin/login', (req, res) => {
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const expected = Buffer.from(ADMIN_PASSWORD);
  const received = Buffer.from(password);
  const valid = expected.length === received.length && crypto.timingSafeEqual(expected, received);
  if (!valid) return res.status(401).json({ message: 'Incorrect admin password.' });

  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, Date.now() + SESSION_TTL_MS);
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_MS / 1000}`);
  res.json({ authenticated: true });
});

app.post('/api/admin/logout', requireAdmin, (req, res) => {
  sessions.delete(sessionToken(req));
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`);
  res.json({ authenticated: false });
});

app.get('/api/admin/properties', requireAdmin, (req, res) => {
  res.json({ properties: readSubmissions() });
});

app.patch('/api/admin/properties/:id/status', requireAdmin, (req, res) => {
  const status = req.body?.status;
  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Status must be Approved or Rejected.' });
  }

  const submissions = readSubmissions();
  const property = submissions.find(item => item.id === req.params.id);
  if (!property) return res.status(404).json({ message: 'Submitted property not found.' });

  property.status = status;
  property.reviewedAt = new Date().toISOString();
  saveSubmissions(submissions);
  res.json({
    message: status === 'Approved' ? 'Property approved successfully.' : 'Property rejected successfully.',
    property
  });
});

app.delete('/api/admin/properties/:id', requireAdmin, (req, res) => {
  const submissions = readSubmissions();
  const remaining = submissions.filter(item => item.id !== req.params.id);
  if (remaining.length === submissions.length) return res.status(404).json({ message: 'Submitted property not found.' });
  saveSubmissions(remaining);
  res.json({ message: 'Property deleted successfully.' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Property Finder website running at http://localhost:${PORT}`);
});
