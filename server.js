const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;
const upload = multer({ dest: 'uploads/' });

// Serve static files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Persistent storage
let posts = [];
if (fs.existsSync('posts.json')) {
    posts = JSON.parse(fs.readFileSync('posts.json'));
}

// Save posts every minute
setInterval(() => {
    fs.writeFileSync('posts.json', JSON.stringify(posts));
}, 60000);

// API endpoints
app.get('/api/posts', (req, res) => res.json(posts));

app.post('/api/posts', upload.single('media'), (req, res) => {
    const post = {
        id: Date.now(),
        text: req.body.text,
        media: req.file ? `/uploads/${req.file.filename}` : null,
        timestamp: Date.now()
    };
    posts.unshift(post);
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
