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
    
    // Auto-format token to uppercase
    tokenInput.addEventListener('blur', function() {
        this.value = this.value.toUpperCase();
    });
    
    // Handle form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = nameInput.value.trim();
        const token = tokenInput.value.trim().toUpperCase();
        
        // Basic validation
        if (!name) {
            showError('Nama harus diisi');
            return;
        }
        
        if (!token) {
            showError('Token harus diisi');
            return;
        }
        
        // Validate token format
        if (!token.match(/^TCR-[A-Z0-9]{5}-(05|30|80|150)$/)) {
            showError('Format token tidak valid. Contoh: TCR-A1B2C-05');
            return;
        }
        
        // Check if token already used (client-side check)
        if (TokenManager.isTokenUsed(token)) {
            showError('Token ini sudah digunakan');
            return;
        }
        
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
                
                // Mark token as used (client-side)
                TokenManager.addToUsedTokens(token);
                
                // Show success message
                IQCGenerator.showMessage('Login berhasil! Mengarahkan ke dashboard...');
                
                // Redirect to dashboard after short delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
                
            } else {
                showError('Kode token salah atau sudah digunakan.');
                loginBtn.disabled = false;
                loginBtn.textContent = 'Lanjutkan';
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('Terjadi kesalahan. Silakan coba lagi.');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Lanjutkan';
        }
    });
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        
        // Auto hide error after 5 seconds
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    }
    
    // Clear error when user starts typing
    nameInput.addEventListener('input', clearError);
    tokenInput.addEventListener('input', clearError);
    
    function clearError() {
        errorMessage.classList.remove('show');
    }
    
    // Initial validation
    validateForm();
});
