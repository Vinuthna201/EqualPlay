class CertificateGenerator {
    constructor() {
        this.certificateGenerated = localStorage.getItem('certificateGenerated') === 'true';
        this.canvas = null;
        this.initUI();
        this.setupEventListeners();
        this.checkGameStatus();
        this.setupDailyChallenge();
    }

    initUI() {
        if (!document.querySelector('.certificate-section')) {
            const html = `
                <div class="certificate-section">
                    <h3>🏆 Achievement Certificate</h3>
                    <div class="certificate-text" id="certificateMessage">Generate your fun certificate!</div>
                    <button id="generateCertificate">Generate Certificate</button>
                    <div class="certificate-preview" id="certificatePreview"></div>
                    <button id="downloadCertificate" class="download-certificate" disabled>Download Certificate</button>
                </div>
                <div class="daily-challenge-section">
                    <h3>🌟 Daily Challenge</h3>
                    <div class="challenge-description" id="challengeDescription">Loading challenge...</div>
                    <div class="challenge-status" id="challengeStatus"></div>
                    <button id="completeChallengeBtn" class="complete-challenge-btn" disabled>Mark as Completed</button>
                </div>
            `;
            document.querySelector('.right-sidebar').insertAdjacentHTML('beforeend', html);
        }
    }

    checkGameStatus() {
        if (this.isGameCompleted()) {
            this.enableCertificateGeneration();
            this.enableChallengeCompletion();
            
            if (this.certificateGenerated) {
                setTimeout(() => this.generateCertificate(true), 300);
            }
        }
    }

    isGameCompleted() {
        return localStorage.getItem('gameCompleted') === 'true' && 
               localStorage.getItem('validScore') === 'true';
    }

    enableCertificateGeneration() {
        const messageEl = document.getElementById('certificateMessage');
        if (messageEl) {
            messageEl.textContent = 'Congratulations! Generate your certificate below';
        }
        
        const genBtn = document.getElementById('generateCertificate');
        if (genBtn) {
            genBtn.classList.remove('disabled');
            genBtn.disabled = false;
        }
    }

    enableChallengeCompletion() {
        const btn = document.getElementById('completeChallengeBtn');
        if (btn) {
            btn.disabled = false;
        }
    }

    setupEventListeners() {
        const generateBtn = document.getElementById('generateCertificate');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generateCertificate();
            });
        }
        
        const downloadBtn = document.getElementById('downloadCertificate');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                if (!this.certificateGenerated || !this.canvas) {
                    this.generateCertificate(true);
                    setTimeout(() => this.downloadCertificate(), 300);
                    return;
                }
                this.downloadCertificate();
            });
        }
        
        const challengeBtn = document.getElementById('completeChallengeBtn');
        if (challengeBtn) {
            challengeBtn.addEventListener('click', () => this.completeDailyChallenge());
        }
    }

    handleGameCompletion() {
        this.enableCertificateGeneration();
        this.enableChallengeCompletion();
    }

    /* DAILY CHALLENGE FUNCTIONS */
    setupDailyChallenge() {
        this.loadChallenge();
        this.updateChallengeUI();
    }

    loadChallenge() {
        const today = new Date().toDateString();
        let challenge = localStorage.getItem('currentDailyChallenge');
        
        if (!challenge || localStorage.getItem('challengeDate') !== today) {
            const challenges = [
                "Score 90% or higher in the game",
                "Complete the game in under 5 minutes",
                "Find all hidden objects in level 3",
                "Complete the bonus quiz with no mistakes",
                "Share your certificate on social media"
            ];
            const dayIndex = new Date().getDay() % challenges.length;
            challenge = challenges[dayIndex];
            localStorage.setItem('currentDailyChallenge', challenge);
            localStorage.setItem('challengeDate', today);
            localStorage.removeItem('dailyChallengeCompleted');
        }
        
        const challengeDesc = document.getElementById('challengeDescription');
        if (challengeDesc) {
            challengeDesc.textContent = challenge;
        }
    }

    updateChallengeUI() {
        const today = new Date().toDateString();
        const isCompleted = localStorage.getItem('dailyChallengeCompleted') === today;
        const statusEl = document.getElementById('challengeStatus');
        const btn = document.getElementById('completeChallengeBtn');
        
        if (!statusEl || !btn) return;
        
        if (isCompleted) {
            statusEl.textContent = "✅ Challenge completed!";
            statusEl.style.color = '#4CAF50';
            btn.style.display = 'none';
        } else {
            statusEl.textContent = "Complete today's challenge for bonus points!";
            statusEl.style.color = '#333';
            btn.style.display = 'block';
        }
    }

    verifyChallenge() {
        if (!this.isGameCompleted()) return false;
        
        const challenge = localStorage.getItem('currentDailyChallenge') || '';
        const score = parseInt(localStorage.getItem('latestScore') || '0');
        const gameTime = parseInt(localStorage.getItem('gameTime') || '0');
        
        if (challenge.includes('90%') && score >= 90) return true;
        if (challenge.includes('under 5 minutes') && gameTime <= 300) return true;
        if (challenge.includes('hidden objects') && localStorage.getItem('foundAllObjects') === 'true') return true;
        if (challenge.includes('no mistakes') && localStorage.getItem('quizMistakes') === '0') return true;
        if (challenge.includes('social media') && localStorage.getItem('certificateShared') === 'true') return true;
        
        return false;
    }

    completeDailyChallenge() {
        if (!this.verifyChallenge()) {
            alert("You haven't completed the challenge requirements yet!");
            return;
        }
        
        const today = new Date().toDateString();
        localStorage.setItem('dailyChallengeCompleted', today);
        
        const currentPoints = parseInt(localStorage.getItem('bonusPoints') || '0');
        localStorage.setItem('bonusPoints', (currentPoints + 50).toString());
        
        this.updateChallengeUI();
        alert('Challenge completed! 50 bonus points awarded.');
    }

    /* CERTIFICATE FUNCTIONS */
    generateCertificate(skipValidation = false) {
        try {
            // Create canvas
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 600;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                console.error("Could not get canvas context");
                return;
            }
            
            // Background with gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#f8f4ff');
            gradient.addColorStop(1, '#e8f4ff');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Decorative border
            ctx.strokeStyle = '#6e48aa';
            ctx.lineWidth = 15;
            ctx.strokeRect(25, 25, canvas.width - 50, canvas.height - 50);
            
            // Title with emoji
            ctx.fillStyle = '#6e48aa';
            ctx.font = 'bold 40px "Comic Sans MS", cursive, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🌟 Certificate of Participation 🌟', canvas.width/2, 100);
            
            // Main content
            ctx.fillStyle = '#333';
            ctx.font = '24px "Comic Sans MS", cursive, sans-serif';
            ctx.fillText('This certificate is awarded to:', canvas.width/2, 180);
            
            // Player name or generic text
            const playerName = localStorage.getItem('playerName') || 'Valued Participant';
            ctx.font = 'bold 28px "Comic Sans MS", cursive, sans-serif';
            ctx.fillStyle = '#6e48aa';
            ctx.fillText(playerName, canvas.width/2, 230);
            
            ctx.fillStyle = '#333';
            ctx.font = '22px "Comic Sans MS", cursive, sans-serif';
            ctx.fillText('For showing interest in gender awareness', canvas.width/2, 280);
            ctx.fillText('and completing activities with EqualPlay', canvas.width/2, 320);
            
            // Only show score if game was completed
            if (this.isGameCompleted()) {
                const score = localStorage.getItem('latestScore') || '0';
                ctx.fillText(`Achievement Score: ${score}`, canvas.width/2, 370);
            }
            
            // EqualPlay team mention
            ctx.fillStyle = '#6e48aa';
            ctx.font = 'italic 20px "Comic Sans MS", cursive, sans-serif';
            ctx.fillText('Presented by the EqualPlay Team', canvas.width/2, 450);
            
            // Date
            ctx.fillStyle = '#666';
            ctx.font = '18px "Comic Sans MS", cursive, sans-serif';
            ctx.fillText(new Date().toLocaleDateString(), canvas.width/2, 500);
            
            // Decorative elements
            this.drawDecorativeElements(ctx, canvas);
            
            // Display preview
            const preview = document.getElementById('certificatePreview');
            if (preview) {
                preview.innerHTML = '';
                preview.appendChild(canvas);
                preview.style.display = 'block';
            }
            
            // Enable download
            const downloadBtn = document.getElementById('downloadCertificate');
            if (downloadBtn) {
                downloadBtn.disabled = false;
            }
            
            this.canvas = canvas;
            this.certificateGenerated = true;
            localStorage.setItem('certificateGenerated', 'true');
            
            return true;
        } catch (err) {
            console.error("Error generating certificate:", err);
            return false;
        }
    }

    drawDecorativeElements(ctx, canvas) {
        // Draw colorful shapes
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(100, 100, 30, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.arc(700, 100, 30, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#7CFC00';
        ctx.beginPath();
        ctx.arc(100, 500, 30, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FF6347';
        ctx.beginPath();
        ctx.arc(700, 500, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw confetti
        for (let i = 0; i < 20; i++) {
            ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
            ctx.fillRect(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                5, 5
            );
        }
    }

    downloadCertificate() {
        try {
            if (!this.certificateGenerated || !this.canvas) {
                alert('Please generate your certificate first!');
                return false;
            }
            
            const dataUrl = this.canvas.toDataURL('image/png');
            if (!dataUrl || dataUrl === 'data:,') {
                console.error("Failed to get data URL from canvas");
                if (this.generateCertificate(true)) {
                    setTimeout(() => this.downloadCertificate(), 300);
                }
                return false;
            }
            
            const link = document.createElement('a');
            link.download = 'EqualPlay_Certificate.png';
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            return true;
        } catch (err) {
            console.error("Error downloading certificate:", err);
            return false;
        }
    }
}