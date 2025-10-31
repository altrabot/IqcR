class TokenManager {
    static async validateToken(token) {
        try {
            // Load valid tokens
            const tokensResponse = await fetch('tokens/tokens.json');
            const tokensData = await tokensResponse.json();
            const validTokens = tokensData.tokens || [];
            
            // Load used tokens
            let usedTokens = [];
            try {
                const usedResponse = await fetch('tokens/used.json');
                const usedData = await usedResponse.json();
                usedTokens = usedData.used || [];
            } catch (error) {
                console.log('No used tokens file found, starting fresh');
            }
            
            // Check if token is valid and not used
            const tokenEntry = validTokens.find(t => t.token === token);
            const isUsed = usedTokens.includes(token);
            
            if (tokenEntry && !isUsed) {
                return {
                    valid: true,
                    tcrAmount: tokenEntry.tcrAmount
                };
            }
            
            return { valid: false };
        } catch (error) {
            console.error('Error validating token:', error);
            return { valid: false };
        }
    }
    
    static async markTokenAsUsed(token) {
        try {
            // Load used tokens
            let usedTokens = [];
            try {
                const usedResponse = await fetch('tokens/used.json');
                const usedData = await usedResponse.json();
                usedTokens = usedData.used || [];
            } catch (error) {
                console.log('No used tokens file found, creating new one');
            }
            
            // Add token to used list
            if (!usedTokens.includes(token)) {
                usedTokens.push(token);
                
                // In a real implementation, we would save this back to the server
                // For client-side only, we'll store in sessionStorage as backup
                sessionStorage.setItem('usedTokens', JSON.stringify(usedTokens));
                console.log(`Token ${token} marked as used`);
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
            }
        } catch (error) {
            console.error('Error adding token to used list:', error);
        }
    }
                    }
