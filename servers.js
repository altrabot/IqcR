const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware untuk static files
app.use(express.static('.'));

// Route untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route untuk dashboard
app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Route untuk generate
app.get('/generate.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'generate.html'));
});

// Route untuk donation
app.get('/donation.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'donation.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Listen port
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server berjalan di port ${PORT}`);
});
