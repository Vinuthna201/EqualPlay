// Fix for "Get AI Business Idea" button
document.getElementById('getSuggestion').addEventListener('click', async function() {
    try {
        // Fallback suggestions if API fails
        const fallbackSuggestions = [
            "Create a mentorship platform connecting women in tech with experienced professionals",
            "Develop a mobile app that teaches kids about gender equality through interactive games",
            "Start a co-working space designed for women entrepreneurs with childcare facilities",
            "Launch a podcast highlighting stories of people breaking gender stereotypes",
            "Create a subscription box featuring products from women-owned businesses"
        ];
        
        // Try to fetch from API first
        let response;
        try {
            response = await fetch('http://localhost:5000/api/suggestions/get');
            if (response.ok) {
                const data = await response.json();
                document.getElementById('suggestionText').innerText = `💡 ${data.suggestion.category}: ${data.suggestion.idea}`;
                return;
            }
        } catch (e) {
            console.log("Using fallback suggestions");
        }
        
        // Use fallback if API fails
        const randomSuggestion = fallbackSuggestions[Math.floor(Math.random() * fallbackSuggestions.length)];
        document.getElementById('suggestionText').innerText = `💡 Business Idea: ${randomSuggestion}`;
        
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        document.getElementById('suggestionText').innerText = "⚠️ Couldn't load suggestions. Please try again.";
    }
});

// Fix for "Speak Your Answer" button
document.getElementById('voiceButton').addEventListener('click', function() {
    try {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            document.getElementById("chatbotResponse").innerText = 
                "⚠️ Speech recognition not supported in your browser. Try Chrome or Edge.";
            return;
        }

        let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.start();

        document.getElementById("chatbotResponse").innerText = "Listening... Speak now!";

        recognition.onresult = function(event) {
            let userSpeech = event.results[0][0].transcript.toLowerCase();
            let responseText = "";

            if (userSpeech.includes("encourage") || userSpeech.includes("support") || 
                userSpeech.includes("yes") || userSpeech.includes("agree")) {
                responseText = "Great choice! Supporting gender equality makes a difference.";
            } else if (userSpeech.includes("ignore") || userSpeech.includes("no") || 
                       userSpeech.includes("disagree")) {
                responseText = "Think again! Everyone benefits from gender equality.";
            } else {
                responseText = `I heard: "${userSpeech}". Try saying "support equality" or "challenge stereotypes".`;
            }

            document.getElementById("chatbotResponse").innerText = responseText;
            
            // Try to speak the response if supported
            if ('speechSynthesis' in window) {
                let speech = new SpeechSynthesisUtterance(responseText);
                speech.lang = 'en-US';
                window.speechSynthesis.speak(speech);
            }
        };

        recognition.onerror = function(event) {
            document.getElementById("chatbotResponse").innerText = 
                "Error recognizing speech: " + event.error;
        };

    } catch (error) {
        console.error("Voice recognition error:", error);
        document.getElementById("chatbotResponse").innerText = 
            "Error setting up voice recognition. Please try again.";
    }
});