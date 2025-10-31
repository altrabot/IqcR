class TokenManager {
    static async validateToken(token) {
        try {
            // Load valid tokens dari API endpoint
            const tokensResponse = await fetch('/api/tokens');
            const tokensData = await tokensResponse.json();
            const validTokens = tokensData.tokens || [];
            
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
            // Mark token as used via API
            const response = await fetch(`/api/tokens/${token}/use`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                // Also mark locally
                this.addToUsedTokens(token);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error marking token as used:', error);
            // Fallback to local storage
            this.addToUsedTokens(token);
            return true;
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
            }
        } catch (error) {
            console.error('Error adding token to used list:', error);
        }
    }
                }
