// db.js
// Подключение к PostgreSQL и функция для добавления трека в таблицу tracklist4

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, 'dbconfig.json');
const dbConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const pool = new Pool(dbConfig);

async function addTrackToDB(id, url) {
  await pool.query('INSERT INTO tracklist4 (id, url) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING', [id, url]);
}

async function getAllTracks() {
  const res = await pool.query('SELECT id, url FROM tracklist4 ORDER BY id');
  return res.rows;
}

module.exports = { addTrackToDB, getAllTracks, pool };
