document.addEventListener('DOMContentLoaded', () => {
    const certSystem = new CertificateGenerator();
    
    // Still listen for game completion for those who play
    window.addEventListener('gameOver', (e) => {
        if (e.detail?.score) {
            localStorage.setItem('latestScore', e.detail.score);
            localStorage.setItem('validScore', 'true');
        }
        if (e.detail?.time) {
            localStorage.setItem('gameTime', e.detail.time);
        }
        localStorage.setItem('gameCompleted', 'true');
        certSystem.handleGameCompletion();
    });
    
    // Check for existing completion (for those who played)
    if (localStorage.getItem('gameCompleted') === 'true' && localStorage.getItem('validScore') === 'true') {
        certSystem.enableCertificateGeneration();
    }
});