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
        
        console.log('[IQC-GENERATOR] Membuat token baru...');
        
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
        try {
            const tokensDir = path.join(__dirname, 'tokens');
            
            // Create tokens directory if it doesn't exist
            if (!fs.existsSync(tokensDir)) {
                fs.mkdirSync(tokensDir, { recursive: true });
            }
            
            const tokensPath = path.join(tokensDir, 'tokens.json');
            const tokensData = { tokens };
            
            fs.writeFileSync(tokensPath, JSON.stringify(tokensData, null, 2));
            
            // Log the generated tokens
            const date = new Date().toLocaleDateString('id-ID');
            console.log(`\n[IQC-GENERATOR] Token baru dibuat (${date})`);
            console.log('='.repeat(50));
            
            // Log tokens by category
            console.log('\n🔹 5 TCR (20 token):');
            tokens.filter(t => t.tcrAmount === 5).forEach((token, index) => {
                console.log(`   ${index + 1}. ${token.token}`);
            });
            
            console.log('\n🔹 30 TCR (10 token):');
            tokens.filter(t => t.tcrAmount === 30).forEach((token, index) => {
                console.log(`   ${index + 1}. ${token.token}`);
            });
            
            console.log('\n🔹 80 TCR (10 token):');
            tokens.filter(t => t.tcrAmount === 80).forEach((token, index) => {
                console.log(`   ${index + 1}. ${token.token}`);
            });
            
            console.log('\n🔹 150 TCR (10 token):');
            tokens.filter(t => t.tcrAmount === 150).forEach((token, index) => {
                console.log(`   ${index + 1}. ${token.token}`);
            });
            
            console.log('\n' + '='.repeat(50));
            console.log(`📊 Total: ${tokens.length} token dibuat`);
            console.log('⏰ Token berikutnya akan dibuat dalam 24 jam');
            console.log('='.repeat(50));
            
        } catch (error) {
            console.error('❌ Error saving tokens:', error);
        }
    }
}

// Main execution
console.log('🚀 IQC Generator Token Service Dimulai...');
console.log('⏰ Service akan berjalan setiap 24 jam');

// Generate tokens immediately on start
console.log('\n🔄 Membuat token pertama...');
const tokens = TokenGenerator.generateTokens();
TokenGenerator.saveTokens(tokens);

// Schedule to run every 24 hours
const interval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
setInterval(() => {
    console.log('\n🔄 Membuat token baru (jadwal 24 jam)...');
    const newTokens = TokenGenerator.generateTokens();
    TokenGenerator.saveTokens(newTokens);
}, interval);

// Keep the process alive
console.log('\n✅ Service aktif. Menunggu jadwal berikutnya...');
process.on('SIGTERM', () => {
    console.log('\n🛑 Service dihentikan');
    process.exit(0);
});
