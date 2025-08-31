// server.js
// Минималистичный сервер для приёма треков из клиента и записи в PostgreSQL

const express = require('express');
const cors = require('cors');
const { addTrackToDB, getAllTracks } = require('./db');


const app = express();
app.use(cors());
app.use(express.json());


// Чтение всех треков из БД
app.get('/api/track', async (req, res) => {
  try {
    const tracks = await getAllTracks();
    res.json(tracks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Добавление трека в БД
app.post('/api/track', async (req, res) => {
  const { id, url } = req.body;
  if (!id || !url) return res.status(400).json({ error: 'id and url required' });
  try {
    await addTrackToDB(id, url);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3001, () => console.log('API server started on http://localhost:3001'));
