const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db');

const app = express();
const $data = Invoke-WebRequest http://localhost:3000/api/hostels | ConvertFrom-Json
$data | Format-Table$data = Invoke-WebRequest http://localhost:3000/api/hostels | ConvertFrom-Json
$data | Format-TablePORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/api/hostels', (req, res) => {
  const city = req.query.city;
  let query = 'SELECT * FROM hostels';
  const params = [];

  if (city) {
    query += ' WHERE city = ?';
    params.push(city);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch hostels.' });
    }

    const hostels = rows.map((row) => ({
      ...row,
      features: JSON.parse(row.features)
    }));

    res.json(hostels);
  });
});

app.get('/api/hostels/:id', (req, res) => {
  const hostelId = Number(req.params.id);

  db.get('SELECT * FROM hostels WHERE id = ?', [hostelId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch hostel.' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Hostel not found.' });
    }

    res.json({ ...row, features: JSON.parse(row.features) });
  });
});

app.post('/api/bookings', (req, res) => {
  const { hostelId, guestName, guestEmail, guestPhone, checkIn, checkOut } = req.body;

  if (!hostelId || !guestName || !guestEmail || !guestPhone) {
    return res.status(400).json({ error: 'Missing required booking fields.' });
  }

  const createdAt = new Date().toISOString();
  const sql = `INSERT INTO bookings (hostelId, guestName, guestEmail, guestPhone, checkIn, checkOut, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [hostelId, guestName, guestEmail, guestPhone, checkIn || '', checkOut || '', createdAt];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to save booking.' });
    }

    db.get('SELECT * FROM bookings WHERE id = ?', [this.lastID], (err2, booking) => {
      if (err2) {
        return res.status(500).json({ error: 'Booking saved, but failed to return result.' });
      }
      res.status(201).json(booking);
    });
  });
});

app.get('/api/bookings', (req, res) => {
  db.all('SELECT * FROM bookings ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch bookings.' });
    }
    res.json(rows);
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'bugu.html'));
});

app.listen(PORT, () => {
  console.log(`Backend server is running at http://localhost:${PORT}`);
});
