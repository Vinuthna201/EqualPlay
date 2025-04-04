// AVATAR CUSTOMIZATION SYSTEM
class AvatarCreator {
    constructor() {
      this.avatar = {
        skin: '#FFDBAC',
        hair: '#000000',
        top: '#3498db',
        accessory: 'none'
      };
      this.initAvatarUI();
    }
  
    initAvatarUI() {
      // Create avatar customization panel
      const aiSuggestionsDiv = document.querySelector('.ai-suggestions');
      const avatarHTML = `
        <div class="avatar-section">
          <h3>👤 Customize Your Avatar</h3>
          <div class="avatar-preview" id="avatarPreview"></div>
          <div class="avatar-controls">
            <label>Skin: <input type="color" id="skinColor" value="#FFDBAC"></label>
            <label>Hair: <input type="color" id="hairColor" value="#000000"></label>
            <label>Top: <input type="color" id="topColor" value="#3498db"></label>
            <label>Accessory: 
              <select id="avatarAccessory">
                <option value="none">None</option>
                <option value="glasses">Glasses</option>
                <option value="hat">Hat</option>
                <option value="scarf">Scarf</option>
              </select>
            </label>
            <button id="saveAvatar">Save Avatar</button>
          </div>
        </div>
      `;
      aiSuggestionsDiv.insertAdjacentHTML('afterend', avatarHTML);
      
      // Initialize event listeners
      document.getElementById('skinColor').addEventListener('input', (e) => this.updateAvatar('skin', e.target.value));
      document.getElementById('hairColor').addEventListener('input', (e) => this.updateAvatar('hair', e.target.value));
      document.getElementById('topColor').addEventListener('input', (e) => this.updateAvatar('top', e.target.value));
      document.getElementById('avatarAccessory').addEventListener('change', (e) => this.updateAvatar('accessory', e.target.value));
      document.getElementById('saveAvatar').addEventListener('click', () => this.saveAvatar());
      
      // Render initial avatar
      this.renderAvatar();
    }
  
    updateAvatar(part, value) {
      this.avatar[part] = value;
      this.renderAvatar();
    }
  
    renderAvatar() {
      const avatarPreview = document.getElementById('avatarPreview');
      avatarPreview.innerHTML = `
        <div class="avatar-head" style="background-color: ${this.avatar.skin}">
          <div class="avatar-hair" style="background-color: ${this.avatar.hair}"></div>
          ${this.avatar.accessory === 'glasses' ? '<div class="avatar-glasses"></div>' : ''}
          ${this.avatar.accessory === 'hat' ? '<div class="avatar-hat"></div>' : ''}
          ${this.avatar.accessory === 'scarf' ? '<div class="avatar-scarf"></div>' : ''}
        </div>
        <div class="avatar-body" style="background-color: ${this.avatar.top}"></div>
      `;
    }
  
    saveAvatar() {
      localStorage.setItem('userAvatar', JSON.stringify(this.avatar));
      alert('Avatar saved! It will be used in your game profile.');
    }
  }
  
  // AI CHATBOT SYSTEM
  class GenderAIChatbot {
    constructor() {
      this.initChatbotUI();
      this.setupEventListeners();
    }
  
    initChatbotUI() {
      const chatbotDiv = document.querySelector('.chatbot');
      const chatbotHTML = `
        <div class="ai-chatbot">
          <h3>🤖 Gender Awareness Assistant</h3>
          <div id="chatbotHistory" class="chatbot-history"></div>
          <input type="text" id="chatbotInput" placeholder="Ask about gender equality...">
          <button id="askChatbot">Ask</button>
        </div>
      `;
      chatbotDiv.insertAdjacentHTML('afterend', chatbotHTML);
    }
  
    setupEventListeners() {
      document.getElementById('askChatbot').addEventListener('click', () => this.handleQuestion());
      document.getElementById('chatbotInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleQuestion();
      });
    }
  
    async handleQuestion() {
      const input = document.getElementById('chatbotInput');
      const question = input.value.trim();
      if (!question) return;
  
      this.addMessage(question, 'user');
      input.value = '';
  
      try {
        // Try to use Cohere AI first
        const response = await this.fetchCohereResponse(question);
        this.addMessage(response, 'bot');
      } catch (error) {
        console.error('Cohere error:', error);
        // Fallback to local responses if API fails
        const fallbackResponse = this.getFallbackResponse(question);
        this.addMessage(fallbackResponse, 'bot');
      }
    }
  
    async fetchCohereResponse(question) {
      // In a real implementation, you would call your Cohere API endpoint
      // For now, we'll simulate it with a timeout and fallback
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const responses = [
            "Gender equality means equal rights and opportunities for all genders.",
            "A common stereotype is that women are less capable in STEM fields, which is completely false.",
            "You can promote equality by challenging biased language when you hear it.",
            "Intersectionality considers how gender overlaps with other identities like race and class."
          ];
          resolve(responses[Math.floor(Math.random() * responses.length)]);
        }, 1000);
      });
    }
  
    getFallbackResponse(question) {
      const lowerQuestion = question.toLowerCase();
      if (lowerQuestion.includes('equality')) {
        return "Gender equality means all people have equal rights, responsibilities and opportunities regardless of gender.";
      } else if (lowerQuestion.includes('stereotype')) {
        return "Stereotypes are oversimplified ideas about groups of people. For example, 'boys don't cry' is a harmful stereotype about masculinity.";
      } else if (lowerQuestion.includes('help') || lowerQuestion.includes('what')) {
        return "I can answer questions about gender equality, stereotypes, and how to promote fairness in daily life.";
      } else {
        return "That's an interesting question about gender awareness. While I can't answer specifically, I recommend checking reputable sources like UN Women for more information.";
      }
    }
  
    addMessage(text, sender) {
      const history = document.getElementById('chatbotHistory');
      const message = document.createElement('div');
      message.className = `chat-message ${sender}`;
      message.textContent = text;
      history.appendChild(message);
      history.scrollTop = history.scrollHeight;
    }
  }
  
  // STYLES FOR THE NEW COMPONENTS
  const style = document.createElement('style');
  style.textContent = `
    /* Avatar Styles */
    .avatar-section {
      margin-top: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 10px;
    }
    
    .avatar-preview {
      width: 100px;
      height: 150px;
      margin: 10px auto;
      position: relative;
    }
    
    .avatar-head {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin: 0 auto;
      position: relative;
    }
    
    .avatar-hair {
      width: 90px;
      height: 40px;
      border-radius: 50% 50% 0 0;
      position: absolute;
      top: -15px;
      left: -5px;
    }
    
    .avatar-body {
      width: 70px;
      height: 50px;
      margin: 5px auto 0;
      border-radius: 10px 10px 0 0;
    }
    
    .avatar-glasses {
      width: 60px;
      height: 10px;
      background: #333;
      position: absolute;
      top: 50px;
      left: 10px;
      border-radius: 5px;
    }
    
    .avatar-hat {
      width: 70px;
      height: 15px;
      background: #333;
      position: absolute;
      top: -10px;
      left: 5px;
      border-radius: 5px;
    }
    
    .avatar-scarf {
      width: 60px;
      height: 15px;
      background: #e74c3c;
      position: absolute;
      top: 70px;
      left: 10px;
      border-radius: 0 0 5px 5px;
    }
    
    .avatar-controls {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    
    .avatar-controls label {
      display: block;
      margin-bottom: 5px;
      font-size: 14px;
    }
    
    .avatar-controls input[type="color"] {
      width: 100%;
      height: 30px;
    }
    
    #saveAvatar {
      grid-column: span 2;
      margin-top: 10px;
    }
    
    /* Chatbot Styles */
    .ai-chatbot {
      margin-top: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 10px;
    }
    
    .chatbot-history {
      height: 150px;
      overflow-y: auto;
      margin-bottom: 10px;
      padding: 10px;
      background: white;
      border-radius: 5px;
      border: 1px solid #ddd;
    }
    
    .chat-message {
      margin-bottom: 10px;
      padding: 8px 12px;
      border-radius: 15px;
      max-width: 80%;
    }
    
    .chat-message.user {
      background: #007BFF;
      color: white;
      margin-left: auto;
      border-bottom-right-radius: 5px;
    }
    
    .chat-message.bot {
      background: #e9ecef;
      color: black;
      margin-right: auto;
      border-bottom-left-radius: 5px;
    }
    
    #chatbotInput {
      width: calc(100% - 70px);
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    
    #askChatbot {
      width: 60px;
      padding: 8px;
      background: #28a745;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);
  
  // Initialize both systems when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    new AvatarCreator();
    new GenderAIChatbot();
  });