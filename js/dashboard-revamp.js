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
      greetingElement.textContent.split(",")[1]?.trim() || "Sarah";
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
  const budgetChartContainer = budgetChartCanvas?.parentElement;
  
  if (budgetChartCanvas && typeof Chart !== "undefined") {
    // Show loading indicator while the chart initializes
    if (budgetChartContainer && window.AURALoader) {
      window.AURALoader.showInlineLoader(budgetChartContainer);
    }
    
    // Simulate data loading delay
    setTimeout(() => {
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
      
      // Add loading state to the send button
      if (window.AURALoader) {
        window.AURALoader.setButtonLoading(sendButton, true);
      }

      // Display processing state
      responseArea.innerHTML = `<em>Processing your request...</em>`;

      // Simulate response delay (would be an actual API call in production)
      setTimeout(() => {
        // Reset button loading state
        if (window.AURALoader) {
          window.AURALoader.setButtonLoading(sendButton, false);
        }
        
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
      // Show loading state on button
      if (window.AURALoader) {
        window.AURALoader.setButtonLoading(viewBudgetBtn, true);
      }
      
      // Simulate data loading for budget breakdown
      setTimeout(() => {
        // Reset button loading state
        if (window.AURALoader) {
          window.AURALoader.setButtonLoading(viewBudgetBtn, false);
        }
        
        // This would open a modal or navigate to a detailed budget view
        // For now, we'll show an alert for demonstration
        alert("Budget breakdown functionality would be implemented here.");
      }, 800);
    });
  }
  // Add task button
  const addTaskBtn = document.querySelector(".add-task");
  if (addTaskBtn) {
    addTaskBtn.addEventListener("click", function () {
      // Show loading state on button
      if (window.AURALoader) {
        window.AURALoader.setButtonLoading(addTaskBtn, true);
      }
      
      // Simulate task creation process
      setTimeout(() => {
        // Reset button loading state
        if (window.AURALoader) {
          window.AURALoader.setButtonLoading(addTaskBtn, false);
        }
        
        // This would open a modal to add a new task
        // For now, we'll show an alert for demonstration
        alert("Add task functionality would be implemented here.");
      }, 600);
    });
  }
  // Load more activities button
  const loadMoreActivitiesBtn = document.querySelector(".load-more-activities");
  if (loadMoreActivitiesBtn) {
    loadMoreActivitiesBtn.addEventListener("click", function () {
      // Show loading state on button
      if (window.AURALoader) {
        window.AURALoader.setButtonLoading(loadMoreActivitiesBtn, true);
      }
      
      // Simulate loading more activities
      setTimeout(() => {
        // Reset button loading state
        if (window.AURALoader) {
          window.AURALoader.setButtonLoading(loadMoreActivitiesBtn, false);
        }
        
        // This would load more activities
        // For now, we'll show an alert for demonstration
        alert("Load more activities functionality would be implemented here.");
      }, 800);
    });
  }
  // Insight action buttons
  const insightActionBtns = document.querySelectorAll(".insight-action-btn");
  if (insightActionBtns.length) {
    insightActionBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Show loading state on button
        if (window.AURALoader) {
          window.AURALoader.setButtonLoading(btn, true);
        }
        
        // Simulate action processing
        setTimeout(() => {
          // Reset button loading state
          if (window.AURALoader) {
            window.AURALoader.setButtonLoading(btn, false);
          }
          
          // This would perform the action
          // For now, we'll show an alert for demonstration
          alert(`Action: ${this.textContent} would be implemented here.`);
        }, 700);
      });
    });
  }
});
