// mongo-certificate-integration.js
class MongoCertificateGenerator extends CertificateGenerator {
    constructor() {
        super();
        this.playerName = "Player"; // Always default to "Player"
    }

    async loadPlayerName() {
        try {
            // Skip MongoDB fetch and always use default name
            this.playerName = "Player";
        } catch (error) {
            console.error("Using default player name:", error);
            this.playerName = "Player";
        }
    }

    // Override generateCertificate to ensure consistent name
    generateCertificate() {
        // Force default name regardless of any stored values
        this.playerName = "Player";
        super.generateCertificate();
    }
}

// Replace the default CertificateGenerator with our version
document.addEventListener('DOMContentLoaded', () => {
    // Remove existing certificate handler
    const oldHandler = document.querySelector('script[src*="certificate-handler.js"]');
    if (oldHandler) oldHandler.remove();

    // Initialize our version
    new MongoCertificateGenerator();
    
    // Still respond to game completion events
    document.addEventListener('gameCompleted', () => {
        document.querySelector('.certificate-section')?.classList.add('active');
    });
    
    if (localStorage.getItem('gameCompleted') === 'true') {
        document.querySelector('.certificate-section')?.classList.add('active');
    }
});