const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

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

app.listen(port, () => {
    console.log(`Cursed server awakens on port ${port}...`);
});