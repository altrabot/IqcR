const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// API endpoint untuk mendapatkan token
app.get('/api/tokens', (req, res) => {
    try {
        const tokensPath = path.join(__dirname, 'tokens', 'tokens.json');
        const tokensData = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
        res.json(tokensData);
    } catch (error) {
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
        }
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark token as used' });
    }
});

// Serve index.html for all routes (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 IQC Generator running on port ${PORT}`);
    console.log(`📱 Access the app: http://localhost:${PORT}`);
});
