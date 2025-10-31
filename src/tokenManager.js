class TokenManager {
    static async loadTokens() {
        try {
            const response = await fetch('tokens/tokens.json');
            const data = await response.json();
            return data.tokens || [];
        } catch (error) {
            console.error('Error loading tokens:', error);
            // Fallback tokens jika file tidak bisa di-load
            return [
                { token: "TCR-A1B2C-05", tcrAmount: 5 },
                { token: "TCR-D3E4F-05", tcrAmount: 5 },
                { token: "TCR-G5H6I-05", tcrAmount: 5 },
                { token: "TCR-I1J2K-30", tcrAmount: 30 },
                { token: "TCR-L3M4N-30", tcrAmount: 30 },
                { token: "TCR-M1N2O-80", tcrAmount: 80 },
                { token: "TCR-P3Q4R-80", tcrAmount: 80 },
                { token: "TCR-Q1R2S-150", tcrAmount: 150 },
                { token: "TCR-T3U4V-150", tcrAmount: 150 }
            ];
        }
    }

    static async validateToken(token) {
        try {
            const validTokens = await this.loadTokens();
            
            // Check if token is valid
            const tokenEntry = validTokens.find(t => t.token === token);
            
            if (tokenEntry) {
                // Check if token already used (client-side check)
                const usedTokens = JSON.parse(sessionStorage.getItem('usedTokens') || '[]');
                const isUsed = usedTokens.includes(token);
                
                if (!isUsed) {
                    return {
                        valid: true,
                        tcrAmount: tokenEntry.tcrAmount
                    };
                }
            }
            
            return { valid: false };
        } catch (error) {
            console.error('Error validating token:', error);
            return { valid: false };
        }
    }

    static async markTokenAsUsed(token) {
        try {
            // Mark token as used in sessionStorage
            this.addToUsedTokens(token);
            
            // Try to save to used.json via fetch (optional)
            try {
                await fetch('tokens/used.json', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: token })
                });
            } catch (e) {
                // Ignore if cannot save to server
                console.log('Cannot save to server, using local storage only');
            }
            
            return true;
        } catch (error) {
            console.error('Error marking token as used:', error);
            return false;
        }
    }

    // Client-side validation for used tokens
    static isTokenUsed(token) {
        try {
            const usedTokens = JSON.parse(sessionStorage.getItem('usedTokens') || '[]');
            return usedTokens.includes(token);
        } catch (error) {
            return false;
        }
    }

    // Add token to client-side used list
    static addToUsedTokens(token) {
        try {
            const usedTokens = JSON.parse(sessionStorage.getItem('usedTokens') || '[]');
            if (!usedTokens.includes(token)) {
                usedTokens.push(token);
                sessionStorage.setItem('usedTokens', JSON.stringify(usedTokens));
                console.log(`Token ${token} marked as used locally`);
            }
        } catch (error) {
            console.error('Error adding token to used list:', error);
        }
    }
            }
