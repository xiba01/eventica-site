// AURA - Main JavaScript for Page Navigation and Functionality

// Wait for the document to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded - initializing AURA...");
  initPageNavigation();
  setupAdditionalEventListeners();
});

// Double-check initialization when window is fully loaded (with resources)
window.addEventListener("load", function () {
  console.log("Window fully loaded - ensuring AURA is initialized");

  // Force re-initialization to ensure everything is properly set up
  setTimeout(function () {
    console.log("Running deferred initialization");
    initPageNavigation();
    setupAdditionalEventListeners();

    // Check if we should navigate to a specific page based on URL hash
    if (window.location.hash) {
      const targetPage = window.location.hash.substring(1);
      console.log("Found hash navigation request to:", targetPage);
      
      // Show loader before navigation (loading system will handle this)
      window.navigateTo(targetPage);
    }
  }, 100);
});

// Function to handle page navigation
function initPageNavigation() {
  // Get all navigation links with data-page attribute
  const navLinks = document.querySelectorAll(".nav-links a[data-page]");
  console.log("Navigation links found:", navLinks.length);

  // Add click event listeners to each navigation link
  navLinks.forEach((link) => {
    // Remove any existing listeners to prevent duplicates
    const newLink = link.cloneNode(true);
    link.parentNode.replaceChild(newLink, link);

    newLink.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Nav link clicked:", this.getAttribute("data-page"));

      // Get the target page from data-page attribute
      const targetPage = this.getAttribute("data-page");
      
      // Show loader before page transition
      AURALoader.showGlobalLoader(`Loading ${targetPage.charAt(0).toUpperCase() + targetPage.slice(1)}...`);

      // Hide all page containers
      hideAllPages();

      // Show the target page container
      showPage(targetPage);

      // Update active state in navigation
      updateActiveNavLink(this);

      // Update URL hash for history without triggering a page reload
      window.location.hash = targetPage;

      // Hide loader after a short delay
      setTimeout(() => {
        AURALoader.hideGlobalLoader();
      }, 500);
    });
  });
}

// Function to hide all page containers
function hideAllPages() {
  // Get all page containers
  const dashboardContent = document.getElementById("dashboard-content");
  const eventsPageContainer = document.querySelector(".events-page-container");
  const resourcesPageContainer = document.querySelector(
    ".resources-page-container"
  );
  const analyticsPageContainer = document.querySelector(
    ".analytics-page-container"
  );
  const sparkWizardContainer = document.querySelector(
    ".spark-wizard-container"
  );
  const settingsPageContainer = document.querySelector(
    ".settings-page-container"
  );

  // Hide all containers
  if (dashboardContent) dashboardContent.style.display = "none";
  if (eventsPageContainer) eventsPageContainer.style.display = "none";
  if (resourcesPageContainer) resourcesPageContainer.style.display = "none";
  if (analyticsPageContainer) analyticsPageContainer.style.display = "none";
  if (sparkWizardContainer) sparkWizardContainer.style.display = "none";
  if (settingsPageContainer) settingsPageContainer.style.display = "none";

  // You can add more page containers as needed
}

// Function to show a specific page container
function showPage(pageName) {
  console.log("Showing page:", pageName);
  let pageElement;

  // Determine which page to show based on pageName
  switch (pageName) {
    case "dashboard":
      pageElement = document.getElementById("dashboard-content");
      break;
    case "events":
      pageElement = document.querySelector(".events-page-container");
      console.log("Events page element:", pageElement);
      break;
    case "new-event":
      pageElement = document.querySelector(".spark-wizard-container");
      console.log("New Event Spark page element:", pageElement);
      // Special handling for new event spark page
      if (!pageElement) {
        console.error("Spark wizard container not found! Creating a fallback.");
        createSparkWizardFallback();
        pageElement = document.querySelector(".spark-wizard-container");
      }
      break;
    case "resources":
      pageElement = document.querySelector(".resources-page-container");
      console.log("Resources page element:", pageElement);
      break;
    case "analytics":
      pageElement = document.querySelector(".analytics-page-container");
      console.log("Analytics page element:", pageElement);
      break;
    case "settings":
      pageElement = document.querySelector(".settings-page-container");
      console.log("Settings page element:", pageElement);
      break;
    default:
      // Default to dashboard if pageName is not recognized
      pageElement = document.getElementById("dashboard-content");
  }

  // Show the page if it exists
  if (pageElement) {
    console.log("Showing element:", pageElement);
    pageElement.style.display = "block";

    // Execute any special initialization for the page if needed
    if (pageName === "resources" && typeof initResourcesPage === "function") {
      console.log("Initializing resources page");
      initResourcesPage();
    } else if (
      pageName === "analytics" &&
      typeof initAnalyticsPage === "function"
    ) {
      console.log("Initializing analytics page");
      initAnalyticsPage();
    } else if (pageName === "new-event") {
      console.log("Initializing new event spark page");
      initSparkWizard();
    }
  } else {
    console.error("Page element not found for:", pageName);
    // Create a fallback message if the page doesn't exist
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      const errorMessage = document.createElement("div");
      errorMessage.id = "page-error-message";
      errorMessage.innerHTML = `
        <h1>Page Not Found</h1>
        <p>The requested page "${pageName}" could not be loaded.</p>
        <button class="btn btn-primary" onclick="window.navigateTo('dashboard')">Return to Dashboard</button>
      `;
      mainContent.appendChild(errorMessage);
    }
  }
}

// Global function to navigate to a specific page
window.navigateTo = function (pageName) {
  console.log("Global navigation requested to:", pageName);
  
  // Show loader with page-specific message
  const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(/-/g, ' ');
  AURALoader.showGlobalLoader(`Loading ${formattedPageName}...`);
  
  // Slight delay to ensure loading animation is visible
  setTimeout(() => {
    hideAllPages();
    showPage(pageName);
    
    // Update active nav link if possible
    const navLink = document.querySelector(
      `.nav-links a[data-page="${pageName}"]`
    );
    if (navLink) {
      updateActiveNavLink(navLink);
    }
    
    // Hide loader after page content is rendered
    setTimeout(() => {
      AURALoader.hideGlobalLoader();
    }, 300);
  }, 300);
};

// Function to update active state in navigation
function updateActiveNavLink(activeLink) {
  // Remove active class from all navigation links
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });

  // Add active class to the clicked link
  activeLink.classList.add("active");
}

// Setup additional event listeners for other navigation elements
function setupAdditionalEventListeners() {
  console.log("Setting up additional event listeners");

  // Handle "New Event Spark" button click from dashboard
  const quickSparkEventBtn = document.querySelector(".quick-spark-event");
  if (quickSparkEventBtn) {
    quickSparkEventBtn.addEventListener("click", function () {
      console.log("Quick spark event button clicked");
      window.navigateTo("new-event");
    });
  } else {
    console.warn("Quick spark event button not found");
  }

  // Handle "New Event Spark" button click from events page
  const goToNewSparkFromEventsBtn = document.getElementById(
    "go-to-new-spark-from-events"
  );
  if (goToNewSparkFromEventsBtn) {
    goToNewSparkFromEventsBtn.addEventListener("click", function () {
      console.log("New event spark from events button clicked");
      window.navigateTo("new-event");
    });
  }

  // Add click handler for "View All Events" link
  const viewAllEventsLink = document.querySelector(".card-link");
  if (viewAllEventsLink) {
    viewAllEventsLink.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("View All Events link clicked");
      window.navigateTo("events");
    });
  }
}

// Function to initialize the Spark Wizard page
function initSparkWizard() {
  console.log("Initializing Spark Wizard");

  // Check if the spark wizard content is properly loaded
  const visionBoard = document.querySelector(".vision-board");
  if (!visionBoard || visionBoard.children.length === 0) {
    console.warn("Vision board missing or empty, ensuring content is loaded");

    // Make sure progress indicator is visible
    const progressIndicator = document.querySelector(
      ".spark-progress-indicator"
    );
    if (progressIndicator && progressIndicator.children.length === 0) {
      progressIndicator.innerHTML = `
        <span class="dot active"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      `;
    }

    // Add subtitle if missing
    const subtitle = document.querySelector(
      ".spark-wizard-container .wizard-subtitle"
    );
    if (subtitle && !subtitle.textContent.trim()) {
      subtitle.textContent =
        "Let's craft the vision for your new event spark. AURA will guide you.";
    }
  }

  // Re-add event listeners for any interactive elements
  setupSparkWizardInteractions();
  setupWizardNavigation();
}

// Function to set up event listeners for the Spark Wizard
function setupSparkWizardInteractions() {
  console.log("Setting up Spark Wizard interactions");

  // Set up basic UI interactions
  enhanceSparkWizardUI();

  // Set up theme selection
  setupThemeSelection();
  // Set up Blueprint Visualization
  setupBlueprintVisualization();

  // Add event listener to the duration input to update blueprint when changed
  const durationInput = document.getElementById("event-duration-days");
  if (durationInput) {
    durationInput.addEventListener("change", function () {
      setupBlueprintVisualization();
    });
  }

  console.log("Spark Wizard ready for user interaction");
}

// Function to set up the blueprint visualization
function setupBlueprintVisualization() {
  const blueprintCanvas = document.querySelector(".blueprint-canvas");
  const dayColumnsContainer = document.querySelector(".day-columns-container");

  if (!dayColumnsContainer) return;

  // Get the event duration (defaulting to 3 if not found)
  const durationInput = document.getElementById("event-duration-days");
  const duration = durationInput ? parseInt(durationInput.value) : 3;

  // Get the selected theme
  const selectedTheme = document.querySelector(".theme-card.selected h3");
  const themeName = selectedTheme ? selectedTheme.textContent : "";

  // Clear existing columns
  dayColumnsContainer.innerHTML = "";

  // Adjust event blocks based on theme
  let events = {
    morning: {
      title: "Workshop Session",
      location: "Breakout Rooms",
      duration: "90 min",
      type: "workshop",
    },
    afternoon: {
      title: "Expert Panel",
      location: "Main Hall",
      duration: "90 min",
      type: "panel",
    },
    closing: {
      title: "Closing Ceremony",
      location: "Main Hall",
      duration: "120 min",
      type: "special",
    },
  };

  // Customize events based on theme
  if (themeName.includes("AI for Good") || themeName.includes("Pitch")) {
    events.morning.title = "Mentor Sessions";
    events.afternoon.title = "Pitch Rehearsals";
    events.closing.title = "Final Pitch & Awards";
  } else if (themeName.includes("Expo") || themeName.includes("Festival")) {
    events.morning.title = "Exhibition Setup";
    events.morning.type = "special";
    events.afternoon.title = "Showcase Tours";
    events.afternoon.type = "networking";
  } else if (themeName.includes("Summit") || themeName.includes("Future")) {
    events.morning.title = "Thought Leadership Panel";
    events.morning.type = "panel";
    events.afternoon.title = "Future Trends Discussion";
  } else if (themeName.includes("Creative") || themeName.includes("Tech")) {
    events.morning.title = "Interactive Showcase";
    events.morning.type = "special";
    events.afternoon.title = "Collaborative Workshop";
    events.afternoon.location = "Creative Studios";
  }

  // Generate columns for each day
  for (let i = 1; i <= duration; i++) {
    const dayColumn = document.createElement("div");
    dayColumn.className = "day-column";
    dayColumn.innerHTML = `
      <div class="day-header">Day ${i}</div>
      <div class="day-timeline">
        <div class="time-marker">8:00 AM</div>
        <div class="event-block keynote">
          <h5>Welcome Keynote</h5>
          <p>Main Hall (60 min)</p>
        </div>
        <div class="time-marker">9:30 AM</div>
        <div class="event-block ${events.morning.type}">
          <h5>${events.morning.title}</h5>
          <p>${events.morning.location} (${events.morning.duration})</p>
        </div>
        <div class="time-marker">11:30 AM</div>
        <div class="event-block networking">
          <h5>Networking Lunch</h5>
          <p>Dining Hall (60 min)</p>
        </div>
        <div class="time-marker">1:00 PM</div>
        ${
          i === 1
            ? `
        <div class="event-block ${events.afternoon.type}">
          <h5>${events.afternoon.title}</h5>
          <p>${events.afternoon.location} (${events.afternoon.duration})</p>
        </div>
        `
            : i === duration
            ? `
        <div class="event-block special">
          <h5>${events.closing.title}</h5>
          <p>${events.closing.location} (${events.closing.duration})</p>
        </div>
        `
            : `
        <div class="event-block workshop">
          <h5>Hands-on Lab</h5>
          <p>Tech Room (120 min)</p>
        </div>
        `
        }
        <div class="time-marker">3:00 PM</div>
        <div class="event-block networking">
          <h5>Afternoon Break</h5>
          <p>Lounge (30 min)</p>
        </div>
        <div class="time-marker">3:30 PM</div>
        <div class="event-block ${i === 2 ? "special" : events.afternoon.type}">
          <h5>${i === 2 ? "Featured Presentation" : events.afternoon.title}</h5>
          <p>${
            i === 2
              ? "Main Hall (60 min)"
              : `${events.afternoon.location} (${events.afternoon.duration})`
          }</p>
        </div>
        <div class="time-marker">5:00 PM</div>
      </div>
    `;
    dayColumnsContainer.appendChild(dayColumn);
  }

  // Update resource metrics
  updateResourceMetrics(duration);
}

// Function to update the resource metrics in the blueprint view
function updateResourceMetrics(duration) {
  // Get the metric elements
  const roomCount = document.getElementById("room-count");
  const speakerCount = document.getElementById("speaker-count");
  const staffCount = document.getElementById("staff-count");
  const estimatedCost = document.getElementById("estimated-cost");

  // Get the currently selected theme if possible
  const selectedTheme = document.querySelector(".theme-card.selected h3");
  const themeName = selectedTheme ? selectedTheme.textContent : "";

  // Calculate metrics based on duration and theme
  let rooms = Math.min(duration + 1, 5); // Base rooms on duration
  let speakers = duration * 3 + 2; // Base speakers: 2 + 3 per day
  let staff = Math.ceil(duration * 4.5); // Base staff: 4-5 per day
  let cost = duration * 15000; // Base cost: $15k per day

  // Adjust based on theme if selected
  if (themeName.includes("AI for Good") || themeName.includes("Pitch")) {
    // Competition type events need more staff, fewer speakers
    speakers = Math.round(speakers * 0.8);
    staff = Math.round(staff * 1.2);
    rooms -= 1; // Fewer rooms, more central focus
  } else if (themeName.includes("Expo") || themeName.includes("Festival")) {
    // Expo/Festival type events need more space
    rooms += 2;
    staff = Math.round(staff * 1.3);
    cost = Math.round(cost * 1.25); // Higher cost for exhibition space
  } else if (themeName.includes("Summit") || themeName.includes("Future")) {
    // Conference type with high-profile speakers
    speakers = Math.round(speakers * 1.2);
    cost = Math.round(cost * 1.1); // Higher cost for premium speakers
  } else if (themeName.includes("Creative") || themeName.includes("Tech")) {
    // Interactive events need more technology
    rooms += 1;
    staff = Math.round(staff * 1.1);
    cost = Math.round(cost * 1.15); // Higher cost for tech setup
  }

  // Update the display elements
  if (roomCount) roomCount.textContent = rooms;
  if (speakerCount) speakerCount.textContent = speakers;
  if (staffCount) staffCount.textContent = staff;
  if (estimatedCost) estimatedCost.textContent = "$" + formatCurrency(cost);
}

// Initialize wizard navigation buttons when the spark wizard page is shown
function setupWizardNavigation() {
  console.log("Setting up wizard navigation buttons");

  // Step 1 buttons (Vision Board)
  const nextStep1Button = document.getElementById("next-spark-step1");
  const cancelButton = document.getElementById("cancel-spark");

  // Step 2 buttons (Scope & Scale)
  const prevStep1Button = document.getElementById("prev-spark-step1");
  const nextStep2Button = document.getElementById("next-spark-step2");

  // Step 3 buttons (Theme Generation)
  const prevStep2Button = document.getElementById("prev-spark-step2");
  const nextStep3Button = document.getElementById("next-spark-step3");

  // Step 4 buttons (Blueprint)
  const prevStep3Button = document.getElementById("prev-spark-step3");
  const completeButton = document.getElementById("complete-spark");

  // Boards
  const visionBoard = document.querySelector(".vision-board");
  const scopeScaleBoard = document.querySelector(".scope-scale-board");
  const themeGenerationBoard = document.querySelector(
    ".theme-generation-board"
  );
  const blueprintBoard = document.querySelector(
    ".blueprint-visualization-board"
  );

  // Progress indicator dots
  const progressDots = document.querySelectorAll(
    ".spark-progress-indicator .dot"
  );

  // Hide all boards except the first one
  if (scopeScaleBoard) scopeScaleBoard.style.display = "none";
  if (themeGenerationBoard) themeGenerationBoard.style.display = "none";
  if (blueprintBoard) blueprintBoard.style.display = "none";

  // Helper function to update progress indicator
  function updateProgressIndicator(step) {
    progressDots.forEach((dot, index) => {
      dot.classList.toggle("active", index === step - 1);
    });
  }

  // Helper function to update button visibility
  function updateButtonVisibility(step) {
    // Hide all navigation buttons first
    if (nextStep1Button) nextStep1Button.style.display = "none";
    if (cancelButton) cancelButton.style.display = "none";
    if (prevStep1Button) prevStep1Button.style.display = "none";
    if (nextStep2Button) nextStep2Button.style.display = "none";
    if (prevStep2Button) prevStep2Button.style.display = "none";
    if (nextStep3Button) nextStep3Button.style.display = "none";
    if (prevStep3Button) prevStep3Button.style.display = "none";
    if (completeButton) completeButton.style.display = "none";

    // Show relevant buttons based on current step
    switch (step) {
      case 1:
        if (nextStep1Button) nextStep1Button.style.display = "inline-block";
        if (cancelButton) cancelButton.style.display = "inline-block";
        break;
      case 2:
        if (prevStep1Button) prevStep1Button.style.display = "inline-block";
        if (nextStep2Button) nextStep2Button.style.display = "inline-block";
        break;
      case 3:
        if (prevStep2Button) prevStep2Button.style.display = "inline-block";
        if (nextStep3Button) nextStep3Button.style.display = "inline-block";
        break;
      case 4:
        if (prevStep3Button) prevStep3Button.style.display = "inline-block";
        if (completeButton) completeButton.style.display = "inline-block";
        break;
    }
  }

  // Add event listeners to navigation buttons
  if (nextStep1Button) {
    nextStep1Button.addEventListener("click", function () {
      console.log("Moving to step 2: Scope & Scale");
      if (visionBoard) visionBoard.style.display = "none";
      if (scopeScaleBoard) scopeScaleBoard.style.display = "flex";
      updateProgressIndicator(2);
      updateButtonVisibility(2);
    });
  }

  if (prevStep1Button) {
    prevStep1Button.addEventListener("click", function () {
      console.log("Moving back to step 1: Vision");
      if (scopeScaleBoard) scopeScaleBoard.style.display = "none";
      if (visionBoard) visionBoard.style.display = "flex";
      updateProgressIndicator(1);
      updateButtonVisibility(1);
    });
  }

  if (nextStep2Button) {
    nextStep2Button.addEventListener("click", function () {
      console.log("Moving to step 3: Theme Generation");
      if (scopeScaleBoard) scopeScaleBoard.style.display = "none";
      if (themeGenerationBoard) themeGenerationBoard.style.display = "block";
      updateProgressIndicator(3);
      updateButtonVisibility(3);
    });
  }

  if (prevStep2Button) {
    prevStep2Button.addEventListener("click", function () {
      console.log("Moving back to step 2: Scope & Scale");
      if (themeGenerationBoard) themeGenerationBoard.style.display = "none";
      if (scopeScaleBoard) scopeScaleBoard.style.display = "flex";
      updateProgressIndicator(2);
      updateButtonVisibility(2);
    });
  }

  if (nextStep3Button) {
    nextStep3Button.addEventListener("click", function () {
      console.log("Moving to step 4: Blueprint");
      if (themeGenerationBoard) themeGenerationBoard.style.display = "none";
      if (blueprintBoard) blueprintBoard.style.display = "block";
      updateProgressIndicator(4);
      updateButtonVisibility(4);
    });
  }

  if (prevStep3Button) {
    prevStep3Button.addEventListener("click", function () {
      console.log("Moving back to step 3: Theme Generation");
      if (blueprintBoard) blueprintBoard.style.display = "none";
      if (themeGenerationBoard) themeGenerationBoard.style.display = "block";
      updateProgressIndicator(3);
      updateButtonVisibility(3);
    });
  }

  if (cancelButton) {
    cancelButton.addEventListener("click", function () {
      console.log("Canceling spark wizard");
      window.navigateTo("dashboard");
    });
  }

  if (completeButton) {
    completeButton.addEventListener("click", function () {
      console.log("Completing spark wizard");
      alert("Event spark created successfully! Redirecting to events page.");
      window.navigateTo("events");
    });
  }

  // Initial setup - show step 1
  updateProgressIndicator(1);
  updateButtonVisibility(1);
}

// Helper function to set up theme selection functionality
function setupThemeSelection() {
  const themeCards = document.querySelectorAll(".theme-card");
  const chosenThemeName = document.getElementById("chosen-theme-name");
  const generationStatus = document.getElementById("generation-status");

  // Track which card is selected
  let selectedCard = null;

  themeCards.forEach((card) => {
    const selectButton = card.querySelector(".select-theme");
    const themeTitle = card.querySelector("h3");
    const favoriteButton = card.querySelector(".favorite-btn");

    // Set up select button functionality
    if (selectButton && themeTitle) {
      selectButton.addEventListener("click", function () {
        // Update selected theme display
        if (chosenThemeName) {
          chosenThemeName.textContent = themeTitle.textContent;

          // Update selected state
          if (selectedCard) {
            selectedCard.classList.remove("selected");
          }

          // Set this card as selected
          card.classList.add("selected");
          selectedCard = card;

          // Update resource estimates based on the selected theme
          const durationInput = document.getElementById("event-duration-days");
          const duration = durationInput ? parseInt(durationInput.value) : 3;
          updateResourceMetrics(duration);
        }
      });
    }

    // Set up favorite button functionality
    if (favoriteButton) {
      favoriteButton.addEventListener("click", function (e) {
        e.preventDefault();
        this.classList.toggle("active");

        // Visual feedback
        if (this.classList.contains("active")) {
          // Show brief confirmation message
          if (generationStatus) {
            generationStatus.textContent = `${themeTitle.textContent} added to favorites!`;
            generationStatus.style.opacity = "1";

            setTimeout(() => {
              generationStatus.style.opacity = "0";
            }, 2000);
          }
        }
      });
    }
  });

  // Handle theme regeneration
  const regenerateButton = document.getElementById("regenerate-themes");

  if (regenerateButton && generationStatus) {
    regenerateButton.addEventListener("click", function () {
      generationStatus.textContent = "AURA is generating new themes...";
      generationStatus.style.opacity = "1";

      // Add a subtle animation to theme cards while "generating"
      themeCards.forEach((card) => {
        card.style.opacity = "0.6";
      });

      // Simulate theme generation process
      setTimeout(function () {
        // Restore cards
        themeCards.forEach((card) => {
          card.style.opacity = "1";

          // Update one theme title and description for visual change
          const randomIndex = Math.floor(Math.random() * themeCards.length);
          if (themeCards[randomIndex] === card) {
            const titleOptions = [
              "Immersive Learning Experience",
              "Digital Transformation Forum",
              "Next-Gen Innovations Showcase",
              "Industry Disruptors Summit",
              "Collaborative Futures Workshop",
            ];

            const title = card.querySelector("h3");
            if (title) {
              title.textContent =
                titleOptions[Math.floor(Math.random() * titleOptions.length)];
            }
          }
        });

        generationStatus.textContent = "New themes ready!";
        setTimeout(function () {
          generationStatus.style.opacity = "0";
        }, 2000);
      }, 2000);
    });
  }
}

// Function to create a fallback Spark Wizard container if it's missing
function createSparkWizardFallback() {
  console.log("Creating Spark Wizard fallback");
  const mainContent = document.querySelector(".main-content");
  if (!mainContent) return;

  const sparkWizard = document.createElement("div");
  sparkWizard.className = "spark-wizard-container";
  sparkWizard.innerHTML = `
    <h1>Ignite Your Next Event</h1>
    <p class="wizard-subtitle">Let's craft the vision for your new event spark. AURA will guide you.</p>
    
    <!-- Progress Indicator -->
    <div class="spark-progress-indicator">
      <span class="dot active"></span>
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
    
    <!-- Vision Board -->
    <div class="vision-board">
      <!-- Placeholder content -->
      <div style="text-align: center; padding: 50px;">
        <h3>Event Creation Wizard</h3>
        <p>Loading event creation tools...</p>
        <div class="aura-pulse" style="margin: 20px auto;"></div>
        <p>If this message persists, please try refreshing the page.</p>
      </div>
    </div>
  `;

  mainContent.appendChild(sparkWizard);
}

// Function to enhance Spark Wizard interactions with additional features
function enhanceSparkWizardUI() {
  console.log("Enhancing Spark Wizard UI...");

  // Add interactive functionality to keyword tags
  const keywordTags = document.querySelectorAll(".keyword-tag");
  const selectedKeywordsCount = document.querySelector(
    ".selected-keywords-count"
  );
  let selectedCount = 0;

  keywordTags.forEach((tag) => {
    tag.addEventListener("click", function () {
      // Toggle active state
      this.classList.toggle("active");

      // Update count
      selectedCount = document.querySelectorAll(".keyword-tag.active").length;
      if (selectedKeywordsCount) {
        selectedKeywordsCount.textContent = `${selectedCount}/5 selected`;
      }

      // Limit selection to 5 tags
      if (selectedCount > 5) {
        this.classList.remove("active");
        selectedCount = 5;
        if (selectedKeywordsCount) {
          selectedKeywordsCount.textContent = `5/5 selected`;
        }
      }
    });
  });

  // Add interactive functionality to mood cards
  const moodCards = document.querySelectorAll(".mood-card");
  moodCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Remove active class from all cards
      moodCards.forEach((c) => c.classList.remove("active"));
      // Add active class to clicked card
      this.classList.add("active");
    });
  });

  // Add interactive functionality to event type cards
  const eventTypeCards = document.querySelectorAll(".event-type-card");
  eventTypeCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Remove active class from all cards
      eventTypeCards.forEach((c) => c.classList.remove("active"));
      // Add active class to clicked card
      this.classList.add("active");

      // Special handling for Competition type
      const teamCountSection = document.querySelector(".team-count-section");
      if (teamCountSection) {
        if (this.getAttribute("data-type") === "Competition") {
          teamCountSection.style.display = "block";
        } else {
          teamCountSection.style.display = "none";
        }
      }
    });
  });

  // Add interactive functionality to format buttons
  const formatButtons = document.querySelectorAll(".format-btn");
  formatButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      formatButtons.forEach((b) => b.classList.remove("active"));
      // Add active class to clicked button
      this.classList.add("active");
    });
  });

  // Handle sliders
  setupRangeSliders();

  console.log("Spark Wizard UI enhancements complete");
}

// Function to handle all range sliders in the wizard
function setupRangeSliders() {
  // Attendee count slider
  const attendeeSlider = document.getElementById("attendee-count-slider");
  const attendeeDisplay = document.getElementById("attendee-count-display");

  if (attendeeSlider && attendeeDisplay) {
    attendeeSlider.addEventListener("input", function () {
      let value = this.value;
      attendeeDisplay.textContent =
        value >= 1000 ? `${Math.floor(value / 1000)}k+` : value;
    });
  }

  // Budget slider
  const budgetSlider = document.getElementById("target-budget-slider");
  const budgetMinDisplay = document.getElementById("budget-min-display");
  const budgetMaxDisplay = document.getElementById("budget-max-display");

  if (budgetSlider && budgetMinDisplay && budgetMaxDisplay) {
    budgetSlider.addEventListener("input", function () {
      const value = parseInt(this.value);
      const min = Math.max(value * 0.7, 1000);
      const max = value * 1.3;

      budgetMinDisplay.textContent = formatCurrency(min);
      budgetMaxDisplay.textContent = formatCurrency(max);
    });
  }

  // Goal sliders
  const goalSliders = document.querySelectorAll(
    '.goal-slider input[type="range"]'
  );

  if (goalSliders.length > 0) {
    const percentageDisplays = document.querySelectorAll(".goal-percentage");
    const totalPercentage = document.querySelector(".total-goal-percentage");

    goalSliders.forEach((slider, index) => {
      slider.addEventListener("input", function () {
        // Update the displayed percentage
        if (percentageDisplays[index]) {
          percentageDisplays[index].textContent = this.value + "%";
        }

        // Calculate total across all sliders
        let total = 0;
        goalSliders.forEach((s) => {
          total += parseInt(s.value);
        });

        // Update total display
        if (totalPercentage) {
          totalPercentage.textContent = `Total: ${total}%`;
          totalPercentage.classList.toggle("error", total !== 100);
        }
      });
    });
  }

  // Duration controls
  const durationInput = document.getElementById("event-duration-days");
  const minusBtn = document.querySelector(".duration-btn.minus");
  const plusBtn = document.querySelector(".duration-btn.plus");

  if (durationInput && minusBtn && plusBtn) {
    minusBtn.addEventListener("click", function () {
      const currentValue = parseInt(durationInput.value);
      if (currentValue > 1) {
        durationInput.value = currentValue - 1;
      }
    });

    plusBtn.addEventListener("click", function () {
      const currentValue = parseInt(durationInput.value);
      if (currentValue < 30) {
        durationInput.value = currentValue + 1;
      }
    });
  }
}

// Helper to format currency
function formatCurrency(value) {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Emergency navigation function that can be called from the console if needed
window.emergencyNavigate = function (pageName) {
  console.log("EMERGENCY NAVIGATION to:", pageName);
  hideAllPages();

  // Direct element manipulation for guaranteed results
  let pageElement;
  switch (pageName) {
    case "dashboard":
      pageElement = document.getElementById("dashboard-content");
      break;
    case "events":
      pageElement = document.querySelector(".events-page-container");
      break;
    case "new-event":
      pageElement = document.querySelector(".spark-wizard-container");
      if (!pageElement) createSparkWizardFallback();
      pageElement = document.querySelector(".spark-wizard-container");
      break;
    case "resources":
      pageElement = document.querySelector(".resources-page-container");
      break;
    case "analytics":
      pageElement = document.querySelector(".analytics-page-container");
      break;
  }

  if (pageElement) {
    pageElement.style.display = "block";
    console.log("Emergency navigation complete");
  }
};
