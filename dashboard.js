document.addEventListener('DOMContentLoaded', function() {
    const generatorForm = document.getElementById('generatorForm');
    const generateBtn = document.getElementById('generateBtn');
    const userTCR = parseInt(sessionStorage.getItem('userTCR') || '0');
    
    // Disable generate button if no TCR left
    if (userTCR <= 0) {
        generateBtn.disabled = true;
        generateBtn.textContent = 'Token Habis';
    }
    
    // Handle form submission
    generatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userTCR = parseInt(sessionStorage.getItem('userTCR') || '0');
        
        // Check if user has TCR left
        if (userTCR <= 0) {
            IQCGenerator.showMessage('Token kamu sudah habis, silakan order token baru.', 'error');
            return;
        }
        
        // Get form data
        const chatText = document.getElementById('chatText').value;
        const batteryLevel = document.getElementById('batteryLevel').value;
        const networkName = document.getElementById('networkName').value;
        const phoneTime = document.getElementById('phoneTime').value;
        
        // Store data for generate page
        sessionStorage.setItem('chatData', JSON.stringify({
            chatText,
            batteryLevel,
            networkName,
            phoneTime
        }));
        
        // Deduct 1 TCR
        const newTCR = userTCR - 1;
        sessionStorage.setItem('userTCR', newTCR.toString());
        
        // Redirect to generate page
        window.location.href = 'generate.html';
    });
});
