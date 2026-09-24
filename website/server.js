const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const properties = [
  {
    id: 'PF-101',
    name: 'Skyline Crest Residences',
    location: 'Gachibowli',
    city: 'Hyderabad',
    price: 8750000,
    bhk: 3,
    area: 1850,
    type: 'Apartment',
    amenities: ['Gym', 'Swimming Pool', 'Power Backup', 'Parking', 'Security'],
    rating: 4.8,
    availability: 'Ready to Move',
    description: 'A premium 3 BHK residence with panoramic city views, landscaped terraces, and close access to IT corridors and retail hubs.',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'PF-102',
    name: 'Greenview Courtyard',
    location: 'Kondapur',
    city: 'Hyderabad',
    price: 6950000,
    bhk: 2,
    area: 1425,
    type: 'Apartment',
    amenities: ['Clubhouse', 'Children Play Area', 'Jogging Track', 'Parking'],
    rating: 4.6,
    availability: 'Under Construction',
    description: 'Thoughtfully planned 2 BHK homes designed for young families seeking calm surroundings and quick connectivity to the city.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'PF-103',
    name: 'Lakeview Manor',
    location: 'Madhapur',
    city: 'Hyderabad',
    price: 14500000,
    bhk: 4,
    area: 2600,
    type: 'Villa',
    amenities: ['Garden', 'Private Terrace', 'Smart Home', 'Security', 'Parking'],
    rating: 4.9,
    availability: 'Ready to Move',
    description: 'An elegant family villa built around natural light and open layouts, positioned near premium workplaces and lifestyle districts.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'PF-104',
    name: 'Harbor Point',
    location: 'Hitech City',
    city: 'Hyderabad',
    price: 5100000,
    bhk: 1,
    area: 760,
    type: 'Apartment',
    amenities: ['Lift', 'Power Backup', 'Cafe', 'Security'],
    rating: 4.4,
    availability: 'New Listing',
    description: 'Compact smart apartments crafted for professionals, combining cost efficiency with premium urban amenities.',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'PF-105',
    name: 'Sunset Heights',
    location: 'Jubilee Hills',
    city: 'Hyderabad',
    price: 21250000,
    bhk: 4,
    area: 3100,
    type: 'Villa',
    amenities: ['Pool', 'Party Hall', 'Garden', 'Security', 'Parking'],
    rating: 4.9,
    availability: 'Ready to Move',
    description: 'A statement villa in one of the city’s most sought-after neighborhoods, offering premium comfort and an entertainer’s layout.',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'PF-106',
    name: 'Oakridge Residency',
    location: 'Banjara Hills',
    city: 'Hyderabad',
    price: 9800000,
    bhk: 3,
    area: 1900,
    type: 'Apartment',
    amenities: ['Gym', 'Security', '24x7 Concierge', 'Parking', 'Spa'],
    rating: 4.7,
    availability: 'Ready to Move',
    description: 'Elegant 3 BHK homes with refined interiors, landscaped lounges, and excellent access to premium retail and dining options.',
    image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'PF-201',
    name: 'Lakeside Enclave',
    location: 'Koramangala',
    city: 'Bengaluru',
    price: 11800000,
    bhk: 3,
    area: 1720,
    type: 'Apartment',
    amenities: ['Clubhouse', 'Gym', 'Children Play Area', 'Parking'],
    rating: 4.7,
    availability: 'Ready to Move',
    description: 'An airy urban apartment near cafés, parks, and key commercial zones, ideal for professionals and growing families.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'PF-202',
    name: 'Evergreen Homes',
    location: 'Indiranagar',
    city: 'Bengaluru',
    price: 13750000,
    bhk: 3,
    area: 1880,
    type: 'Villa',
    amenities: ['Garden', 'Pool', 'Solar Panels', 'Parking', 'Security'],
    rating: 4.8,
    availability: 'Under Construction',
    description: 'A premium villa concept that blends contemporary interiors with green courtyards and smart energy features.',
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'PF-203',
    name: 'Nexus Horizon',
    location: 'Whitefield',
    city: 'Bengaluru',
    price: 15800000,
    bhk: 4,
    area: 2500,
    type: 'Apartment',
    amenities: ['Swimming Pool', 'Jogging Track', 'Gym', 'Security'],
    rating: 4.8,
    availability: 'Ready to Move',
    description: 'Large luxury apartments in one of Bengaluru’s fastest-growing neighborhoods with excellent community amenities.',
    image: 'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'PF-204',
    name: 'Urban Nest',
    location: 'HSR Layout',
    city: 'Bengaluru',
    price: 6400000,
    bhk: 2,
    area: 1180,
    type: 'Apartment',
    amenities: ['Power Backup', 'Gym', 'Security', 'CCTV'],
    rating: 4.5,
    availability: 'New Listing',
    description: 'A modern 2 BHK configured with practical storage and a lively community atmosphere close to major transit points.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'PF-301',
    name: 'The Ivy Terrace',
    location: 'Baner',
    city: 'Pune',
    price: 9500000,
    bhk: 3,
    area: 1700,
    type: 'Apartment',
    amenities: ['Park', 'Gym', 'Parking', 'Security', 'Lift'],
    rating: 4.6,
    availability: 'Ready to Move',
    description: 'Comfort-first residences with generous balconies, seamless flow, and a warm neighborhood feel close to key schools and offices.',
    image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'PF-302',
    name: 'Maple Grove Villa',
    location: 'Kharadi',
    city: 'Pune',
    price: 18200000,
    bhk: 4,
    area: 2900,
    type: 'Villa',
    amenities: ['Garden', 'Private Pool', 'Parking', 'Security', 'Smart Lock'],
    rating: 4.9,
    availability: 'Ready to Move',
    description: 'A spacious and lifestyle-forward villa designed for comfortable family living with an emphasis on indoor-outdoor elegance.',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'PF-303',
    name: 'Civic Heights',
    location: 'Wakad',
    city: 'Pune',
    price: 5850000,
    bhk: 2,
    area: 980,
    type: 'Apartment',
    amenities: ['Children Play Area', 'Security', 'Power Backup', 'Parking'],
    rating: 4.4,
    availability: 'New Listing',
    description: 'Affordable but premium 2 BHK living, built with an urban lifestyle in mind and situated near major commercial developments.',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80'
  }
];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/properties', (req, res) => {
  res.json({
    total: properties.length,
    properties: properties.map(property => ({
      ...property,
      priceLabel: `₹${property.price.toLocaleString('en-IN')}`
    }))
  });
});

app.get('/api/properties/:id', (req, res) => {
  const property = properties.find(item => item.id === req.params.id);
  if (!property) {
    return res.status(404).json({ message: 'Property not found.' });
  }
  res.json(property);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Property Finder website running at http://localhost:${PORT}`);
});
