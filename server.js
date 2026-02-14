const express = require('express');
const ytdl = require('ytdl-core');  // keep this for now
const cors = require('cors');
const path = require('path');

process.env.YTDL_NO_UPDATE = '1';  // <-- Add this to kill the update check

const app = express();
// rest of your code...
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files (index.html) for GET /
app.use(express.static(__dirname));

// Explicit root GET (optional but good)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Your convert POST - make sure this is BEFORE any catch-all
app.post('/convert', async (req, res) => {
  const { url } = req.body;
  if (!ytdl.validateURL(url)) {
    return res.status(400).send('Invalid YouTube incantation.');
  }

  try {
    const info = await ytdl.getInfo(url);
    const audioFormat = ytdl.chooseFormat(info.formats, { filter: 'audioonly', quality: 'highestaudio' }) || ytdl.chooseFormat(info.formats, { filter: 'audioonly' });

    if (!audioFormat) throw new Error('No audio format found');

    res.setHeader('Content-Disposition', 'attachment; filename="cursed_music.mp3"');
    res.setHeader('Content-Type', 'audio/mpeg');

    ytdl.downloadFromInfo(info, { format: audioFormat }).pipe(res);
  } catch (error) {
    console.error('Convert error:', error.message);
    res.status(500).send(`Curse unraveled: ${error.message || error}`);
  }
});

// Listen
app.listen(port, '0.0.0.0', () => {
  console.log(`Cursed server awakens on port ${port}...`);
});