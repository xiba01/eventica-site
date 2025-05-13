// AURA Analytics Dashboard JavaScript
// This file contains all the functionality for interactive charts and data visualization

// Mock data for visualizations
const analyticsData = {
  // Attendance data over time
  attendance: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    values: [120, 150, 180, 210, 190, 240, 280, 320, 280],
    previousPeriod: [100, 130, 140, 160, 150, 200, 230, 210, 190],
  },

  // Registration data (can toggle to show this instead of attendance)
  registrations: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    values: [180, 220, 240, 280, 250, 310, 350, 400, 350],
    previousPeriod: [150, 190, 200, 230, 210, 260, 300, 280, 240],
  },

  // Engagement breakdown for donut chart
  engagementSources: [
    { label: "Interactive Sessions", value: 35, color: "#7e57c2" },
    { label: "Q&A Participation", value: 25, color: "#4caf50" },
    { label: "Social Media", value: 15, color: "#2196f3" },
    { label: "Live Polling", value: 15, color: "#ff9800" },
    { label: "Post-Event Survey", value: 10, color: "#f44336" },
  ],

  // ROI and Cost data for grouped bar chart
  roiCostData: [
    { category: "Conference", roi: 85, cost: 65 },
    { category: "Workshop", roi: 70, cost: 40 },
    { category: "Webinar", roi: 60, cost: 20 },
    { category: "Trade Show", roi: 90, cost: 85 },
  ],

  // Word cloud data for feedback sentiment
  feedbackSentiment: [
    { text: "Engaging", size: 48, sentiment: "positive", color: "#4caf50" },
    { text: "Informative", size: 42, sentiment: "positive", color: "#4caf50" },
    { text: "Professional", size: 36, sentiment: "positive", color: "#4caf50" },
    { text: "Innovative", size: 38, sentiment: "positive", color: "#4caf50" },
    { text: "Long", size: 28, sentiment: "negative", color: "#f44336" },
    { text: "Technical", size: 32, sentiment: "neutral", color: "#2196f3" },
    { text: "Interactive", size: 36, sentiment: "positive", color: "#4caf50" },
    { text: "Inspiring", size: 34, sentiment: "positive", color: "#4caf50" },
    { text: "Rushed", size: 24, sentiment: "negative", color: "#f44336" },
    { text: "Detailed", size: 30, sentiment: "neutral", color: "#2196f3" },
    { text: "Expensive", size: 26, sentiment: "negative", color: "#f44336" },
    { text: "Valuable", size: 40, sentiment: "positive", color: "#4caf50" },
    { text: "Practical", size: 36, sentiment: "positive", color: "#4caf50" },
    { text: "Complex", size: 28, sentiment: "neutral", color: "#2196f3" },
    { text: "Worthwhile", size: 32, sentiment: "positive", color: "#4caf50" },
  ],
};

// Initialize charts when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Only initialize if we're on the analytics page
  if (document.querySelector(".analytics-page-container")) {
    // Wait a little bit for the page to fully render before initializing charts
    setTimeout(initAnalyticsDashboard, 100);
  }
});

// Initialize the entire analytics dashboard
function initAnalyticsDashboard() {
  // Setup date range picker toggle
  setupDateRangePicker();

  // Setup KPI card click events
  setupKPICardInteractions();

  // Initialize all charts
  drawAttendanceLineChart();
  drawEngagementDonutChart();
  drawROICostChart();
  createWordCloud();

  // Setup chart control toggles
  setupChartToggles();

  // Setup tooltips
  setupTooltips();
}

// Setup date range picker dropdown
function setupDateRangePicker() {
  const dateBtn = document.getElementById("analytics-date-presets-btn");
  const dropdown = document.querySelector(".date-presets-dropdown");

  // Toggle dropdown visibility
  dateBtn.addEventListener("click", function () {
    dropdown.style.display =
      dropdown.style.display === "none" ? "block" : "none";
  });

  // Handle preset selection
  const presetButtons = dropdown.querySelectorAll("button");
  presetButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const range = this.dataset.range;
      let rangeText;

      switch (range) {
        case "7d":
          rangeText = "Last 7 Days";
          break;
        case "30d":
          rangeText = "Last 30 Days";
          break;
        case "90d":
          rangeText = "Last 90 Days";
          break;
        case "ytd":
          rangeText = "Year to Date";
          break;
        case "custom":
          // Here you would open a date picker dialog
          // For now we'll just use a placeholder
          document.getElementById("custom-date-range-display").textContent =
            "Mar 15, 2024 - Jun 15, 2024";
          rangeText = "Custom Range";
          break;
      }

      // Update button text (except for custom)
      if (range !== "custom") {
        dateBtn.innerHTML =
          rangeText +
          '<svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>';
        document.getElementById("custom-date-range-display").textContent = "";
      } else {
        dateBtn.innerHTML =
          'Custom Range<svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>';
      }

      dropdown.style.display = "none";

      // Refresh charts with new date range
      // In a real app, this would fetch data for the selected range
      setTimeout(() => {
        drawAttendanceLineChart();
        drawEngagementDonutChart();
        drawROICostChart();
      }, 300);
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".date-range-picker-container")) {
      dropdown.style.display = "none";
    }
  });
}

// Setup KPI card interactions
function setupKPICardInteractions() {
  const kpiCards = document.querySelectorAll(".kpi-card");

  kpiCards.forEach((card) => {
    card.addEventListener("click", function () {
      const kpiType = this.dataset.kpi;

      // Here you would typically show a detailed breakdown modal
      // or navigate to a detailed view for this KPI
      console.log(`Showing detailed breakdown for KPI: ${kpiType}`);

      // For demo purposes, just add a visual feedback
      this.classList.add("highlight-pulse");
      setTimeout(() => {
        this.classList.remove("highlight-pulse");
      }, 800);
    });
  });
}

// Draw the attendance line chart
function drawAttendanceLineChart() {
  const svg = document.getElementById("attendance-line-chart");
  if (!svg) return;

  // Clear existing content
  svg.innerHTML = "";

  // Get SVG container dimensions
  const svgRect = svg.getBoundingClientRect();
  const width = svgRect.width || 500;
  const height = 250;

  // Set explicit dimensions on the SVG to ensure proper sizing
  svg.style.width = "100%";
  svg.style.height = "250px";

  // Update viewBox to match container dimensions
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  const padding = { top: 20, right: 30, bottom: 30, left: 40 };

  // Get current data based on active toggle
  const activeToggle = document.querySelector(".chart-toggle-btn.active");
  const activeMetric = activeToggle
    ? activeToggle.dataset.metric
    : "attendance";
  const data = analyticsData[activeMetric];

  // Calculate scales
  const maxValue = Math.max(...data.values) * 1.1; // Add 10% padding

  // X scale
  const xStep =
    (width - padding.left - padding.right) / (data.labels.length - 1);

  // Y scale
  const yScale = (height - padding.top - padding.bottom) / maxValue;

  // Draw axes
  // X-axis
  const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "g");
  xAxis.setAttribute("class", "x-axis");

  // Y-axis
  const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "g");
  yAxis.setAttribute("class", "y-axis");

  // Draw the vertical line for y-axis
  const yAxisLine = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );
  yAxisLine.setAttribute("x1", padding.left);
  yAxisLine.setAttribute("y1", padding.top);
  yAxisLine.setAttribute("x2", padding.left);
  yAxisLine.setAttribute("y2", height - padding.bottom);
  yAxisLine.setAttribute("stroke", "#444");
  yAxisLine.setAttribute("stroke-width", "1");
  yAxis.appendChild(yAxisLine);

  // Draw the horizontal line for x-axis
  const xAxisLine = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );
  xAxisLine.setAttribute("x1", padding.left);
  xAxisLine.setAttribute("y1", height - padding.bottom);
  xAxisLine.setAttribute("x2", width - padding.right);
  xAxisLine.setAttribute("y2", height - padding.bottom);
  xAxisLine.setAttribute("stroke", "#444");
  xAxisLine.setAttribute("stroke-width", "1");
  xAxis.appendChild(xAxisLine);

  // Create y-axis ticks
  const tickCount = 5;
  const tickStep = maxValue / (tickCount - 1);

  for (let i = 0; i < tickCount; i++) {
    const tickValue = Math.round(i * tickStep);
    const yPos = height - padding.bottom - tickValue * yScale;

    // Tick mark
    const tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
    tick.setAttribute("x1", padding.left - 5);
    tick.setAttribute("y1", yPos);
    tick.setAttribute("x2", padding.left);
    tick.setAttribute("y2", yPos);
    tick.setAttribute("stroke", "#888");
    tick.setAttribute("stroke-width", "1");
    yAxis.appendChild(tick);

    // Tick label
    const label = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    label.setAttribute("x", padding.left - 8);
    label.setAttribute("y", yPos + 4);
    label.setAttribute("text-anchor", "end");
    label.setAttribute("font-size", "10");
    label.setAttribute("fill", "#888");
    label.textContent = tickValue;
    yAxis.appendChild(label);

    // Horizontal grid line
    const gridLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    gridLine.setAttribute("x1", padding.left);
    gridLine.setAttribute("y1", yPos);
    gridLine.setAttribute("x2", width - padding.right);
    gridLine.setAttribute("y2", yPos);
    gridLine.setAttribute("stroke", "#444");
    gridLine.setAttribute("stroke-width", "0.5");
    gridLine.setAttribute("stroke-dasharray", "3,3");
    yAxis.appendChild(gridLine);
  }

  // Add x-axis labels
  data.labels.forEach((label, i) => {
    const xPos = padding.left + i * xStep;

    // Tick mark
    const tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
    tick.setAttribute("x1", xPos);
    tick.setAttribute("y1", height - padding.bottom);
    tick.setAttribute("x2", xPos);
    tick.setAttribute("y2", height - padding.bottom + 5);
    tick.setAttribute("stroke", "#888");
    tick.setAttribute("stroke-width", "1");
    xAxis.appendChild(tick);

    // Label
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", xPos);
    text.setAttribute("y", height - padding.bottom + 20);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "10");
    text.setAttribute("fill", "#888");
    text.textContent = label;
    xAxis.appendChild(text);
  });

  svg.appendChild(xAxis);
  svg.appendChild(yAxis);

  // Create line for current period
  const currentLine = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  let pathD = `M ${padding.left} ${
    height - padding.bottom - data.values[0] * yScale
  }`;

  // Add path points
  data.values.forEach((value, i) => {
    const x = padding.left + i * xStep;
    const y = height - padding.bottom - value * yScale;
    pathD += ` L ${x} ${y}`;
  });

  currentLine.setAttribute("d", pathD);
  currentLine.setAttribute("fill", "none");
  currentLine.setAttribute("stroke", "#7e57c2");
  currentLine.setAttribute("stroke-width", "3");
  svg.appendChild(currentLine);

  // Add data points with hover effect
  data.values.forEach((value, i) => {
    const x = padding.left + i * xStep;
    const y = height - padding.bottom - value * yScale;

    const dataPoint = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    dataPoint.setAttribute("cx", x);
    dataPoint.setAttribute("cy", y);
    dataPoint.setAttribute("r", "5");
    dataPoint.setAttribute("fill", "#7e57c2");
    dataPoint.setAttribute("stroke", "#fff");
    dataPoint.setAttribute("stroke-width", "2");

    // Add data point hover functionality
    dataPoint.dataset.value = value;
    dataPoint.dataset.label = data.labels[i];
    dataPoint.addEventListener("mouseover", function (event) {
      // Visual feedback
      this.setAttribute("r", "7");

      // Show tooltip
      const tooltip = document.querySelector(".chart-tooltip");
      tooltip.textContent = `${this.dataset.label}: ${this.dataset.value} ${
        activeMetric === "attendance" ? "attendees" : "registrations"
      }`;
      tooltip.style.opacity = "1";

      // Position tooltip
      tooltip.style.left = `${event.pageX}px`;
      tooltip.style.top = `${event.pageY - 30}px`;
    });

    dataPoint.addEventListener("mouseout", function () {
      this.setAttribute("r", "5");

      // Hide tooltip
      const tooltip = document.querySelector(".chart-tooltip");
      tooltip.style.opacity = "0";
    });

    svg.appendChild(dataPoint);
  });

  // Create optional comparison line (previous period)
  const comparePeriod = document.getElementById(
    "analytics-compare-period"
  ).value;
  if (comparePeriod !== "none") {
    const comparisonLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    let compPathD = `M ${padding.left} ${
      height - padding.bottom - data.previousPeriod[0] * yScale
    }`;

    // Add path points
    data.previousPeriod.forEach((value, i) => {
      const x = padding.left + i * xStep;
      const y = height - padding.bottom - value * yScale;
      compPathD += ` L ${x} ${y}`;
    });

    comparisonLine.setAttribute("d", compPathD);
    comparisonLine.setAttribute("fill", "none");
    comparisonLine.setAttribute("stroke", "#444");
    comparisonLine.setAttribute("stroke-width", "2");
    comparisonLine.setAttribute("stroke-dasharray", "5,5");
    svg.appendChild(comparisonLine);

    // Add data points for comparison
    data.previousPeriod.forEach((value, i) => {
      const x = padding.left + i * xStep;
      const y = height - padding.bottom - value * yScale;

      const dataPoint = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      dataPoint.setAttribute("cx", x);
      dataPoint.setAttribute("cy", y);
      dataPoint.setAttribute("r", "3");
      dataPoint.setAttribute("fill", "#444");
      dataPoint.setAttribute("stroke", "#fff");
      dataPoint.setAttribute("stroke-width", "1");

      // Add hover functionality
      dataPoint.dataset.value = value;
      dataPoint.dataset.label = data.labels[i];
      dataPoint.addEventListener("mouseover", function (event) {
        // Visual feedback
        this.setAttribute("r", "5");

        // Show tooltip
        const tooltip = document.querySelector(".chart-tooltip");
        tooltip.textContent = `${this.dataset.label} (Previous): ${
          this.dataset.value
        } ${activeMetric === "attendance" ? "attendees" : "registrations"}`;
        tooltip.style.opacity = "1";

        // Position tooltip
        tooltip.style.left = `${event.pageX}px`;
        tooltip.style.top = `${event.pageY - 30}px`;
      });

      dataPoint.addEventListener("mouseout", function () {
        this.setAttribute("r", "3");

        // Hide tooltip
        const tooltip = document.querySelector(".chart-tooltip");
        tooltip.style.opacity = "0";
      });

      svg.appendChild(dataPoint);
    });
  }
}

// Draw the engagement donut chart
function drawEngagementDonutChart() {
  const svg = document.getElementById("engagement-donut-chart");
  const legendContainer = document.getElementById("engagement-legend");

  if (!svg || !legendContainer) return;

  // Clear existing content
  svg.innerHTML = "";
  legendContainer.innerHTML = "";

  // Ensure the SVG is set with proper viewBox and aspect ratio
  svg.setAttribute("viewBox", "-1 -1 2 2");
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  // Set explicit dimensions for the donut chart
  svg.style.width = "100%";
  svg.style.height = "250px"; // Updated to match our standardized height

  // Ensure the chart maintains a good aspect ratio
  const svgParent = svg.parentElement;
  if (svgParent) {
    const parentWidth = svgParent.offsetWidth;
    if (parentWidth < 300) {
      svg.style.height = `${parentWidth}px`;
    }
  }

  const data = analyticsData.engagementSources;

  // Calculate total for percentages
  const total = data.reduce((acc, item) => acc + item.value, 0);

  // Track start angle for creating arcs
  let startAngle = 0;

  // Create donut chart segments
  data.forEach((item, index) => {
    // Calculate angle
    const angle = (item.value / total) * (2 * Math.PI);

    // Calculate end angle
    const endAngle = startAngle + angle;

    // Create SVG arc path (using SVG path arc commands)
    const largeArcFlag = angle > Math.PI ? 1 : 0;

    // Calculate coordinates
    const startX = Math.cos(startAngle) * 0.7; // 0.7 is the radius
    const startY = Math.sin(startAngle) * 0.7;
    const endX = Math.cos(endAngle) * 0.7;
    const endY = Math.sin(endAngle) * 0.7;

    // Create path
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const pathData = [
      `M ${startX} ${startY}`, // Move to start point
      `A 0.7 0.7 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Draw arc
      "L 0 0", // Line to center
      "Z", // Close path
    ].join(" ");

    path.setAttribute("d", pathData);
    path.setAttribute("fill", item.color);
    path.setAttribute("stroke", "#181824");
    path.setAttribute("stroke-width", "0.01");

    // Interactive elements
    path.dataset.label = item.label;
    path.dataset.value = item.value;
    path.dataset.percent = Math.round((item.value / total) * 100);

    path.addEventListener("mouseover", function (event) {
      // Visual feedback
      this.setAttribute("opacity", "0.8");

      // Show tooltip
      const tooltip = document.querySelector(".chart-tooltip");
      tooltip.textContent = `${this.dataset.label}: ${this.dataset.value} (${this.dataset.percent}%)`;
      tooltip.style.opacity = "1";

      // Position tooltip
      const rect = svg.getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width / 2}px`;
      tooltip.style.top = `${rect.top + rect.height / 2 - 30}px`;
    });

    path.addEventListener("mouseout", function () {
      this.setAttribute("opacity", "1");

      // Hide tooltip
      const tooltip = document.querySelector(".chart-tooltip");
      tooltip.style.opacity = "0";
    });

    svg.appendChild(path);

    // Update start angle for next segment
    startAngle = endAngle;

    // Add to legend
    const legendItem = document.createElement("li");
    const colorSquare = document.createElement("span");
    colorSquare.classList.add("legend-color");
    colorSquare.style.backgroundColor = item.color;

    const legendText = document.createElement("span");
    legendText.textContent = `${item.label} (${Math.round(
      (item.value / total) * 100
    )}%)`;

    legendItem.appendChild(colorSquare);
    legendItem.appendChild(legendText);
    legendContainer.appendChild(legendItem);
  });

  // Add center circle to create donut hole
  const centerCircle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  centerCircle.setAttribute("cx", "0");
  centerCircle.setAttribute("cy", "0");
  centerCircle.setAttribute("r", "0.4"); // Adjust for desired hole size
  centerCircle.setAttribute("fill", "#1f1f32");
  centerCircle.setAttribute("stroke", "none");
  svg.appendChild(centerCircle);
}

// Draw ROI & Cost analysis bar chart
function drawROICostChart() {
  const container = document.getElementById("roi-cost-chart");
  if (!container) return;

  // Clear existing content
  container.innerHTML = "";

  // Use container height defined in CSS rather than setting it explicitly
  const containerRect = container.getBoundingClientRect();
  const containerWidth = containerRect.width;
  const containerHeight = containerRect.height || 250; // Use existing height or default to 250px
  const maxBarHeight = containerHeight * 0.7; // 70% of container height for bars

  const data = analyticsData.roiCostData;

  // Find max value for scaling
  const maxValue = Math.max(
    ...data.map((item) => Math.max(item.roi, item.cost))
  );

  // Calculate bar width based on container width
  const barWidth = Math.max(
    20,
    Math.min(40, containerWidth / (data.length * 3))
  ); // Responsive bar width

  // Create bar groups
  data.forEach((item) => {
    const barGroup = document.createElement("div");
    barGroup.className = "bar-group";

    // ROI bar
    const roiBar = document.createElement("div");
    roiBar.className = "bar roi";
    roiBar.style.height = `${(item.roi / maxValue) * maxBarHeight}px`;
    roiBar.style.width = `${barWidth}px`;

    // Add hover functionality
    roiBar.dataset.value = item.roi;
    roiBar.dataset.category = item.category;
    roiBar.addEventListener("mouseover", function (event) {
      // Show tooltip
      const tooltip = document.querySelector(".chart-tooltip");
      tooltip.textContent = `${this.dataset.category} ROI: ${this.dataset.value}%`;
      tooltip.style.opacity = "1";

      // Position tooltip
      tooltip.style.left = `${event.pageX}px`;
      tooltip.style.top = `${event.pageY - 30}px`;
    });

    roiBar.addEventListener("mouseout", function () {
      // Hide tooltip
      const tooltip = document.querySelector(".chart-tooltip");
      tooltip.style.opacity = "0";
    }); // Cost bar
    const costBar = document.createElement("div");
    costBar.className = "bar cost";
    costBar.style.height = `${(item.cost / maxValue) * maxBarHeight}px`;
    costBar.style.width = `${barWidth}px`;

    // Add hover functionality
    costBar.dataset.value = item.cost;
    costBar.dataset.category = item.category;
    costBar.addEventListener("mouseover", function (event) {
      // Show tooltip
      const tooltip = document.querySelector(".chart-tooltip");
      tooltip.textContent = `${this.dataset.category} Cost: ${this.dataset.value}k`;
      tooltip.style.opacity = "1";

      // Position tooltip
      tooltip.style.left = `${event.pageX}px`;
      tooltip.style.top = `${event.pageY - 30}px`;
    });

    costBar.addEventListener("mouseout", function () {
      // Hide tooltip
      const tooltip = document.querySelector(".chart-tooltip");
      tooltip.style.opacity = "0";
    });

    // Group label
    const label = document.createElement("div");
    label.className = "group-label";
    label.textContent = item.category;

    // Add elements to bar group
    barGroup.appendChild(roiBar);
    barGroup.appendChild(costBar);
    barGroup.appendChild(label);

    container.appendChild(barGroup);
  });
}

// Create word cloud for feedback sentiment
function createWordCloud() {
  const container = document.getElementById("feedback-word-cloud");
  if (!container) return;

  // Clear existing content
  container.innerHTML = "";

  // Get all words to use in word cloud
  const allWords = [...analyticsData.feedbackSentiment];

  // Shuffle the words array for randomized display
  const shuffledWords = [...allWords].sort(() => Math.random() - 0.5);

  // Create a container with relative positioning for absolute positioning of words
  container.style.display = "block";
  container.style.position = "relative";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.overflow = "hidden";
  // Get container dimensions
  const containerWidth = container.offsetWidth || 300;
  const containerHeight = container.offsetHeight || 250; // Updated to match our standardized height

  // Create a grid system for more structured placement
  const columns = 4;
  const rows = 4;
  const cellWidth = containerWidth / columns;
  const cellHeight = containerHeight / rows;

  // Track which cells are occupied to avoid overlap
  const occupiedCells = [];

  // Create word cloud with structured grid-based positioning
  shuffledWords.forEach((item, index) => {
    // Skip if we've filled all cells
    if (index >= columns * rows) return;

    const word = document.createElement("span");
    word.textContent = item.text;

    // Scale down font size for better fit
    word.style.fontSize = `${Math.min(item.size / 30, 1.2)}rem`;
    word.style.color = item.color;
    word.style.opacity = "0.9";
    word.style.fontWeight = item.size > 36 ? "bold" : "normal";
    word.style.position = "absolute";
    word.style.whiteSpace = "nowrap";
    word.style.overflow = "hidden";
    word.style.textOverflow = "ellipsis";
    word.style.display = "inline-block";
    word.style.textAlign = "center";

    // Find an unoccupied cell
    let cellRow,
      cellCol,
      attempts = 0;
    do {
      cellRow = Math.floor(Math.random() * rows);
      cellCol = Math.floor(Math.random() * columns);
      attempts++;

      // Prevent infinite loops
      if (attempts > 50) {
        // If too many attempts, just place it somewhere
        cellRow = index % rows;
        cellCol = Math.floor(index / rows);
        break;
      }
    } while (
      occupiedCells.some((cell) => cell.row === cellRow && cell.col === cellCol)
    );

    // Mark this cell as occupied
    occupiedCells.push({ row: cellRow, col: cellCol });

    // Calculate position within the cell (with some jitter for natural look)
    const baseX = cellCol * cellWidth;
    const baseY = cellRow * cellHeight;
    const jitterX = cellWidth * 0.2; // 20% of cell width for jitter
    const jitterY = cellHeight * 0.2; // 20% of cell height for jitter

    // Position with jitter, but keeping away from edges
    const left =
      baseX +
      (cellWidth - jitterX) * 0.5 +
      (Math.random() * jitterX - jitterX / 2);
    const top =
      baseY +
      (cellHeight - jitterY) * 0.5 +
      (Math.random() * jitterY - jitterY / 2);

    word.style.left = `${left}px`;
    word.style.top = `${top}px`; // Add hover functionality
    word.dataset.sentiment = item.sentiment;
    word.dataset.originalLeft = left;
    word.dataset.originalTop = top;

    word.addEventListener("mouseover", function (event) {
      // Visual feedback (just opacity change, no position change)
      this.style.opacity = "1";
      this.style.transform = "scale(1.05)";
      this.style.zIndex = "10"; // Bring to front

      // Show tooltip
      const tooltip = document.querySelector(".chart-tooltip");
      tooltip.textContent = `"${this.textContent}" - ${
        this.dataset.sentiment.charAt(0).toUpperCase() +
        this.dataset.sentiment.slice(1)
      } Sentiment`;
      tooltip.style.opacity = "1";

      // Position tooltip
      tooltip.style.left = `${event.pageX}px`;
      tooltip.style.top = `${event.pageY - 30}px`;
    });

    word.addEventListener("mouseout", function () {
      this.style.opacity = "0.9";
      this.style.transform = "scale(1)";
      this.style.zIndex = "1"; // Reset z-index

      // Hide tooltip
      const tooltip = document.querySelector(".chart-tooltip");
      tooltip.style.opacity = "0";
    });

    container.appendChild(word);
  });
}

// Setup chart toggle buttons
function setupChartToggles() {
  const toggleButtons = document.querySelectorAll(".chart-toggle-btn");

  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons in this control group
      this.parentNode
        .querySelectorAll(".chart-toggle-btn")
        .forEach((button) => {
          button.classList.remove("active");
        });

      // Add active class to clicked button
      this.classList.add("active");

      // Update chart based on selected metric
      if (this.dataset.metric) {
        drawAttendanceLineChart();
      }
    });
  });

  // Setup comparison period change
  const comparePeriodSelect = document.getElementById(
    "analytics-compare-period"
  );
  if (comparePeriodSelect) {
    comparePeriodSelect.addEventListener("change", function () {
      drawAttendanceLineChart();
    });
  }
}

// Function to handle window resize
function handleResize() {
  // Re-draw charts when window is resized
  drawAttendanceLineChart();
  drawEngagementDonutChart();
  drawROICostChart();
  createWordCloud();
}

// Setup tooltips for information icons
function setupTooltips() {
  // Add window resize handler
  window.addEventListener("resize", handleResize);

  const tooltipTriggers = document.querySelectorAll(".chart-tooltip-trigger");
  const tooltipContent = {
    "Attendance & Registrations Over Time":
      "Shows how many people attended vs. registered for events over time. Use this to track conversion rates and attendance patterns.",
    "Engagement Sources":
      "Breakdown of how attendees engaged with your event. This helps identify which interaction methods are most effective.",
    "ROI & Cost Breakdown":
      "Compares return on investment (ROI) against costs for different event types. Higher ROI with lower costs indicates more efficient event types.",
    "Attendee Feedback Sentiment":
      "Word cloud showing the most common feedback terms. Size indicates frequency, color indicates sentiment (green=positive, red=negative, blue=neutral).",
  };

  tooltipTriggers.forEach((trigger) => {
    trigger.addEventListener("mouseover", function (event) {
      // Find the chart title
      const chartTitle = this.parentNode.textContent
        .trim()
        .replace("(i)", "")
        .trim();

      // Show tooltip
      const tooltip = document.querySelector(".chart-tooltip");
      tooltip.textContent =
        tooltipContent[chartTitle] ||
        "Hover over chart elements for more details";
      tooltip.style.opacity = "1";

      // Position tooltip
      tooltip.style.left = `${event.pageX}px`;
      tooltip.style.top = `${event.pageY - 30}px`;
    });

    trigger.addEventListener("mouseout", function () {
      // Hide tooltip
      const tooltip = document.querySelector(".chart-tooltip");
      tooltip.style.opacity = "0";
    });
  });
}
