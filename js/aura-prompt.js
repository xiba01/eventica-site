// AURA Quick Help Buttons with Animated Text Output

document.addEventListener("DOMContentLoaded", function () {
  // Initialize AURA prompt buttons
  initAuraPromptButtons();
});

// Mock responses for predefined questions
const auraMockResponses = {
  "What are my top 3 priority tasks?":
    "Okay, Mostafa! Your top 3 priority tasks are:\n1. Finalize Speaker Contracts - AI Summit (Due: Jan 20)\n2. Send out Wave 2 Marketing Emails - Tech Conference (Due: Jan 22)\n3. Review Venue Options for Startup Pitch Night (Due: Jan 25)",
  "Show budget status for 'AI Summit 2024'":
    "The 'AI Summit 2024' budget is currently 65% utilized. Key spending areas are Venue Booking and Speaker Fees. You are on track overall.",
  "Suggest a theme for a small workshop":
    "How about 'Unlocking Creativity with Generative AI Tools'? It's engaging for a small workshop format. I can draft a sample agenda if you like!",
  "Any overdue items?":
    "You currently have 1 overdue task: 'Confirm Catering Menu - AI Summit'. I've highlighted it in your task list.",
};

// Initialize AURA prompt buttons
function initAuraPromptButtons() {
  const promptButtons = document.querySelectorAll(".aura-prompt-btn");
  const responseContainer = document.querySelector(".aura-response-container");
  const responseText = document.getElementById("aura-response-text");
  const commandInput = document.getElementById("aura-command-input");

  if (!promptButtons.length || !responseContainer || !responseText) {
    console.error("Required AURA prompt elements not found");
    return;
  }

  promptButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const question = this.dataset.question;

      // Optionally populate the input field with the question
      if (commandInput) {
        commandInput.value = question;
      }

      // Get the corresponding response
      const response =
        auraMockResponses[question] ||
        "I'm still learning how to respond to that. Try another prompt!";

      // Display the response with typing effect
      displayAuraResponse(response);
    });
  });
}

// Display AURA response with typing effect
function displayAuraResponse(text) {
  const responseContainer = document.querySelector(".aura-response-container");
  const responseText = document.getElementById("aura-response-text");

  if (!responseContainer || !responseText) return;

  // Make container visible with flex display
  responseContainer.style.display = "flex";

  // Clear previous text and animation
  responseText.innerHTML = "";
  if (window.auraTypingTimeout) {
    clearTimeout(window.auraTypingTimeout);
  }

  // Add visible class after a slight delay to trigger animation
  setTimeout(() => {
    responseContainer.classList.add("visible");
  }, 10);

  // Start typing effect
  let i = 0;
  const speed = 30; // milliseconds per character

  function typeWriter() {
    if (i < text.length) {
      responseText.innerHTML += text.charAt(i);
      i++;
      window.auraTypingTimeout = setTimeout(typeWriter, speed);
    }
  }

  // Reset index and start typing
  i = 0;
  window.auraTypingTimeout = setTimeout(typeWriter, speed);
}
