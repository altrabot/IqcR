// Global utility functions
class IQCGenerator {
    static init() {
        // Check if user is logged in for protected pages
        if (window.location.pathname.includes('dashboard.html') || 
            window.location.pathname.includes('generate.html')) {
            this.checkAuth();
        }
        
        // Set current time as default for phone time
        if (document.getElementById('phoneTime')) {
            const now = new Date();
            const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                              now.getMinutes().toString().padStart(2, '0');
            document.getElementById('phoneTime').value = timeString;
        }
    }
    
    static checkAuth() {
        const userName = sessionStorage.getItem('userName');
        const userTCR = sessionStorage.getItem('userTCR');
        
        if (!userName || !userTCR) {
            window.location.href = 'index.html';
            return;
        }
        
        // Update UI with user info
        if (document.getElementById('userName')) {
            document.getElementById('userName').textContent = userName;
        }
        
        if (document.getElementById('userTCR')) {
            document.getElementById('userTCR').textContent = userTCR;
        }
        
        if (document.getElementById('remainingTCR')) {
            document.getElementById('remainingTCR').textContent = userTCR;
        }
    }
    
    static showMessage(text, type = 'success') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        document.body.appendChild(message);
        
        // Show message
        setTimeout(() => {
            message.classList.add('show');
        }, 100);
        
        // Hide message after 3 seconds
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 3000);
    }
    
    static formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    IQCGenerator.init();
});
