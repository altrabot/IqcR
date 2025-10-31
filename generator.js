document.addEventListener('DOMContentLoaded', function() {
    const screenshotResult = document.getElementById('screenshotResult');
    const downloadBtn = document.getElementById('downloadBtn');
    const shareBtn = document.getElementById('shareBtn');
    
    // Get chat data from sessionStorage
    const chatData = JSON.parse(sessionStorage.getItem('chatData') || '{}');
    
    if (Object.keys(chatData).length === 0) {
        // No data found, redirect to dashboard
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Generate screenshot preview
    generateScreenshotPreview(chatData);
    
    // Handle download button
    downloadBtn.addEventListener('click', function() {
        downloadScreenshot();
    });
    
    // Handle share button
    shareBtn.addEventListener('click', function() {
        shareScreenshot();
    });
    
    // Check if Web Share API is available
    if (!navigator.share) {
        shareBtn.style.display = 'none';
    }
    
    function generateScreenshotPreview(data) {
        const { chatText, batteryLevel, networkName, phoneTime } = data;
        
        // Format chat messages
        const chatMessages = formatChatMessages(chatText);
        
        // Create iPhone screenshot
        screenshotResult.innerHTML = `
            <div class="iphone-status-bar">
                <div class="iphone-time">${IQCGenerator.formatTime(phoneTime)}</div>
                <div class="iphone-status-icons">
                    <span class="network-name">${networkName}</span>
                    <div class="battery-indicator">
                        <span class="battery-level">${batteryLevel}%</span>
                        <div class="battery-icon">🔋</div>
                    </div>
                </div>
            </div>
            <div class="whatsapp-header">
                <div class="whatsapp-back">‹</div>
                <div class="whatsapp-contact">
                    <div class="whatsapp-contact-name">Kontak WhatsApp</div>
                    <div class="whatsapp-contact-status">online</div>
                </div>
                <div class="whatsapp-actions">
                    <span>📹</span>
                    <span>📞</span>
                    <span>⋮</span>
                </div>
            </div>
            <div class="chat-container">
                ${chatMessages}
            </div>
        `;
    }
    
    function formatChatMessages(chatText) {
        // Split by new lines and create chat bubbles
        const lines = chatText.split('\n').filter(line => line.trim() !== '');
        let html = '';
        let isSent = false; // Alternate between sent and received
        
        lines.forEach(line => {
            isSent = !isSent; // Alternate for each message
            const bubbleClass = isSent ? 'sent' : 'received';
            
            // Generate random time for each message (within last hour)
            const randomMinutes = Math.floor(Math.random() * 60);
            const timeString = `${randomMinutes.toString().padStart(2, '0')}`;
            
            html += `
                <div class="chat-bubble ${bubbleClass}">
                    <div class="chat-text">${line}</div>
                    <div class="chat-time">${timeString}</div>
                </div>
            `;
        });
        
        return html;
    }
    
    function downloadScreenshot() {
        // Use html2canvas to capture the screenshot
        html2canvas(screenshotResult, {
            scale: 2, // Higher quality
            useCORS: true,
            logging: false
        }).then(canvas => {
            // Convert canvas to image and download
            const link = document.createElement('a');
            link.download = `whatsapp-screenshot-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            IQCGenerator.showMessage('Screenshot berhasil diunduh!');
        }).catch(error => {
            console.error('Error generating screenshot:', error);
            IQCGenerator.showMessage('Terjadi kesalahan saat mengunduh.', 'error');
        });
    }
    
    function shareScreenshot() {
        // Use html2canvas to capture the screenshot
        html2canvas(screenshotResult, {
            scale: 2,
            useCORS: true,
            logging: false
        }).then(canvas => {
            // Convert canvas to blob for sharing
            canvas.toBlob(blob => {
                const file = new File([blob], `whatsapp-screenshot-${Date.now()}.png`, {
                    type: 'image/png'
                });
                
                // Share using Web Share API
                if (navigator.share) {
                    navigator.share({
                        files: [file],
                        title: 'WhatsApp Screenshot',
                        text: 'Lihat screenshot percakapan WhatsApp yang saya buat!'
                    }).then(() => {
                        IQCGenerator.showMessage('Screenshot berhasil dibagikan!');
                    }).catch(error => {
                        console.error('Error sharing:', error);
                    });
                }
            });
        }).catch(error => {
            console.error('Error generating screenshot for sharing:', error);
            IQCGenerator.showMessage('Terjadi kesalahan saat membagikan.', 'error');
        });
    }
});
