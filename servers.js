const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080; // Zeabur menggunakan port 8080

// Middleware untuk logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Serve static files
app.use(express.static('.', {
    index: false,
    extensions: ['html', 'htm']
}));

// API endpoint untuk mendapatkan token
app.get('/api/tokens', (req, res) => {
    try {
        const tokensPath = path.join(__dirname, 'tokens', 'tokens.json');
        if (fs.existsSync(tokensPath)) {
            const tokensData = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
            res.json(tokensData);
        } else {
            res.json({ tokens: [] });
        }
    } catch (error) {
        console.error('Error loading tokens:', error);
        res.status(500).json({ error: 'Failed to load tokens' });
    }
});

// API endpoint untuk menandai token sebagai used
app.post('/api/tokens/:token/use', express.json(), (req, res) => {
    try {
        const token = req.params.token;
        const usedPath = path.join(__dirname, 'tokens', 'used.json');
        
        let usedData = { used: [] };
        if (fs.existsSync(usedPath)) {
            usedData = JSON.parse(fs.readFileSync(usedPath, 'utf8'));
        }
        
        if (!usedData.used.includes(token)) {
            usedData.used.push(token);
            fs.writeFileSync(usedPath, JSON.stringify(usedData, null, 2));
            console.log(`Token marked as used: ${token}`);
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error marking token as used:', error);
        res.status(500).json({ error: 'Failed to mark token as used' });
    }
});

// Route untuk setiap halaman HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/generate.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'generate.html'));
});

app.get('/donation.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'donation.html'));
});

// Health check endpoint untuk Zeabur
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'IQC Generator'
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 IQC Generator Server Started');
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌐 URL: http://0.0.0.0:${PORT}`);
    console.log(`⏰ Time: ${new Date().toISOString()}`);
    console.log('✅ Server is ready to accept requests');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully');
    process.exit(0);
});
