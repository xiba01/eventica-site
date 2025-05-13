// AURA Dashboard Revamp JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // Set greeting based on time of day
  setGreeting();

  // Set current date and time
  setDateTime();

  // Initialize budget chart
  initBudgetChart();

  // Initialize AURA command input
  initAuraCommandInput();

  // Initialize carousel for AURA insights
  initInsightsCarousel();

  // Initialize task filtering
  initTaskFilters();

  // Add event listeners for suggestion chips
  initSuggestionChips();

  // Add checkbox event listeners for tasks
  initTaskCheckboxes();

  // Initialize AURA prompt buttons
  initAuraPromptButtons();
});

// Set greeting based on time of day
function setGreeting() {
  const hour = new Date().getHours();
  const greetingElement = document.getElementById("greeting");
  let greeting = "Good morning";

  if (hour >= 12 && hour < 17) {
    greeting = "Good afternoon";
  } else if (hour >= 17) {
    greeting = "Good evening";
  }

  if (greetingElement) {
    const userName =
      greetingElement.textContent.split(",")[1]?.trim() || "Mostafa";
    greetingElement.textContent = `${greeting}, ${userName}!`;
  }
}

// Set current date and time
function setDateTime() {
  const dateTimeElement = document.querySelector(".date-time-display");
  if (dateTimeElement) {
    const now = new Date();
    const options = { month: "long", day: "numeric", year: "numeric" };
    const dateStr = now.toLocaleDateString("en-US", options);
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    dateTimeElement.textContent = `${dateStr} - ${timeStr}`;
  }
}

// Initialize budget chart using Chart.js
function initBudgetChart() {
  const budgetChartCanvas = document.getElementById("budget-chart");
  if (budgetChartCanvas && typeof Chart !== "undefined") {
    const ctx = budgetChartCanvas.getContext("2d");
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Venues", "Catering", "Marketing", "Tech", "Remaining"],
        datasets: [
          {
            data: [38000, 23750, 19000, 14250, 30000],
            backgroundColor: [
              "#9d6eff",
              "#4b7bec",
              "#45aaf2",
              "#2ecc71",
              "#2c2c44",
            ],
            borderWidth: 0,
            cutout: "70%",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "#1a1a2e",
            titleColor: "#ffffff",
            bodyColor: "#e0e0e0",
            bodyFont: {
              family: "Inter, sans-serif",
            },
            titleFont: {
              family: "Inter, sans-serif",
            },
            padding: 12,
            displayColors: false,
            callbacks: {
              label: function (context) {
                const value = context.raw;
                return `$${value.toLocaleString()}`;
              },
            },
          },
        },
      },
    });
  }
}

// Initialize AURA command input functionality
function initAuraCommandInput() {
  const commandInput = document.getElementById("aura-command-input");
  const sendButton = document.querySelector(".aura-send-btn");
  const responseArea = document.getElementById("aura-response");

  if (commandInput && sendButton && responseArea) {
    // Function to process command
    const processCommand = () => {
      const command = commandInput.value.trim();
      if (!command) return;

      // Clear input
      commandInput.value = "";

      // Display processing state
      responseArea.innerHTML = `<em>Processing your request...</em>`;

      // Simulate response delay (would be an actual API call in production)
      setTimeout(() => {
        let response = "";

        // Simple response mapping for demo
        if (command.toLowerCase().includes("budget")) {
          response =
            "The total budget for all current events is $125,000. The AI Summit has $52,000 allocated, Tech Conference has $35,000, and Startup Pitch Night has $28,000. Would you like to see a detailed breakdown?";
        } else if (
          command.toLowerCase().includes("deadline") ||
          command.toLowerCase().includes("due")
        ) {
          response =
            "Your nearest deadline is finalizing the AI Summit speakers list, due tomorrow. After that, you need to review catering proposals for the Tech Conference in 3 days.";
        } else if (
          command.toLowerCase().includes("vendor") ||
          command.toLowerCase().includes("recommendation")
        ) {
          response =
            "Based on past events, I recommend Sound Spectrum Audio for the Tech Conference. They provided excellent service for your last two virtual events and offer a 10% discount for repeat customers.";
        } else if (
          command.toLowerCase().includes("task") ||
          command.toLowerCase().includes("priority")
        ) {
          response =
            "Top priorities: 1) Finalize AI Summit speakers (urgent - due tomorrow), 2) Review Tech Conference catering proposals (due in 3 days), 3) Coordinate marketing social media plan (due June 5).";
        } else {
          response =
            "I can help you with budget information, upcoming deadlines, vendor recommendations, and task priorities. Just let me know what you need!";
        }

        responseArea.textContent = response;
      }, 800);
    };

    // Event listeners
    sendButton.addEventListener("click", processCommand);
    commandInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        processCommand();
      }
    });
  }
}

// Initialize carousel for AURA insights
function initInsightsCarousel() {
  const slides = document.querySelectorAll(".insight-slide");
  const dots = document.querySelectorAll(".carousel-dot");
  let currentSlide = 0;

  if (slides.length && dots.length) {
    // Set initial active state
    showSlide(currentSlide);

    // Add click event listeners to dots
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentSlide = index;
        showSlide(currentSlide);
      });
    });

    // Auto-advance carousel every 8 seconds
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, 8000);

    // Function to show a specific slide
    function showSlide(index) {
      slides.forEach((slide) => {
        slide.classList.remove("active");
      });
      dots.forEach((dot) => {
        dot.classList.remove("active");
      });

      slides[index].classList.add("active");
      dots[index].classList.add("active");
    }
  }
}

// Initialize task filtering
function initTaskFilters() {
  const filterButtons = document.querySelectorAll(".task-filter");
  const taskItems = document.querySelectorAll(".task-item");

  if (filterButtons.length && taskItems.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Update active class on filter buttons
        filterButtons.forEach((btn) => {
          btn.classList.remove("active");
        });
        button.classList.add("active");

        // Get the filter value
        const filterValue = button.getAttribute("data-filter");

        // Show/hide tasks based on filter
        taskItems.forEach((task) => {
          if (filterValue === "all") {
            task.style.display = "flex";
          } else if (
            filterValue === "completed" &&
            task.querySelector(".task-checkbox").checked
          ) {
            task.style.display = "flex";
          } else if (
            filterValue === "urgent" &&
            task.classList.contains("urgent")
          ) {
            task.style.display = "flex";
          } else if (
            filterValue === "upcoming" &&
            !task.querySelector(".task-checkbox").checked &&
            !task.classList.contains("urgent")
          ) {
            task.style.display = "flex";
          } else {
            task.style.display = "none";
          }
        });
      });
    });
  }
}

// Initialize suggestion chips
function initSuggestionChips() {
  const suggestionChips = document.querySelectorAll(".suggestion-chip");
  const commandInput = document.getElementById("aura-command-input");
  const sendButton = document.querySelector(".aura-send-btn");

  if (suggestionChips.length && commandInput && sendButton) {
    suggestionChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        // Set the command input value to the chip text
        commandInput.value = chip.textContent;

        // Trigger the send button click
        sendButton.click();
      });
    });
  }
}

// Initialize task checkboxes
function initTaskCheckboxes() {
  const taskCheckboxes = document.querySelectorAll(".task-checkbox");

  if (taskCheckboxes.length) {
    taskCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        const taskItem = this.closest(".task-item");

        // If checked, move to bottom and update the due text
        if (this.checked) {
          // Get the task list
          const tasksList = document.querySelector(".tasks-list");

          // Move the task to the bottom
          tasksList.appendChild(taskItem);

          // Update the due text
          const dueText = taskItem.querySelector(".task-due");
          if (dueText) {
            dueText.textContent = "Completed";
          }
        }
      });
    });
  }
}

// Mock responses for AURA Quick Help buttons
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

// Display AURA response with typing animation
function displayAuraResponse(text) {
  const responseContainer = document.querySelector(".aura-response-container");
  const responseText = document.getElementById("aura-response-text");

  if (!responseContainer || !responseText) return;

  // Hide the default response area
  const defaultResponseArea = document.querySelector(".aura-response-area");
  if (defaultResponseArea) {
    defaultResponseArea.style.display = "none";
  }

  // Reset and show the response container
  responseText.textContent = "";
  responseContainer.style.display = "flex";

  // Add visible class for fade-in animation
  setTimeout(() => {
    responseContainer.classList.add("visible");
  }, 10);

  // Clear any ongoing typing animation
  if (window.auraTypingTimeout) {
    clearTimeout(window.auraTypingTimeout);
  }

  // Typing animation
  let i = 0;
  const speed = 30; // milliseconds per character

  function typeWriter() {
    if (i < text.length) {
      responseText.innerHTML += text.charAt(i);
      i++;
      window.auraTypingTimeout = setTimeout(typeWriter, speed);
    }
  }

  i = 0;
  window.auraTypingTimeout = setTimeout(typeWriter, speed);
}

// Function to initialize AURA prompt buttons
function initAuraPromptButtons() {
  const promptButtons = document.querySelectorAll(".aura-prompt-btn");
  const commandInput = document.getElementById("aura-command-input");

  if (promptButtons.length) {
    promptButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const question = button.dataset.question;

        // Optionally populate the command input
        if (commandInput) {
          commandInput.value = question;
        }

        // Get the response for this question
        const responseText =
          auraMockResponses[question] ||
          "I'm still learning how to respond to that. Try another prompt!";

        // Display the animated response
        displayAuraResponse(responseText);
      });
    });
  }
}

// Add event listeners for buttons
document.addEventListener("DOMContentLoaded", function () {
  // View all events button
  const viewAllEventsLink = document.querySelector(
    ".upcoming-events-enhanced .card-link"
  );
  if (viewAllEventsLink) {
    viewAllEventsLink.addEventListener("click", function (e) {
      e.preventDefault();

      // Find and click the events navigation link
      const eventsNavLink = document.querySelector(
        '.nav-links a[data-page="events"]'
      );
      if (eventsNavLink) {
        eventsNavLink.click();
      }
    });
  }

  // View budget breakdown button
  const viewBudgetBtn = document.querySelector(".view-breakdown");
  if (viewBudgetBtn) {
    viewBudgetBtn.addEventListener("click", function () {
      // This would open a modal or navigate to a detailed budget view
      // For now, we'll show an alert for demonstration
      alert("Budget breakdown functionality would be implemented here.");
    });
  }

  // Add task button
  const addTaskBtn = document.querySelector(".add-task");
  if (addTaskBtn) {
    addTaskBtn.addEventListener("click", function () {
      // This would open a modal to add a new task
      // For now, we'll show an alert for demonstration
      alert("Add task functionality would be implemented here.");
    });
  }

  // Load more activities button
  const loadMoreActivitiesBtn = document.querySelector(".load-more-activities");
  if (loadMoreActivitiesBtn) {
    loadMoreActivitiesBtn.addEventListener("click", function () {
      // This would load more activities
      // For now, we'll show an alert for demonstration
      alert("Load more activities functionality would be implemented here.");
    });
  }

  // Insight action buttons
  const insightActionBtns = document.querySelectorAll(".insight-action-btn");
  if (insightActionBtns.length) {
    insightActionBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // This would perform the action
        // For now, we'll show an alert for demonstration
        alert(`Action: ${this.textContent} would be implemented here.`);
      });
    });
  }
});
