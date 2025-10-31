class TokenManager {
    static async validateToken(token) {
        try {
            // Load valid tokens
            const tokensResponse = await fetch('tokens/tokens.json');
            const tokensData = await tokensResponse.json();
            const validTokens = tokensData.tokens || [];
            
            // Load used tokens
            const usedResponse = await fetch('tokens/used.json');
            const usedData = await usedResponse.json();
            const usedTokens = usedData.used || [];
            
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
            const usedResponse = await fetch('tokens/used.json');
            const usedData = await usedResponse.json();
            const usedTokens = usedData.used || [];
            
            // Add token to used list
            if (!usedTokens.includes(token)) {
                usedTokens.push(token);
                
                // In a real implementation, we would save this back to the server
                // For client-side only, we'll simulate this
                console.log(`Token ${token} marked as used`);
            }
            
            return true;
        } catch (error) {
            console.error('Error marking token as used:', error);
            return false;
        }
    }
}
