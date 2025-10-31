document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const loginBtn = document.getElementById('loginBtn');
    
    // Enable/disable login button based on input
    const nameInput = document.getElementById('name');
    const tokenInput = document.getElementById('token');
    
    function validateForm() {
        const nameValid = nameInput.value.trim().length > 0;
        const tokenValid = tokenInput.value.trim().length > 0;
        
        loginBtn.disabled = !(nameValid && tokenValid);
    }
    
    nameInput.addEventListener('input', validateForm);
    tokenInput.addEventListener('input', validateForm);
    
    // Handle form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = nameInput.value.trim();
        const token = tokenInput.value.trim().toUpperCase();
        
        // Show loading state
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span class="loading"></span> Memverifikasi...';
        
        try {
            // Validate token
            const isValid = await TokenManager.validateToken(token);
            
            if (isValid.valid) {
                // Save user data to sessionStorage
                sessionStorage.setItem('userName', name);
                sessionStorage.setItem('userTCR', isValid.tcrAmount);
                sessionStorage.setItem('usedToken', token);
                
                // Mark token as used
                await TokenManager.markTokenAsUsed(token);
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                errorMessage.textContent = 'Kode token salah atau sudah digunakan.';
                errorMessage.classList.add('show');
                loginBtn.disabled = false;
                loginBtn.textContent = 'Lanjutkan';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = 'Terjadi kesalahan. Silakan coba lagi.';
            errorMessage.classList.add('show');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Lanjutkan';
        }
    });
    
    // Initial validation
    validateForm();
});
