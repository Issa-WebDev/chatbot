const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  displayContent();
});

// AFFICHER LES INFORMATIONS RECU
async function displayContent() {
  const userMessage = document.createElement("div");
  userMessage.className = "message user";
  userMessage.innerHTML = `<div class="message-content">${userInput.value}</div>`;
  chatBox.appendChild(userMessage);

  const botMessage = document.createElement("div");
  botMessage.className = "message bot";
  botMessage.innerHTML = `<div class="message-content">...</div>`;
  chatBox.appendChild(botMessage);

  try {
    const result = await getResponse();
    if (result && result.candidates && result.candidates.length > 0) {
      botMessage.innerHTML = `<div class="message-content">${result.candidates[0].content.parts[0].text}</div>`;
    } else {
      botMessage.innerHTML = `<div class="message-content">Je n'ai pas compris la question, mais assure-toi que ta question porte sur le football.</div>`;
    }

    chatBox.appendChild(botMessage);
  } catch (error) {
    chatBox.removeChild(botMessage);
    botMessage.innerHTML = `<div class="message-content">Erreur: ${error.message}</div>`;
    chatBox.appendChild(botMessage);
  }

  userInput.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}

// FAIRE LA REQUÊTES
async function getResponse() {
  const apiKey = "AIzaSyAmzItPdnxMCDJnI8GohFnz3AS9-M6gavA"; // Gemini API KEY
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  // Corps de la requête API avec le contexte
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: "Tu es un expert en footaball. Réponds uniquement aux questions sur le football de manière précise et soit moyenne pas verbeux.",
          },
          { text: userInput.value }, // Question de l'utilisateur
        ],
      },
    ],
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}
