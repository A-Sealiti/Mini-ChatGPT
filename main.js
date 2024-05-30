document.addEventListener("DOMContentLoaded", function () {
  const chatbox = document.getElementById("chatbox");
  const inputField = document.getElementById("input-field");
  const sendBtn = document.getElementById("send-button");
  const newChatBtn = document.getElementById("new-conversation");

  sendBtn.addEventListener("click", function () {
      sendMessage();
  });

  inputField.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
          event.preventDefault();
          sendMessage();
      }
  });

  newChatBtn.addEventListener("click", function () {
      startNewChat();
  });

  function appendMessage(sender, message) {
      const messageContainer = document.createElement("div");
      messageContainer.classList.add("chat-message");

      const senderHeading = document.createElement("h1");
      senderHeading.textContent = sender;

      const messageParagraph = document.createElement("p");
      messageParagraph.innerHTML = message;

      messageContainer.appendChild(senderHeading);
      messageContainer.appendChild(messageParagraph);
      chatbox.appendChild(messageContainer);

      chatbox.scrollTop = chatbox.scrollHeight;
  }
  function startNewChat() {
    // Vernieuw de pagina om een nieuw gesprek te starten
    location.reload();
}
  async function fetchDataFromNewsAPI() {
      const apiKey = "4ac0518c4f96404f8f701ad9c7e0ba46";
      const newsApiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

      try {
          const response = await fetch(newsApiUrl);
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();

          if (data.articles && data.articles.length > 0) {
              return data.articles;
          } else {
              console.warn("Geen nieuwsartikelen gevonden.");
              return [];
          }
      } catch (error) {
          console.error("Error fetching news data:", error.message);
          throw new Error("Er is een fout opgetreden bij het ophalen van nieuwsgegevens.");
      }
  }

  async function fetchWeatherForLocation(location) {
      const apiKey = "78c81abbf1";
      const weatherApiUrl = `https://weerlive.nl/api/json-data-10min.php?locatie=${location}&key=${apiKey}&contentType=json`;

      try {
          const response = await fetch(weatherApiUrl);
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Weather data:", data);

          if (data.liveweer && data.liveweer.length > 0) {
              const currentWeather = data.liveweer[0];
              const weatherResponse = `Het weer is momenteel ${currentWeather.samenv} in ${location} met een temperatuur van ${currentWeather.temp} graden Celsius.`;
              appendMessage("Bot", weatherResponse);
          } else {
              console.warn(`Geen weerinformatie gevonden voor ${location}.`);
              appendMessage("Bot", `Geen weerinformatie gevonden voor ${location}.`);
          }
      } catch (error) {
          console.error("Error fetching weather data:", error.message);
          appendMessage("Bot", "Er is een fout opgetreden bij het ophalen van weergegevens.");
      }
  }

  function processUserMessage(message) {
      const lowerCaseMessage = message.toLowerCase();

      if (lowerCaseMessage.includes("hallo") || lowerCaseMessage.includes("hey") || lowerCaseMessage.includes("hoi")) {
          const greetingResponse = "Hallo! Hoe kan ik je helpen vandaag?";
          appendMessage("Bot", greetingResponse);
      } else if (lowerCaseMessage.includes("goedenmorgen")) {
          const greetingResponse = "Goedemorgen! Hoe kan ik je helpen vandaag?";
          appendMessage("Bot", greetingResponse);
      } else if (lowerCaseMessage.includes("goedendag")) {
          const greetingResponse = "Goedendag! Hoe kan ik je helpen vandaag?";
          appendMessage("Bot", greetingResponse);
      } else if (lowerCaseMessage.includes("goedeavond")) {
          const greetingResponse = "Goedeavond! Hoe kan ik je helpen vandaag?";
          appendMessage("Bot", greetingResponse);
      } else if (lowerCaseMessage.includes("weer")) {
          const locationMatch = lowerCaseMessage.match(/in\s+(\w+)/);
          if (locationMatch && locationMatch[1]) {
              const requestedLocation = locationMatch[1];
              fetchWeatherForLocation(requestedLocation);
          } else {
              appendMessage("Bot", "Voor welke locatie wil je het weer weten?");
          }
      } else if (lowerCaseMessage.includes("nieuws")) {
          fetchDataFromNewsAPI().then(articles => {
              // Toon alleen de Nederlandse nieuwsartikelen
              const dutchArticles = articles.filter(article => article.title && article.description);

              if (dutchArticles.length > 0) {
                  dutchArticles.forEach((article, index) => {
                      const formattedArticle = `${index + 1}. ${article.title}: ${article.description}`;
                      appendMessage("Bot", formattedArticle);
                  });
              } else {
                  console.warn("Geen Nederlandse nieuwsartikelen gevonden.");
                  appendMessage("Bot", "Geen Nederlandse nieuwsartikelen gevonden.");
              }
          }).catch(error => {
              console.error("Error fetching news data:", error.message);
              const errorMessage = "Er is een fout opgetreden bij het ophalen van nieuwsgegevens.";
              appendMessage("Bot", errorMessage);
          });
          const defaultResponse = "Sorry, ik begrijp die vraag niet.";
          appendMessage("Bot", defaultResponse);
      }
  }

  function sendMessage() {
      const userMessage = inputField.value.trim();
      if (userMessage !== "") {
          appendMessage("User", userMessage);
          inputField.value = "";

          processUserMessage(userMessage);
      }
  }
});
