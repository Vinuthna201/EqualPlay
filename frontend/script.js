// ========== GAME INITIALIZATION ========== //
document.getElementById('startGame').addEventListener('click', function() {
    document.getElementById('startGame').style.display = 'none';
    document.getElementById('characterSelection').classList.remove('hidden');
    updateText();
});

// ========== CHARACTER SELECTION ========== //
let selectedCharacter = null;
let currentUsername = null;
document.getElementById('boyCharacter').addEventListener('click', () => selectCharacter('boy'));
document.getElementById('girlCharacter').addEventListener('click', () => selectCharacter('girl'));
document.getElementById('teacherCharacter').addEventListener('click', () => selectCharacter('teacher'));
document.getElementById('parentCharacter').addEventListener('click', () => selectCharacter('parent'));

function selectCharacter(character) {
    selectedCharacter = character;
    document.getElementById('characterSelection').classList.add('hidden');
    
    if (!currentUsername) {
        currentUsername = prompt("Please enter your name for the leaderboard:");
        if (!currentUsername) currentUsername = "Anonymous";
    }
    
    document.getElementById('questionContainer').classList.remove('hidden');
    startGameSession();
}

function updateText() {
    document.getElementById('gameTitle').innerText = "Gender Sensitivity & Awareness Game";
    document.getElementById('gameDescription').innerText = "Make choices and learn about gender equality!";
    document.getElementById('characterSelectionTitle').innerText = "Choose Your Character:";
    document.getElementById('quizTitle').innerText = "Quiz Time!";
}

// ========== GAME STATE ========== //
let currentScenario = 0;
let totalPoints = 0;
let dailyChallengeCompleted = false;

checkDailyChallenge();

// ========== AI QUESTION SYSTEM ========== //
async function startGameSession() {
    totalPoints = 0;
    currentScenario = 0;
    updateProgressBar();
    await loadAIScenario();
}

async function loadAIScenario() {
    try {
        showLoading(true);
        const response = await fetch(`http://localhost:5000/api/questions/generate?character=${selectedCharacter}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const scenario = await response.json();
        
        const oldFeedback = document.querySelector('.feedback-container');
        if (oldFeedback) oldFeedback.remove();

        document.getElementById('questionText').innerHTML = scenario.question;
        document.getElementById('optionA').innerText = scenario.options.A.text;
        document.getElementById('optionB').innerText = scenario.options.B.text;

        document.getElementById('optionA').dataset.feedback = scenario.options.A.feedback || "Good choice!";
        document.getElementById('optionB').dataset.feedback = scenario.options.B.feedback || "Think about how this might reinforce stereotypes.";

        document.getElementById('optionA').onclick = () => handleAIChoice(scenario.options.A.points, 'optionA');
        document.getElementById('optionB').onclick = () => handleAIChoice(scenario.options.B.points, 'optionB');
        
        if (scenario.context) {
            const contextElement = document.createElement('div');
            contextElement.className = 'context-info';
            contextElement.textContent = scenario.context;
            document.getElementById('questionText').appendChild(contextElement);
        }
    } catch (error) {
        console.error('Error loading AI question:', error);
        
        const fallbackQuestions = {
            boy: {
                question: "You hear someone say 'Boys don't cry'. What do you do?",
                options: {
                    A: {
                        text: "Say that everyone has emotions and it's okay to express them",
                        points: 10,
                        feedback: "Great! Challenging stereotypes helps create a more inclusive environment."
                    },
                    B: {
                        text: "Ignore it, it's just how people talk",
                        points: 0,
                        feedback: "Silence can reinforce harmful stereotypes. Speaking up makes a difference."
                    }
                },
                context: "Gender stereotypes can be harmful to emotional development."
            },
            girl: {
                question: "A classmate says girls aren't good at math. How do you respond?",
                options: {
                    A: {
                        text: "Share examples of successful women in STEM fields",
                        points: 10,
                        feedback: "Excellent! Representation matters in breaking stereotypes."
                    },
                    B: {
                        text: "Don't say anything to avoid conflict",
                        points: 0,
                        feedback: "Not responding can make it seem like you agree with the stereotype."
                    }
                },
                context: "Gender stereotypes in education can limit opportunities."
            }
        };
        
        const fallback = fallbackQuestions[selectedCharacter] || fallbackQuestions.boy;
        document.getElementById('questionText').innerHTML = fallback.question;
        document.getElementById('optionA').innerText = fallback.options.A.text;
        document.getElementById('optionB').innerText = fallback.options.B.text;
        document.getElementById('optionA').dataset.feedback = fallback.options.A.feedback;
        document.getElementById('optionB').dataset.feedback = fallback.options.B.feedback;
        document.getElementById('optionA').onclick = () => handleAIChoice(fallback.options.A.points, 'optionA');
        document.getElementById('optionB').onclick = () => handleAIChoice(fallback.options.B.points, 'optionB');
        
        if (fallback.context) {
            const contextElement = document.createElement('div');
            contextElement.className = 'context-info';
            contextElement.textContent = fallback.context;
            document.getElementById('questionText').appendChild(contextElement);
        }
    } finally {
        showLoading(false);
    }
}

function handleAIChoice(points, optionId) {
    const selectedButton = document.getElementById(optionId);
    const feedback = selectedButton.dataset.feedback;
    
    const oldFeedback = document.querySelector('.feedback-container');
    if (oldFeedback) oldFeedback.remove();

    const feedbackContainer = document.createElement('div');
    feedbackContainer.className = 'feedback-container';
    
    feedbackContainer.innerHTML = `
        <div class="feedback-message">${feedback}</div>
        <button class="continue-button">Continue</button>
    `;
    
    const questionContainer = document.getElementById('questionContainer');
    questionContainer.appendChild(feedbackContainer);

    selectedButton.classList.add('selected-choice');
    document.getElementById(optionId === 'optionA' ? 'optionB' : 'optionA').classList.add('unselected-choice');

    feedbackContainer.querySelector('.continue-button').addEventListener('click', async () => {
        totalPoints += points;
        updateProgressBar();
        currentScenario++;
        
        try {
            await fetch('http://localhost:5000/api/responses/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: currentUsername,
                    choice: `${optionId} ${points}`,
                    score: totalPoints
                })
            });
        } catch (error) {
            console.error('Error saving response:', error);
        }
        
        if (points > 0) {
            showPositiveReinforcement();
        }
        
        document.getElementById('optionA').classList.remove('selected-choice', 'unselected-choice');
        document.getElementById('optionB').classList.remove('selected-choice', 'unselected-choice');
        
        if (totalPoints >= 50) {
            endGame();
        } else {
            loadAIScenario();
        }
    });
}

function endGame() {
    const gameOverHTML = `
        <div id="gameOverScreen">
            <h2>Game Completed!</h2>
            <p>Your final score: ${totalPoints}</p>
            <button id="restartGame">Play Again</button>
        </div>
    `;
    
    document.getElementById('questionContainer').innerHTML = gameOverHTML;
    document.getElementById('restartGame').addEventListener('click', () => {
        document.getElementById('questionContainer').innerHTML = `
            <p id="questionText"></p>
            <button id="optionA"></button>
            <button id="optionB"></button>
        `;
        startGameSession();
    });
    
     // Save score and trigger certificate availability
     localStorage.setItem('latestScore', totalPoints);
     localStorage.setItem('gameCompleted', 'true');
     const gameCompletedEvent = new Event('gameCompleted');
     document.dispatchEvent(gameCompletedEvent);

    showLeaderboard();
}

// ========== LEADERBOARD ========== //
async function showLeaderboard() {
    try {
        const response = await fetch('http://localhost:5000/api/responses/leaderboard');
        const data = await response.json();
        
        let leaderboardContainer = document.getElementById('leaderboardContainer');
        if (!leaderboardContainer) {
            leaderboardContainer = document.createElement('div');
            leaderboardContainer.id = 'leaderboardContainer';
            leaderboardContainer.className = 'leaderboard-container';
            document.querySelector('.game-container').appendChild(leaderboardContainer);
        }
        
        leaderboardContainer.innerHTML = `
            <h3>🏆 Leaderboard</h3>
            <table class="leaderboard">
                <tr><th>Rank</th><th>Player</th><th>Score</th></tr>
                ${data.map((entry, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${entry.username}</td>
                        <td>${entry.score}</td>
                    </tr>
                `).join('')}
            </table>
        `;
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
}

// ========== DAILY CHALLENGE ========== //
function checkDailyChallenge() {
    const lastPlayed = localStorage.getItem('lastPlayed');
    const today = new Date().toDateString();
    dailyChallengeCompleted = localStorage.getItem('dailyChallengeCompleted') === 'true';
    
    if (lastPlayed !== today) {
        localStorage.setItem('lastPlayed', today);
        localStorage.setItem('dailyChallengeCompleted', 'false');
        dailyChallengeCompleted = false;
    }
    
    if (!dailyChallengeCompleted) {
        showDailyChallenge();
    }
}

function showDailyChallenge() {
    const challengeContainer = document.createElement('div');
    challengeContainer.className = 'daily-challenge';
    challengeContainer.innerHTML = `
        <h3>🌟 Daily Challenge 🌟</h3>
        <p>Complete today's special challenge for bonus points!</p>
        <button id="startChallenge">Start Challenge</button>
    `;
    document.querySelector('.game-container').prepend(challengeContainer);
    
    document.getElementById('startChallenge').addEventListener('click', function() {
        startDailyChallenge();
        challengeContainer.remove();
    });
}

function startDailyChallenge() {
    alert("Daily Challenge: Answer 3 questions correctly in a row for bonus points!");
    let correctAnswersNeeded = 3;
    let correctAnswers = 0;
    
    const originalHandleChoice = handleAIChoice;
    
    handleAIChoice = function(points, optionId) {
        if (points > 0) {
            correctAnswers++;
            if (correctAnswers >= correctAnswersNeeded) {
                alert("Challenge Completed! You earned 20 bonus points!");
                totalPoints += 20;
                updateProgressBar();
                dailyChallengeCompleted = true;
                localStorage.setItem('dailyChallengeCompleted', 'true');
                handleAIChoice = originalHandleChoice;
            }
        } else {
            correctAnswers = 0;
        }
        
        originalHandleChoice(points, optionId);
    };
}

// ========== VISUAL FEEDBACK ========== //
function showPositiveReinforcement() {
    const messages = [
        "Great choice!",
        "You're promoting equality!",
        "Excellent decision!",
        "That's progressive thinking!"
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    const floatMsg = document.createElement('div');
    floatMsg.className = 'floating-message';
    floatMsg.textContent = message;
    document.body.appendChild(floatMsg);
    
    setTimeout(() => floatMsg.remove(), 2000);
}

function showLoading(show) {
    const loader = document.getElementById('loadingIndicator') || createLoader();
    loader.style.display = show ? 'block' : 'none';
}

function createLoader() {
    const loader = document.createElement('div');
    loader.id = 'loadingIndicator';
    loader.className = 'loading-indicator';
    loader.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loader);
    return loader;
}

// ========== PROGRESS SYSTEM ========== //
function updateProgressBar() {
    const percentage = Math.min((totalPoints / 50) * 100, 100);
    document.getElementById('progressBar').style.width = percentage + "%";
    
    if (totalPoints >= 40) {
        showConfetti();
    }
}

// ========== EXISTING FUNCTIONALITIES ========== //
document.getElementById('voiceButton').addEventListener('click', function() {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = function(event) {
        let userSpeech = event.results[0][0].transcript.toLowerCase();
        let responseText = "";

        if (userSpeech.includes("encourage") || userSpeech.includes("support")) {
            responseText = "Great choice! Supporting others leads to equality.";
            handleAIChoice(10, 'optionA');
        } else if (userSpeech.includes("ignore") || userSpeech.includes("agree")) {
            responseText = "Think again! Gender equality starts with you.";
            handleAIChoice(0, 'optionB');
        } else {
            responseText = "I didn't understand that. Please say 'Encourage' or 'Ignore'.";
        }

        document.getElementById("chatbotResponse").innerText = responseText;
        speakText(responseText);
    };
});

function speakText(text) {
    let speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.rate = 1.0;
    window.speechSynthesis.speak(speech);
}

document.getElementById('getSuggestion').addEventListener('click', async function() {
    try {
        let response = await fetch('http://localhost:5000/api/suggestions/get');
        let data = await response.json();
        document.getElementById('suggestionText').innerText = `💡 ${data.suggestion.category}: ${data.suggestion.idea}`;
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
});

function showConfetti() {
    let confettiContainer = document.createElement("div");
    confettiContainer.id = "confetti";
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 100; i++) {
        let confettiPiece = document.createElement("div");
        confettiPiece.className = "confetti-piece";
        confettiContainer.appendChild(confettiPiece);
    }

    setTimeout(() => {
        confettiContainer.remove();
    }, 5000);
}

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("authToken");
    const protectedPages = ["index.html"];
    const currentPage = window.location.pathname.split("/").pop();
    
    if (!token && protectedPages.includes(currentPage)) {
        window.location.href = "login.html";
    }
});

// Add this at the end of the endGame function in script.js
localStorage.setItem('gameEnded', 'true');
const gameEndEvent = new Event('gameEnded');
document.dispatchEvent(gameEndEvent);