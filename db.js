const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database at', dbPath);
});

const hostels = [
  { id: 1, name: 'Central Haven', city: 'Delhi', price: 599, rating: 4.8, beds: 12, features: ['WiFi', 'Kitchen', 'Parking'], bg: '#667eea' },
  { id: 2, name: 'Student Paradise', city: 'Delhi', price: 499, rating: 4.6, beds: 8, features: ['WiFi', 'Gym'], bg: '#f093fb' },
  { id: 3, name: 'Metro Stay', city: 'Delhi', price: 549, rating: 4.7, beds: 3, features: ['WiFi', 'Cafe'], bg: '#4facfe' },
  { id: 4, name: 'Marine Drive Stay', city: 'Mumbai', price: 799, rating: 4.8, beds: 10, features: ['WiFi', 'AC', 'Parking'], bg: '#43e97b' },
  { id: 5, name: 'Bollywood Hostel', city: 'Mumbai', price: 699, rating: 4.7, beds: 12, features: ['WiFi', 'Cafe'], bg: '#fa709a' },
  { id: 6, name: 'Tech Park Hostel', city: 'Bangalore', price: 579, rating: 4.7, beds: 12, features: ['WiFi', 'AC', 'Gym'], bg: '#a8edea' },
  { id: 7, name: 'Garden City Stay', city: 'Bangalore', price: 629, rating: 4.8, beds: 10, features: ['WiFi', 'Kitchen'], bg: '#ff9a9e' },
  { id: 8, name: 'Beach Paradise', city: 'Goa', price: 699, rating: 4.9, beds: 15, features: ['WiFi', 'Beach', 'Cafe'], bg: '#ffecd2' },
  { id: 9, name: 'Sunset Backpackers', city: 'Goa', price: 649, rating: 4.8, beds: 12, features: ['WiFi', 'Beach'], bg: '#a1c4fd' },
  { id: 10, name: 'Pink City Hostel', city: 'Jaipur', price: 399, rating: 4.6, beds: 10, features: ['WiFi', 'Kitchen'], bg: '#fbc2eb' },
  { id: 11, name: 'Royal Heritage', city: 'Jaipur', price: 449, rating: 4.7, beds: 8, features: ['WiFi', 'Restaurant'], bg: '#667eea' },
  { id: 12, name: 'Cultural Heritage', city: 'Kolkata', price: 479, rating: 4.6, beds: 10, features: ['WiFi', 'Cafe'], bg: '#f093fb' },
  { id: 13, name: 'Victoria Hostel', city: 'Kolkata', price: 499, rating: 4.7, beds: 8, features: ['WiFi', 'Restaurant'], bg: '#4facfe' },
  { id: 14, name: 'Marina Beach', city: 'Chennai', price: 529, rating: 4.7, beds: 10, features: ['WiFi', 'Beach', 'AC'], bg: '#43e97b' },
  { id: 15, name: 'Temple City Stay', city: 'Chennai', price: 469, rating: 4.6, beds: 8, features: ['WiFi', 'Kitchen'], bg: '#fa709a' },
  { id: 16, name: 'Charminar Hostel', city: 'Hyderabad', price: 449, rating: 4.6, beds: 10, features: ['WiFi', 'Restaurant'], bg: '#a8edea' },
  { id: 17, name: 'IT Park Stay', city: 'Hyderabad', price: 529, rating: 4.7, beds: 14, features: ['WiFi', 'AC'], bg: '#ff9a9e' },
  { id: 18, name: 'University Hostel', city: 'Pune', price: 489, rating: 4.6, beds: 12, features: ['WiFi', 'Kitchen'], bg: '#ffecd2' },
  { id: 19, name: 'Pune Backpackers', city: 'Pune', price: 559, rating: 4.8, beds: 8, features: ['WiFi', 'Garden'], bg: '#a1c4fd' },
  { id: 20, name: 'Sabarmati Hostel', city: 'Ahmedabad', price: 419, rating: 4.5, beds: 10, features: ['WiFi', 'Kitchen'], bg: '#fbc2eb' },
  { id: 21, name: 'Heritage City', city: 'Ahmedabad', price: 389, rating: 4.6, beds: 8, features: ['WiFi', 'Cafe'], bg: '#667eea' }
];

const createHostelsTable = `
CREATE TABLE IF NOT EXISTS hostels (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  price REAL NOT NULL,
  rating REAL NOT NULL,
  beds INTEGER NOT NULL,
  features TEXT NOT NULL,
  bg TEXT
);
`;

const createBookingsTable = `
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hostelId INTEGER NOT NULL,
  guestName TEXT NOT NULL,
  guestEmail TEXT NOT NULL,
  guestPhone TEXT NOT NULL,
  checkIn TEXT,
  checkOut TEXT,
  createdAt TEXT NOT NULL,
  FOREIGN KEY(hostelId) REFERENCES hostels(id)
);
`;

db.serialize(() => {
  db.run(createHostelsTable);
  db.run(createBookingsTable);

  const insertHostel = db.prepare(
    'INSERT OR IGNORE INTO hostels (id, name, city, price, rating, beds, features, bg) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );

  hostels.forEach((hostel) => {
    insertHostel.run(
      hostel.id,
      hostel.name,
      hostel.city,
      hostel.price,
      hostel.rating,
      hostel.beds,
      JSON.stringify(hostel.features),
      hostel.bg
    );
  });

  insertHostel.finalize();
});

module.exports = db;
