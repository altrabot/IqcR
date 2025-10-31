const fs = require('fs');
const path = require('path');

class TokenGenerator {
    static generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    static generateToken(tcrAmount) {
        const randomPart = this.generateRandomString(5);
        const amountPart = tcrAmount.toString().padStart(2, '0');
        return `TCR-${randomPart}-${amountPart}`;
    }
    
    static generateTokens() {
        const tokens = [];
        
        // Generate 20 tokens with 5 TCR
        for (let i = 0; i < 20; i++) {
            tokens.push({
                token: this.generateToken(5),
                tcrAmount: 5
            });
        }
        
        // Generate 10 tokens with 30 TCR
        for (let i = 0; i < 10; i++) {
            tokens.push({
                token: this.generateToken(30),
                tcrAmount: 30
            });
        }
        
        // Generate 10 tokens with 80 TCR
        for (let i = 0; i < 10; i++) {
            tokens.push({
                token: this.generateToken(80),
                tcrAmount: 80
            });
        }
        
        // Generate 10 tokens with 150 TCR
        for (let i = 0; i < 10; i++) {
            tokens.push({
                token: this.generateToken(150),
                tcrAmount: 150
            });
        }
        
        return tokens;
    }
    
    static saveTokens(tokens) {
        const tokensPath = path.join(__dirname, 'tokens', 'tokens.json');
        const tokensData = { tokens };
        
        fs.writeFileSync(tokensPath, JSON.stringify(tokensData, null, 2));
        
        // Log the generated tokens
        const date = new Date().toISOString().split('T')[0];
        console.log(`[IQC-GENERATOR] Token baru dibuat (${date})`);
        tokens.forEach(token => {
            console.log(token.token);
        });
        console.log(`Total: ${tokens.length} token`);
    }
}

// Generate and save tokens
const tokens = TokenGenerator.generateTokens();
TokenGenerator.saveTokens(tokens);

// Schedule to run every 24 hours
setInterval(() => {
    const tokens = TokenGenerator.generateTokens();
    TokenGenerator.saveTokens(tokens);
}, 24 * 60 * 60 * 1000);
