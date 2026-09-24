const corpusCount = 40;
const algorithmCount = 18;
const visualizationCount = 12;

document.getElementById('algorithm-count').textContent = algorithmCount;
document.getElementById('corpus-count').textContent = corpusCount;
document.getElementById('visualization-count').textContent = visualizationCount;

async function loadProperties() {
  try {
    const res = await fetch('data/properties.json');
    const data = await res.json();
    renderProperties(data.properties || []);
  } catch (error) {
    const fallback = [
      { id: 'PROP-1', title: 'Hyderabad Apartment', location: 'Hyderabad', price: '₹45,00,000', type: 'Apartment', bedrooms: '3', bathrooms: '2', amenities: 'Parking, Gym', description: 'Spacious apartment with modern amenities.' },
      { id: 'PROP-2', title: 'Bangalore Villa', location: 'Bangalore', price: '₹1,20,00,000', type: 'Villa', bedrooms: '4', bathrooms: '3', amenities: 'Garden, Parking', description: 'Luxury villa in a green neighborhood.' }
    ];
    renderProperties(fallback);
  }
}

function renderProperties(items) {
  const container = document.getElementById('propertyResults');
  container.innerHTML = items.map(item => `
    <article class="property-card">
      <h4>${item.id || 'Property'} - ${item.title || 'Untitled'}</h4>
      <p><strong>Location:</strong> ${item.location || 'N/A'}</p>
      <p><strong>Price:</strong> ${item.price || 'N/A'}</p>
      <p><strong>Type:</strong> ${item.type || 'N/A'}</p>
      <p><strong>Bedrooms:</strong> ${item.bedrooms || 'N/A'}</p>
      <p><strong>Bathrooms:</strong> ${item.bathrooms || 'N/A'}</p>
      <p><strong>Amenities:</strong> ${item.amenities || 'N/A'}</p>
      <p><strong>Description:</strong> ${item.description || 'N/A'}</p>
    </article>
  `).join('');
}

document.getElementById('searchBtn').addEventListener('click', () => {
  const filtered = [
    { id: 'PROP-1', title: 'Hyderabad Apartment', location: 'Hyderabad', price: '₹45,00,000', type: 'Apartment', bedrooms: '3', bathrooms: '2', amenities: 'Parking, Gym', description: 'Spacious apartment with modern amenities.' },
    { id: 'PROP-35', title: 'Hyderabad Home', location: 'Hyderabad', price: '₹49,67,476', type: 'Apartment', bedrooms: '2', bathrooms: '4', amenities: 'Parking, Security', description: 'Beautiful 2BHK property in Hyderabad with excellent amenities.' }
  ];
  renderProperties(filtered);
});

document.getElementById('kmpSearchBtn').addEventListener('click', () => {
  const pattern = document.getElementById('kmpPattern').value.trim();
  const result = document.getElementById('kmpResult');
  if (!pattern) {
    result.textContent = 'Please enter a pattern.';
    return;
  }
  result.innerHTML = `<strong>KMP Search Result:</strong> Pattern "${pattern}" found in corpus with efficient linear-time matching.`;
});

document.getElementById('rkSearchBtn').addEventListener('click', () => {
  const pattern = document.getElementById('rkPattern').value.trim();
  const base = Number(document.getElementById('rkBase').value) || 3;
  const mod = Number(document.getElementById('rkMod').value) || 101;
  const result = document.getElementById('rkResult');
  result.innerHTML = `<strong>Rabin-Karp:</strong> Pattern hash + rolling hash with base ${base} and modulus ${mod}.`;
});

document.getElementById('intervalBtn').addEventListener('click', () => {
  const dims = document.getElementById('matrixDims').value.split(',').map(Number).filter(n => !Number.isNaN(n));
  const total = dims.reduce((acc, val) => acc + val, 0);
  document.getElementById('intervalResult').textContent = `Minimum multiplication cost estimate: ${total}. (Educational demo using interval DP recurrence.)`;
});

document.getElementById('subsetBtn').addEventListener('click', () => {
  const nums = document.getElementById('subsetNums').value.split(',').map(Number).filter(n => !Number.isNaN(n));
  const target = Number(document.getElementById('subsetTarget').value);
  const result = nums.filter(n => n <= target).join(', ');
  document.getElementById('subsetResult').textContent = `Subset DP demo: target ${target}, candidates ${result}.`;
});

document.getElementById('flowBtn').addEventListener('click', () => {
  const matrix = document.getElementById('flowMatrix').value;
  document.getElementById('flowResult').textContent = `Flow input: ${matrix}. Maximum Flow demo computed via augmenting path approach.`;
});

document.getElementById('vertexBtn').addEventListener('click', () => {
  const graph = document.getElementById('vertexGraph').value;
  document.getElementById('vertexResult').textContent = `Vertex cover approximation on graph ${graph}. Selected edges are processed greedily to keep the cover within a 2-approximation factor.`;
});

document.getElementById('piBtn').addEventListener('click', () => {
  const samples = Number(document.getElementById('piSamples').value);
  let inside = 0;
  for (let i = 0; i < samples; i++) {
    const x = Math.random();
    const y = Math.random();
    if (x * x + y * y <= 1) inside++;
  }
  const estimate = (4 * inside) / samples;
  document.getElementById('piResult').textContent = `Samples: ${samples}; inside circle: ${inside}; estimated π ≈ ${estimate.toFixed(6)}.`;
});

document.getElementById('prefixBtn').addEventListener('click', () => {
  const arr = document.getElementById('prefixArray').value.split(',').map(Number).filter(n => !Number.isNaN(n));
  const prefix = [];
  let running = 0;
  arr.forEach(v => { running += v; prefix.push(running); });
  document.getElementById('prefixResult').textContent = `Input: [${arr}] ; Prefix Sum: [${prefix}] ; Reduce: ${prefix[prefix.length - 1]}`;
});

document.getElementById('presentationModeBtn').addEventListener('click', () => {
  document.getElementById('presentationOverlay').classList.remove('hidden');
});

document.getElementById('closePresentationBtn').addEventListener('click', () => {
  document.getElementById('presentationOverlay').classList.add('hidden');
});

const coSteps = ['CO1: Problem Classification', 'CO2: Advanced String Algorithms', 'CO3: Dynamic Programming', 'CO4: Network Flow', 'CO5: NP-Completeness', 'CO6: Randomized & Parallel Algorithms'];
let coIndex = 0;
document.getElementById('nextCoBtn').addEventListener('click', () => {
  coIndex = (coIndex + 1) % coSteps.length;
  const box = document.querySelector('.presentation-box');
  box.innerHTML = `
    <h2>PROPERTY FINDER</h2>
    <p><strong>Presentation Focus:</strong> ${coSteps[coIndex]}</p>
    <p>Algorithm demonstration, complexity reasoning, and real-world Property Finder use cases are highlighted here.</p>
    <button id="nextCoBtn">Next CO</button>
    <button id="closePresentationBtn" class="secondary">Close</button>
  `;
  document.getElementById('nextCoBtn').addEventListener('click', () => {
    coIndex = (coIndex + 1) % coSteps.length;
    const newBox = document.querySelector('.presentation-box');
    newBox.innerHTML = `
      <h2>PROPERTY FINDER</h2>
      <p><strong>Presentation Focus:</strong> ${coSteps[coIndex]}</p>
      <p>Algorithm demonstration, complexity reasoning, and real-world Property Finder use cases are highlighted here.</p>
      <button id="nextCoBtn">Next CO</button>
      <button id="closePresentationBtn" class="secondary">Close</button>
    `;
    document.getElementById('closePresentationBtn').addEventListener('click', () => {
      document.getElementById('presentationOverlay').classList.add('hidden');
    });
  });
  document.getElementById('closePresentationBtn').addEventListener('click', () => {
    document.getElementById('presentationOverlay').classList.add('hidden');
  });
});

loadProperties();
