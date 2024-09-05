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
        let tooltipText = `${event.name}<br><a href="${linkUrl}">Zapisz się</a>`;

        if (event.saleStatus === "onGoing") {
          cityPoint.classList.add("available");

          // Tooltip for map points
          const tooltip = cityPoint.querySelector(".map-point-tooltip");

          if (tooltip) {
            tooltip.innerHTML = tooltipText;
          } else {
            const newTooltip = document.createElement("div");
            newTooltip.classList.add("map-point-tooltip");
            newTooltip.innerHTML = tooltipText;
            cityPoint.appendChild(newTooltip);

            cityPoint.addEventListener("mouseenter", () => {
              newTooltip.style.display = "block";
            });

            cityPoint.addEventListener("mouseleave", () => {
              newTooltip.style.display = "none";
            });
          }
        }

        // Add to central list
        const li = document.createElement("li");
        li.innerHTML = `<a href="${linkUrl}">${event.name}</a>`;
        li.addEventListener("click", () => {
          window.location.href = linkUrl; // Cały element li klikalny
        });
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
      addSecondEventTooltip(events); // Przekazanie danych do funkcji tooltipów
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

  document.addEventListener("click", function (event) {
    const isClickInside =
      availableCities.contains(event.target) ||
      tooltipToggle.contains(event.target);
    if (!isClickInside) {
      availableCities.style.display = "none";
      tooltipToggle.innerHTML =
        'Wybierz miasto <span class="arrow-tooltip-button">&#x2192;</span>';
    }
  });

  // Tooltip dla drugiego eventu, teraz z nazwami wydarzeń z API
  function addSecondEventTooltip(events) {
    const points = document.querySelectorAll(".map-point");

    points.forEach((point) => {
      const eventId = point.getAttribute("data-event-id");
      const eventLink = point.getAttribute("data-link");
      const secondEventId = point.getAttribute("second-event-id");
      const secondEventLink = point.getAttribute("second-data-link");

      // Znajdź wydarzenie dla pierwszego eventu
      const firstEvent = events.find((event) => event.id === eventId);
      const firstEventName = firstEvent ? firstEvent.name : "Event 1";

      // Znajdź wydarzenie dla drugiego eventu
      const secondEvent = events.find((event) => event.id === secondEventId);
      const secondEventName = secondEvent ? secondEvent.name : "Event 2";

      let tooltipContent = `<strong>${firstEventName}</strong><br><a href="${eventLink}" target="_blank">Zarejestruj się</a>`;

      // Jeśli punkt ma drugi event, dodajemy drugi event do tooltipa
      if (secondEventId && secondEventLink) {
        tooltipContent += `<br><br><br><strong>${secondEventName}</strong><br><a href="${secondEventLink}" target="_blank">Zarejestruj się</a>`;
      }

      const tooltip = point.querySelector(".map-point-tooltip");

      if (tooltip) {
        tooltip.innerHTML = tooltipContent;
      } else {
        const newTooltip = document.createElement("div");
        newTooltip.classList.add("map-point-tooltip");
        newTooltip.innerHTML = tooltipContent;
        point.appendChild(newTooltip);

        point.addEventListener("mouseenter", () => {
          newTooltip.style.display = "block";
        });

        point.addEventListener("mouseleave", () => {
          newTooltip.style.display = "none";
        });
      }
    });
  }

  fetchEventData();
});
