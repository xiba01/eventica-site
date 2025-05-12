/* filepath: d:\OFPPT FS\Entrepreneuriat\AURA\js\landing_script.js */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize Particles.js for background effect
  initParticlesBackground();

  // Setup navigation behavior
  setupNavigation();

  // Initialize scroll animations
  initScrollAnimations();

  // Setup feature tabs
  setupFeatureTabs();

  // Initialize testimonial carousel
  initTestimonialCarousel();

  // Track demo button clicks
  trackDemoButtonClicks();

  // Initialize 3D tilt effect on cards
  initTiltEffect();

  // Setup scroll progress indicator
  setupScrollProgress();

  // Initialize floating CTA
  initFloatingCTA();

  // Add parallax effect to hero section
  initParallaxEffect();

  // Initialize magnetic effect for buttons
  initMagneticButtons();

  // Initialize typing effect for headings
  initTypingEffect();

  // Initialize custom cursor effect
  initCustomCursor();

  // Initialize animated background gradients
  initBackgroundAnimation();

  // Initialize scroll-triggered counter animations
  initScrollCounters();

  // Enhance smooth scrolling with animations
  enhanceSmoothScrolling();

  // Initialize footer 3D effect
  initFooter3DEffect();

  // Initialize text scramble effect (disabled)
  initTextScrambleEffect();
});

/**
 * Initialize particles.js background effect
 */
function initParticlesBackground() {
  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: ["#7b68ee", "#00e5ff", "#ff5e94"],
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
        },
        opacity: {
          value: 0.3,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#a496ff",
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: true,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "grab",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 0.8,
            },
          },
          push: {
            particles_nb: 4,
          },
        },
      },
      retina_detect: true,
    });
  } else {
    console.warn("Particles.js not loaded");
  }
}

/**
 * Set up navigation behavior
 */
function setupNavigation() {
  const navbar = document.querySelector(".navbar");
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  // Sticky navigation on scroll
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("show");

      // Animate hamburger to X
      this.classList.toggle("active");

      if (this.classList.contains("active")) {
        this.children[0].style.transform = "translateY(8px) rotate(45deg)";
        this.children[1].style.opacity = "0";
        this.children[2].style.transform = "translateY(-8px) rotate(-45deg)";
      } else {
        this.children[0].style.transform = "none";
        this.children[1].style.opacity = "1";
        this.children[2].style.transform = "none";
      }
    });
  }

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      // Close mobile menu if open
      if (navLinks.classList.contains("show")) {
        navLinks.classList.remove("show");
        if (mobileMenuToggle.classList.contains("active")) {
          mobileMenuToggle.click();
        }
      }

      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80, // Account for fixed navbar
          behavior: "smooth",
        });
      }
    });
  });
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
  const elementsToReveal = document.querySelectorAll(".reveal-on-scroll");

  // Function to check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <=
      (window.innerHeight || document.documentElement.clientHeight) * 0.85
    );
  }

  // Function to reveal elements
  function revealElements() {
    elementsToReveal.forEach((element) => {
      if (isInViewport(element)) {
        // Add delay if specified
        const delay = element.dataset.delay || 0;
        setTimeout(() => {
          element.classList.add("revealed");
        }, delay);
      }
    });
  }

  // Initial check on page load
  revealElements();

  // Check on scroll
  window.addEventListener("scroll", revealElements);
}

/**
 * Set up feature tabs functionality
 */
function setupFeatureTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons and panels
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabPanels.forEach((panel) => panel.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Show corresponding panel
      const targetPanel = document.getElementById(`${this.dataset.tab}-panel`);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });
}

/**
 * Initialize testimonial carousel
 */
function initTestimonialCarousel() {
  const track = document.querySelector(".testimonial-track");
  const cards = document.querySelectorAll(".testimonial-card");
  const prevButton = document.querySelector(".control.prev");
  const nextButton = document.querySelector(".control.next");
  const indicators = document.querySelectorAll(".indicator");

  if (!track || cards.length === 0) return;

  let currentIndex = 0;
  let cardWidth = cards[0].offsetWidth;
  const cardGap = 30; // Should match the gap in CSS
  const cardsPerView = getCardsPerView();

  // Responsive carousel
  function getCardsPerView() {
    if (window.innerWidth < 600) return 1;
    if (window.innerWidth < 1000) return 2;
    return 3;
  }

  // Update card width on window resize
  window.addEventListener("resize", function () {
    cardWidth = cards[0].offsetWidth;
    updateCarousel();
  });

  // Update carousel position
  function updateCarousel() {
    track.style.transform = `translateX(-${
      currentIndex * (cardWidth + cardGap)
    }px)`;

    // Update indicators
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentIndex);
    });
  }

  // Previous button
  if (prevButton) {
    prevButton.addEventListener("click", function () {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });
  }

  // Next button
  if (nextButton) {
    nextButton.addEventListener("click", function () {
      if (currentIndex < cards.length - cardsPerView) {
        currentIndex++;
        updateCarousel();
      }
    });
  }

  // Indicator buttons
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", function () {
      currentIndex = index;
      updateCarousel();
    });
  });

  // Initialize
  updateCarousel();

  // Auto-advance carousel
  setInterval(function () {
    if (currentIndex < cards.length - cardsPerView) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateCarousel();
  }, 7000);
}

/**
 * Track demo button clicks (for analytics)
 */
function trackDemoButtonClicks() {
  const demoButtons = document.querySelectorAll('a[href="index.html"]');

  demoButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // This is where you'd typically fire analytics events
      console.log("Demo button clicked:", this.id || "unnamed button");

      // For demonstration, add a pulse effect
      this.classList.add("pulse");
      setTimeout(() => {
        this.classList.remove("pulse");
      }, 1000);
    });
  });
}

/**
 * Utility function to animate counting up numbers
 * @param {HTMLElement} element - The element containing the number
 * @param {number} target - The target number to count to
 * @param {number} duration - Animation duration in milliseconds
 * @param {string} prefix - Prefix for the number (e.g., "$")
 * @param {string} suffix - Suffix for the number (e.g., "+")
 */
function animateCounter(
  element,
  target,
  duration = 2000,
  prefix = "",
  suffix = ""
) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start > target) {
      start = target;
      clearInterval(timer);
    }
    element.textContent = `${prefix}${Math.floor(start)}${suffix}`;
  }, 16);
}

/**
 * Initialize 3D tilt effect on cards and feature elements
 */
function initTiltEffect() {
  const tiltElements = document.querySelectorAll(
    ".solution-item, .problem-item, .pricing-card, .testimonial-card, .feature-card"
  );

  tiltElements.forEach((element) => {
    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xPercent = x / rect.width - 0.5;
      const yPercent = y / rect.height - 0.5;

      const maxRotation = 5; // Maximum rotation in degrees
      const rotateX = yPercent * maxRotation * -1;
      const rotateY = xPercent * maxRotation;

      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      element.style.transition = "none";

      // Add subtle shadow and highlight effect
      const glareX = 100 + xPercent * 10;
      const glareY = 100 + yPercent * 10;
      element.style.background = `
        linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.03) 0%, 
          rgba(255, 255, 255, 0.01) 40%, 
          rgba(255, 255, 255, 0.05) 80%
        ), var(--bg-card)`;
      element.style.boxShadow = `
        0 10px 25px rgba(0, 0, 0, 0.3),
        ${-xPercent * 10}px ${-yPercent * 10}px 20px rgba(157, 110, 255, 0.03),
        ${xPercent * 10}px ${yPercent * 10}px 20px rgba(0, 229, 255, 0.03)
      `;
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
      element.style.background = "";
      element.style.boxShadow = "";
      element.style.transition =
        "transform 0.5s ease, box-shadow 0.5s ease, background 0.5s ease";
    });
  });
}

/**
 * Setup scroll progress indicator
 */
function setupScrollProgress() {
  // Create progress bar
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress-bar";
  document.body.appendChild(progressBar);

  // Update progress on scroll
  window.addEventListener("scroll", () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";

    // Add active class when scrolled
    if (winScroll > 100) {
      progressBar.classList.add("active");
    } else {
      progressBar.classList.remove("active");
    }
  });
}

/**
 * Initialize floating CTA button
 */
function initFloatingCTA() {
  // Create floating CTA
  const floatingCTA = document.createElement("a");
  floatingCTA.className = "floating-cta";
  floatingCTA.href = "index.html";
  floatingCTA.innerHTML = `
    <span>View Demo</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  `;
  document.body.appendChild(floatingCTA);

  // Show/hide floating CTA based on scroll position
  let lastScrollTop = 0;
  const heroHeight = document.querySelector(".hero").offsetHeight;
  const ctaSection = document.querySelector(".cta-section");

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Only show when scrolling down, past hero section, and not in CTA section
    if (scrollTop > heroHeight && scrollTop > lastScrollTop) {
      floatingCTA.classList.add("visible");
    } else {
      floatingCTA.classList.remove("visible");
    }

    // Hide when reaching the bottom CTA section
    if (ctaSection) {
      const ctaPosition = ctaSection.getBoundingClientRect();
      if (ctaPosition.top < window.innerHeight && ctaPosition.bottom > 0) {
        floatingCTA.classList.remove("visible");
      }
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });
}

/**
 * Initialize parallax effect for hero section
 */
function initParallaxEffect() {
  const heroVisual = document.querySelector(".hero-visual");
  const floatingElements = document.querySelectorAll(".floating-ui-element");

  if (heroVisual && floatingElements.length) {
    window.addEventListener("mousemove", (e) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;

      floatingElements.forEach((element, index) => {
        const depth = (index + 1) * 10;
        const moveX = (mouseX - 0.5) * depth;
        const moveY = (mouseY - 0.5) * depth;

        element.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });

      heroVisual.style.transform = `translate3d(${(mouseX - 0.5) * -5}px, ${
        (mouseY - 0.5) * -5
      }px, 0)`;
    });
  }

  // Enhanced parallax effect for scrolling
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const sections = document.querySelectorAll("section");

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionMiddle = sectionTop + sectionHeight / 2;
      const distanceFromMiddle = scrollY - sectionMiddle;
      const parallaxSpeed = 0.2;

      if (section.classList.contains("hero")) {
        section.style.backgroundPositionY = `${scrollY * 0.5}px`;
      } else {
        // Apply subtle background shift based on scroll position
        const backgroundShift = distanceFromMiddle * parallaxSpeed;
        if (section.querySelector(".section-container")) {
          section.querySelector(
            ".section-container"
          ).style.transform = `translateY(${backgroundShift * 0.05}px)`;
        }
      }
    });
  });
}

/**
 * Create a magnetic effect for buttons
 */
function initMagneticButtons() {
  const buttons = document.querySelectorAll(".cta-button");

  buttons.forEach((button) => {
    button.addEventListener("mousemove", (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const magneticPull = 0.4; // Amount of pull (lower = stronger)

      button.style.transform = `translate(${x * magneticPull}px, ${
        y * magneticPull
      }px)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "translate(0px, 0px)";
      button.style.transition = "transform 0.3s ease";
    });
  });
}

/**
 * Create a typing effect for headings
 */
function initTypingEffect() {
  const headings = document.querySelectorAll(".typing-effect");

  headings.forEach((heading) => {
    const text = heading.textContent;
    heading.textContent = "";
    heading.style.visibility = "visible";

    let i = 0;
    // Increase typing speed by reducing interval from 100ms to 30ms
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        heading.textContent += text.charAt(i);
        i++;
        // Add multiple characters at once for longer texts
        if (text.length > 50 && i < text.length) {
          // For every iteration, add 2 more characters if text is long
          heading.textContent += text.charAt(i);
          i++;
        }
      } else {
        clearInterval(typingInterval);
        heading.classList.add("typing-complete");
      }
    }, 30);
  });
}

/**
 * Create a custom cursor effect
 */
function initCustomCursor() {
  // Create custom cursor element
  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  document.body.appendChild(cursor);

  // Create cursor follower (larger circle)
  const follower = document.createElement("div");
  follower.className = "cursor-follower";
  document.body.appendChild(follower);

  // Update cursor position on mouse move
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;

    // Follower follows with a delay
    setTimeout(() => {
      follower.style.left = `${e.clientX}px`;
      follower.style.top = `${e.clientY}px`;
    }, 80);
  });

  // Add hover effect for interactive elements
  const interactiveElements = document.querySelectorAll(
    "a, button, .testimonial-card, .pricing-card, .feature-card, .solution-item, .problem-item"
  );

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("cursor-hover");
      follower.classList.add("follower-hover");
    });

    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("cursor-hover");
      follower.classList.remove("follower-hover");
    });
  });
}

/**
 * Initialize animated background gradients
 */
function initBackgroundAnimation() {
  const sections = document.querySelectorAll(
    ".features, .pricing, .problem-solution, .testimonials"
  );

  sections.forEach((section, index) => {
    // Create gradient overlay
    const gradientOverlay = document.createElement("div");
    gradientOverlay.className = "animated-gradient";
    section.appendChild(gradientOverlay);

    // Set unique animation delay for each section
    gradientOverlay.style.animationDelay = `${index * 2}s`;
  });
}

/**
 * Initialize scroll-triggered counter animations
 */
function initScrollCounters() {
  // Create stats section elements if they don't exist
  if (!document.querySelector(".stats-section")) {
    const statsSection = document.createElement("div");
    statsSection.className = "stats-section";
    statsSection.innerHTML = `
      <div class="section-container">
        <div class="stats-grid">
          <div class="stat-item reveal-on-scroll">
            <div class="stat-number" data-count="97">0</div>
            <div class="stat-label">Satisfaction Rate</div>
          </div>
          <div class="stat-item reveal-on-scroll">
            <div class="stat-number" data-count="500">0</div>
            <div class="stat-label">Events Powered</div>
          </div>
          <div class="stat-item reveal-on-scroll">
            <div class="stat-number" data-count="70">0</div>
            <div class="stat-label">Time Saved</div>
          </div>
          <div class="stat-item reveal-on-scroll">
            <div class="stat-number" data-count="24">0</div>
            <div class="stat-label">Countries</div>
          </div>
        </div>
      </div>
    `;

    // Insert before pricing section
    const pricingSection = document.querySelector("#pricing");
    pricingSection.parentNode.insertBefore(statsSection, pricingSection);
  }

  // Set up intersection observer for counting animation
  const statNumbers = document.querySelectorAll(".stat-number");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const target = parseInt(element.getAttribute("data-count"), 10);
          const duration = 2000; // milliseconds
          let suffix = "";

          // Add % suffix for first stat and + for others where appropriate
          if (
            element.parentElement
              .querySelector(".stat-label")
              .textContent.includes("Rate")
          ) {
            suffix = "%";
          } else if (
            element.parentElement
              .querySelector(".stat-label")
              .textContent.includes("Saved")
          ) {
            suffix = "%";
          } else if (
            element.parentElement
              .querySelector(".stat-label")
              .textContent.includes("Events")
          ) {
            suffix = "+";
          }

          animateCounter(element, target, duration, "", suffix);
          observer.unobserve(element);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((number) => {
    observer.observe(number);
  });
}

/**
 * Enhance smooth scrolling with animations
 */
function enhanceSmoothScrolling() {
  // Enhanced smooth scrolling with additional animations
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      // Get the target section
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);

      if (!target) return;

      // Create a flash effect when clicking navigation links
      const flashEffect = document.createElement("div");
      flashEffect.className = "nav-flash-effect";
      this.appendChild(flashEffect);

      // Remove flash effect after animation completes
      setTimeout(() => {
        flashEffect.remove();
      }, 700);

      // Smooth scroll to target with a bit of offset for fixed navbar
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "smooth",
      });

      // Highlight the section being scrolled to
      target.classList.add("section-highlight");
      setTimeout(() => {
        target.classList.remove("section-highlight");
      }, 1500);
    });
  });
}

/**
 * Create text scramble effect for section headings
 * (Disabled as per request to remove random word animation from section titles)
 */
function initTextScrambleEffect() {
  // Function has been disabled to remove the text scramble animation effect
  // Original implementation removed
}

/**
 * Initialize 3D hover effect for footer
 */
function initFooter3DEffect() {
  const footer = document.querySelector(".footer");
  const footerContainer = document.querySelector(".footer-container");

  if (!footer || !footerContainer) return;

  // Create 3D perspective container
  footer.style.perspective = "1000px";
  footerContainer.style.transformStyle = "preserve-3d";
  footerContainer.style.transition = "transform 0.5s ease";

  // Add mouse move event for 3D tilt
  footer.addEventListener("mousemove", (e) => {
    const rect = footer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / rect.width - 0.5) * 2;
    const yPercent = (y / rect.height - 0.5) * 2;

    // Subtle tilt effect
    const tiltAmount = 2;
    const tiltX = yPercent * tiltAmount * -1;
    const tiltY = xPercent * tiltAmount;

    footerContainer.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;
  });

  // Reset on mouse leave
  footer.addEventListener("mouseleave", () => {
    footerContainer.style.transform = "rotateX(0) rotateY(0) translateZ(0)";
  });

  // Add glow effect
  const glow = document.createElement("div");
  glow.className = "footer-glow";
  glow.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at var(--x) var(--y), 
      rgba(123, 104, 238, 0.15) 0%, 
      rgba(123, 104, 238, 0.05) 20%, 
      transparent 60%);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.5s ease;
  `;
  footer.appendChild(glow);

  // Move glow with cursor
  footer.addEventListener("mousemove", (e) => {
    const rect = footer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    glow.style.setProperty("--x", `${x}px`);
    glow.style.setProperty("--y", `${y}px`);
    glow.style.opacity = "1";
  });

  // Hide glow on mouse leave
  footer.addEventListener("mouseleave", () => {
    glow.style.opacity = "0";
  });
}
