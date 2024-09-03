document.addEventListener("DOMContentLoaded", function () {
  const tooltipToggle = document.getElementById("tooltip-toggle");
  const availableCities = document.getElementById("available-cities");
  const apiUrl =
    "https://app.gridaly.com/api/v1/event/blum-w-trasie-2024/tickets";

  // Update tooltip and central list function
  function updateTooltip(events) {
    availableCities.innerHTML = ""; // Clear the list

    events.forEach((event) => {
      const cityPoint = document.querySelector(`[data-event-id="${event.id}"]`);
      if (cityPoint) {
        const linkUrl = cityPoint.getAttribute("data-link");

        // Create the tooltip content
        const tooltipText = `${event.name}<br><a href="${linkUrl}">Zapisz się</a>`;

        if (event.saleStatus === "onGoing") {
          cityPoint.classList.add("available");

          // Tooltip for map points
          const tooltip = document.createElement("div");
          tooltip.classList.add("map-point-tooltip");
          tooltip.innerHTML = tooltipText;
          cityPoint.appendChild(tooltip);

          cityPoint.addEventListener("mouseenter", () => {
            tooltip.style.display = "block";
          });

          cityPoint.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
          });
        }

        // Add to central list
        const li = document.createElement("li");
        li.innerHTML = `<a href="${linkUrl}">${event.name}</a>`;
        availableCities.appendChild(li);
      }
    });

    // If no events are available
    if (events.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Brak dostępnych wydarzeń";
      availableCities.appendChild(li);
    }
  }

  // Fetch API data
  async function fetchEventData() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log(data);

      const events = data.tickets;
      updateTooltip(events);
    } catch (error) {
      console.error("Błąd podczas pobierania danych z API:", error);
    }
  }

  tooltipToggle.addEventListener("click", () => {
    if (
      availableCities.style.display === "none" ||
      availableCities.style.display === ""
    ) {
      availableCities.style.display = "block";
      tooltipToggle.innerHTML = "Ukryj dostępne miasta";
    } else {
      availableCities.style.display = "none";
      tooltipToggle.innerHTML =
        'Wybierz miasto <span class="arrow-tooltip-button">&#x2192;</span>';
    }
  });

  fetchEventData();
});
