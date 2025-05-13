// Resources page functionality

// Initialize the resources page when the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Resources.js: DOM loaded - initializing resources page");
  initResourcesPage();
});

// Mock venue data for the venue matching feature
const mockVenueData = [
  {
    id: "venue001",
    name: "The Grand Tech Pavilion",
    location: "Downtown Metropolis",
    capacity: 1200,
    type: "conference_center",
    estimatedPrice: { min: 8000, max: 12000 },
    amenities: ["av", "wifi", "catering", "parking", "accessible"],
    imageUrl: "linear-gradient(135deg, #6a3093, #a044ff)",
  },
  {
    id: "venue002",
    name: "Serenity Hotel & Conference",
    location: "Ocean View Boulevard",
    capacity: 800,
    type: "hotel_ballroom",
    estimatedPrice: { min: 5000, max: 8000 },
    amenities: ["av", "wifi", "catering", "parking"],
    imageUrl: "linear-gradient(135deg, #00b09b, #96c93d)",
  },
  {
    id: "venue003",
    name: "Metropolitan Art Gallery",
    location: "Arts District",
    capacity: 300,
    type: "unique_space",
    estimatedPrice: { min: 3000, max: 6000 },
    amenities: ["wifi", "accessible"],
    imageUrl: "linear-gradient(135deg, #ff5e62, #ff9966)",
  },
  {
    id: "venue004",
    name: "Summerset Outdoor Pavilion",
    location: "Lakeside Park",
    capacity: 2000,
    type: "outdoor",
    estimatedPrice: { min: 4000, max: 7000 },
    amenities: ["av", "catering"],
    imageUrl: "linear-gradient(135deg, #1e3c72, #2a5298)",
  },
  {
    id: "venue005",
    name: "City University Auditorium",
    location: "University Campus",
    capacity: 500,
    type: "auditorium",
    estimatedPrice: { min: 2500, max: 4500 },
    amenities: ["av", "wifi", "accessible"],
    imageUrl: "linear-gradient(135deg, #4b6cb7, #182848)",
  },
  {
    id: "venue006",
    name: "VirtualMeet Pro",
    location: "Virtual (Online)",
    capacity: 10000,
    type: "virtual_platform",
    estimatedPrice: { min: 1000, max: 3000 },
    amenities: ["av", "wifi"],
    imageUrl: "linear-gradient(135deg, #8e2de2, #4a00e0)",
  },
  {
    id: "venue007",
    name: "Harborview Convention Center",
    location: "Harbor District",
    capacity: 3000,
    type: "conference_center",
    estimatedPrice: { min: 12000, max: 18000 },
    amenities: ["av", "wifi", "catering", "parking", "accessible"],
    imageUrl: "linear-gradient(135deg, #3494e6, #ec6ead)",
  },
];

// Function to initialize the Resources page
function initResourcesPage() {
  const resourcesPageContainer = document.querySelector(
    ".resources-page-container"
  );
  const resourcesNavLink = document.querySelector('[data-page="resources"]');
  const dashboardContent = document.getElementById("dashboard-content");
  const sparkWizardContainer = document.querySelector(
    ".spark-wizard-container"
  );
  const eventsPageContainer = document.querySelector(".events-page-container");

  // Get tab buttons and content divs
  const tabButtons = document.querySelectorAll(".resources-tabs .tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  // Get venue search elements
  const searchVenuesBtn = document.getElementById("search-venues-btn");
  const venueResultsArea = document.querySelector(".venue-results-area");
  const venueResultsGrid = document.querySelector(".venue-results-grid");
  const venueResultsCount = document.getElementById("venue-results-count");
  const noVenuesFound = document.querySelector(".no-venues-found");

  // Show the Resources page
  function showResourcesPage() {
    // Hide other main content sections
    dashboardContent.style.display = "none";
    sparkWizardContainer.style.display = "none";
    eventsPageContainer.style.display = "none";

    // Show resources container
    resourcesPageContainer.style.display = "block";

    // Update main content title
    document.querySelector(".main-content h1").textContent = "Resource Hub";

    // By default, show the first tab (venue matching)
    showTab("venue-matching");
  }

  // Function to show a specific tab
  function showTab(tabId) {
    // Hide all tab contents
    tabContents.forEach((content) => {
      content.classList.remove("active");
    });

    // Remove active class from all tab buttons
    tabButtons.forEach((button) => {
      button.classList.remove("active");
    });

    // Show the selected tab content
    const selectedTab = document.querySelector(
      `.tab-content[class*="${tabId}"]`
    );
    if (selectedTab) {
      selectedTab.classList.add("active");
    }

    // Mark the corresponding tab button as active
    const selectedButton = document.querySelector(
      `.tab-btn[data-tab="${tabId}"]`
    );
    if (selectedButton) {
      selectedButton.classList.add("active");
    }
  }

  // Add click event listener to Resources nav link
  if (resourcesNavLink) {
    resourcesNavLink.addEventListener("click", function (event) {
      // Prevent default behavior
      event.preventDefault();

      // Update nav links active state
      document.querySelectorAll(".nav-links a").forEach((link) => {
        link.classList.remove("active");
      });
      this.classList.add("active");

      // Show the Resources page
      showResourcesPage();
    });
  }

  // Add click event listeners to tab buttons
  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");
      showTab(tabId);
    });
  });
  // Add click event listener to search venues button
  if (searchVenuesBtn) {
    searchVenuesBtn.addEventListener("click", function () {
      // Set button to loading state
      AURALoader.setButtonLoading(searchVenuesBtn, true);
      
      // Show inline loader in the results area
      AURALoader.showInlineLoader(venueResultsArea);
      
      // Get filter values
      const location = document
        .getElementById("venue-location")
        .value.toLowerCase();
      const capacity =
        parseInt(document.getElementById("venue-capacity").value) || 0;
      const venueType = document.getElementById(
        "venue-type-filter-resources"
      ).value;
      const budget =
        parseInt(document.getElementById("venue-budget").value) || 100000; // Default high budget if not specified

      // Get selected amenities
      const selectedAmenities = [];
      document
        .querySelectorAll(
          '.amenities-checkboxes input[type="checkbox"]:checked'
        )
        .forEach((checkbox) => {
          selectedAmenities.push(checkbox.value);
        });

      // Filter venues based on criteria
      let filteredVenues = [...mockVenueData];

      // Filter by location (partial match)
      if (location) {
        filteredVenues = filteredVenues.filter((venue) =>
          venue.location.toLowerCase().includes(location)
        );
      }

      // Filter by capacity (minimum)
      if (capacity > 0) {
        filteredVenues = filteredVenues.filter(
          (venue) => venue.capacity >= capacity
        );
      }

      // Filter by venue type
      if (venueType !== "all") {
        filteredVenues = filteredVenues.filter(
          (venue) => venue.type === venueType
        );
      }

      // Filter by budget (max per day)
      filteredVenues = filteredVenues.filter(
        (venue) => venue.estimatedPrice.min <= budget
      );      // Filter by amenities (must have all selected amenities)
      if (selectedAmenities.length > 0) {
        filteredVenues = filteredVenues.filter((venue) =>
          selectedAmenities.every((amenity) =>
            venue.amenities.includes(amenity)
          )
        );
      }

      // Simulate a brief loading delay for a more realistic experience
      venueResultsArea.style.display = "block";
      
      // Use the loading system for a consistent experience
      setTimeout(() => {
        renderVenueResults(filteredVenues);
        // Reset button loading state
        AURALoader.setButtonLoading(searchVenuesBtn, false);
      }, 800);
    });
  }

  // Function to render venue results
  function renderVenueResults(venues) {
    // Clear the results grid
    venueResultsGrid.innerHTML = "";

    // Update results count
    venueResultsCount.textContent = `(${venues.length})`;

    // Show/hide no venues message
    if (venues.length === 0) {
      noVenuesFound.style.display = "block";
    } else {
      noVenuesFound.style.display = "none";

      // Loop through venues and create cards
      venues.forEach((venue) => {
        // Create amenity tags HTML
        const amenityTagsHTML = venue.amenities
          .map((amenity) => {
            const amenityNames = {
              av: "A/V",
              wifi: "WiFi",
              catering: "Catering",
              parking: "Parking",
              accessible: "Accessibility",
            };
            return `<span class="tag amenity-tag">${
              amenityNames[amenity] || amenity
            }</span>`;
          })
          .join("");

        // Create venue type tag HTML
        const venueTypeNames = {
          conference_center: "Conference Center",
          hotel_ballroom: "Hotel Ballroom",
          auditorium: "Auditorium",
          unique_space: "Unique Space",
          outdoor: "Outdoor",
          virtual_platform: "Virtual Platform",
        };

        const venueTypeTag = `<span class="tag venue-type-tag">${
          venueTypeNames[venue.type] || venue.type
        }</span>`;

        // Create venue card element
        const venueCard = document.createElement("div");
        venueCard.className = "venue-result-card";
        venueCard.dataset.venueId = venue.id;

        // Populate card content
        venueCard.innerHTML = `
          <div class="venue-card-image" style="background-image: ${
            venue.imageUrl
          };"></div>
          <div class="venue-card-details">
            <h4>${venue.name}</h4>
            <p class="venue-location-text">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              ${venue.location}
            </p>
            <p class="venue-capacity-text">Capacity: up to ${venue.capacity.toLocaleString()}</p>
            <p class="venue-price-estimate">Est. Price: $${venue.estimatedPrice.min.toLocaleString()} - $${venue.estimatedPrice.max.toLocaleString()} per day</p>
            <div class="venue-card-tags">
              ${venueTypeTag}
              ${amenityTagsHTML}
            </div>
            <button class="btn btn-secondary view-venue-details-btn">View Details & RFP</button>
          </div>
        `;

        // Add event listener to view details button
        const viewDetailsBtn = venueCard.querySelector(
          ".view-venue-details-btn"
        );
        viewDetailsBtn.addEventListener("click", function () {
          console.log(`View details for venue: ${venue.id} - ${venue.name}`);
          // Placeholder for future functionality
          alert(
            `Viewing details for ${venue.name} will be implemented in a future update.`
          );
        });

        // Add the card to the grid
        venueResultsGrid.appendChild(venueCard);
      });
    }
  }
}
