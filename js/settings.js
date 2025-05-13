// Settings Page Functionality

document.addEventListener("DOMContentLoaded", function () {
  initSettingsPage();
});

function initSettingsPage() {
  // Get all save buttons
  const saveProfileBtn = document.getElementById("save-profile-btn");
  const saveNotificationsBtn = document.getElementById(
    "save-notifications-btn"
  );
  const saveAppearanceBtn = document.getElementById("save-appearance-btn");
  const changeAvatarBtn = document.getElementById("change-avatar-btn");

  // Theme buttons
  const themeButtons = document.querySelectorAll(".theme-btn");
  // Handle profile save
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener("click", function () {
      // Show loading state on button
      AURALoader.setButtonLoading(saveProfileBtn, true);
      
      const profileName = document.getElementById("profile-name").value;
      const profileTitle = document.getElementById("profile-title").value;

      // Log the values that would be saved
      console.log("Saving profile:", {
        name: profileName,
        title: profileTitle,
      });

      // Simulate a server request with slight delay
      setTimeout(() => {
        // Reset loading state
        AURALoader.setButtonLoading(saveProfileBtn, false);
        // Show success message
        showSuccessToast();
      }, 800);
    });
  }
  // Handle notifications save
  if (saveNotificationsBtn) {
    saveNotificationsBtn.addEventListener("click", function () {
      // Show loading state on button
      AURALoader.setButtonLoading(saveNotificationsBtn, true);
      
      const eventUpdates = document.getElementById(
        "notify-event-updates"
      ).value;
      const auraSuggestions = document.getElementById(
        "notify-aura-suggestions"
      ).checked;
      const teamMentions = document.getElementById(
        "notify-team-mentions"
      ).checked;
      const newsletter = document.getElementById("notify-newsletter").checked;

      // Log the values that would be saved
      console.log("Saving notification preferences:", {
        eventUpdates,
        auraSuggestions,
        teamMentions,
        newsletter,
      });

      // Simulate a server request with slight delay
      setTimeout(() => {
        // Reset loading state
        AURALoader.setButtonLoading(saveNotificationsBtn, false);
        // Show success message
        showSuccessToast();
      }, 800);
    });
  }
  // Handle appearance save
  if (saveAppearanceBtn) {
    saveAppearanceBtn.addEventListener("click", function () {
      // Show loading state on button
      AURALoader.setButtonLoading(saveAppearanceBtn, true);
      
      const activeThemeBtn = document.querySelector(".theme-btn.active");
      const theme = activeThemeBtn
        ? activeThemeBtn.getAttribute("data-theme")
        : "dark";
      const density = document.getElementById("density-setting").value;

      // Log the values that would be saved
      console.log("Saving appearance settings:", {
        theme,
        density,
      });

      // Simulate a server request with slight delay
      setTimeout(() => {
        // Reset loading state
        AURALoader.setButtonLoading(saveAppearanceBtn, false);
        // Show success message
        showSuccessToast();
      }, 800);
    });
  }

  // Handle theme selection
  if (themeButtons) {
    themeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all theme buttons
        themeButtons.forEach((btn) => btn.classList.remove("active"));

        // Add active class to clicked button
        this.classList.add("active");

        // Get selected theme
        const theme = this.getAttribute("data-theme");
        console.log("Theme selected:", theme);

        // Apply theme (mock implementation)
        applyTheme(theme);
      });
    });
  }

  // Handle avatar change
  if (changeAvatarBtn) {
    changeAvatarBtn.addEventListener("click", function () {
      console.log("Change avatar clicked");

      // For this mock implementation, we'll just change the avatar to a different one
      const avatarImg = document.getElementById("profile-avatar-img");
      if (avatarImg) {
        // Generate a random color for the avatar
        const colors = ["7B68EE", "00E5FF", "FF5E94", "00D4BC", "6F42C1"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        avatarImg.src = `https://ui-avatars.com/api/?name=Mostafa+Chiba&background=${randomColor}&color=fff`;
      }
    });
  }
}

// Function to show success toast message
function showSuccessToast() {
  const toast = document.getElementById("settings-toast");
  if (toast) {
    toast.classList.add("show");

    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
}

// Function to apply theme (mock implementation)
function applyTheme(theme) {
  const body = document.body;

  switch (theme) {
    case "light":
      body.classList.remove("dark-mode");
      body.classList.add("light-mode");
      console.log("Light mode applied");
      break;
    case "dark":
      body.classList.remove("light-mode");
      body.classList.add("dark-mode");
      console.log("Dark mode applied");
      break;
    case "system":
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
        console.log("System preference: Dark mode applied");
      } else {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
        console.log("System preference: Light mode applied");
      }
      break;
  }
}
