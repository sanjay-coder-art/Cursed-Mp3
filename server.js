const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const path = require('path');  // <-- Add this line

const app = express();
const port = process.env.PORT || 3000;  // <-- Use Render's PORT env var!

app.use(cors());
app.use(express.json());

// Serve static files (your index.html, CSS, etc.) from the current directory
app.use(express.static(__dirname));  // <-- This serves index.html automatically for /

// If you want explicit root route (optional but safer):
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Your convert endpoint
app.post('/convert', async (req, res) => {
  const { url } = req.body;
  if (!ytdl.validateURL(url)) {
    return res.status(400).send('Invalid YouTube incantation.');
  }

  try {
    const info = await ytdl.getInfo(url);
    const audioFormat = ytdl.chooseFormat(info.formats, { filter: 'audioonly', quality: 'highestaudio' });

    res.setHeader('Content-Disposition', 'attachment; filename="cursed_music.mp3"');
    res.setHeader('Content-Type', 'audio/mpeg');

    ytdl.downloadFromInfo(info, { format: audioFormat }).pipe(res);
  } catch (error) {
    res.status(500).send(`Curse unraveled: ${error.message}`);
  }
});

// Listen on the correct port and host
app.listen(port, '0.0.0.0', () => {
  console.log(`Cursed server awakens on port ${port}...`);
});