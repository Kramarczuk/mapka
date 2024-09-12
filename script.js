const apiUrl =
  "https://app.gridaly.com/api/v1/event/blum-w-trasie-2024/tickets";

if (document.readyState !== "loading") initBlumMap();
else document.addEventListener("DOMContentLoaded", initBlumMap);

function updateTooltip(events) {
  const availableCities = document.getElementById("available-cities");
  availableCities.innerHTML = "";

  events.forEach((event) => {
    const cityPoint = document.querySelector(`[data-event-id="${event.id}"]`);

    if (event.saleStatus === "onGoing") {
      if (cityPoint) {
        const linkUrl = cityPoint.getAttribute("data-link");
        const secondEventId = cityPoint.getAttribute("second-event-id");
        const secondEventLink = cityPoint.getAttribute("second-data-link");

        let tooltipText = `${event.name}<br><a href="${linkUrl}">Zapisz się</a>`;

        if (secondEventId && secondEventLink) {
          const secondEvent = events.find((e) => e.id === secondEventId);
          const secondEventName = secondEvent ? secondEvent.name : "Event 2";
          tooltipText += `<br><br><strong style= "font-weight: normal";>${secondEventName}</strong><br><a href="${secondEventLink}">Zapisz się</a>`;
        }

        cityPoint.classList.add("available");

        let tooltip = cityPoint.querySelector(".map-point-tooltip");

        if (!tooltip) {
          tooltip = document.createElement("div");
          tooltip.classList.add("map-point-tooltip");
          tooltip.innerHTML = tooltipText;
          cityPoint.appendChild(tooltip);

          cityPoint.addEventListener("mouseenter", () => {
            tooltip.style.display = "block";
          });

          cityPoint.addEventListener("mouseleave", () => {
            setTimeout(() => {
              if (!tooltip.matches(":hover") && !cityPoint.matches(":hover")) {
                tooltip.style.display = "none";
              }
            }, 300);
          });

          tooltip.addEventListener("mouseenter", () => {
            tooltip.style.display = "block";
          });

          tooltip.addEventListener("mouseleave", () => {
            setTimeout(() => {
              if (!tooltip.matches(":hover") && !cityPoint.matches(":hover")) {
                tooltip.style.display = "none";
              }
            }, 300);
          });
        } else {
          tooltip.innerHTML = tooltipText;
        }

        const li = document.createElement("li");
        li.innerHTML = `<a href="${linkUrl}">${event.name}</a>`;
        li.addEventListener("click", () => {
          window.location.href = linkUrl;
        });
        availableCities.appendChild(li);

        if (secondEventId && secondEventLink) {
          const secondEvent = events.find((e) => e.id === secondEventId);
          if (secondEvent) {
            const secondLi = document.createElement("li");
            secondLi.innerHTML = `<a href="${secondEventLink}">${secondEvent.name}</a>`;
            secondLi.addEventListener("click", () => {
              window.location.href = secondEventLink;
            });
            availableCities.appendChild(secondLi);
          }
        }
      }
    } else {
      // Ensure map point and list item are disabled if there are no tickets
      if (cityPoint) {
        cityPoint.classList.remove("available");

        cityPoint.style.pointerEvents = "none";

        const tooltip = cityPoint.querySelector(".map-point-tooltip");
        if (tooltip) {
          tooltip.remove();
        }
      }
    }
  });

  if (events.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Brak dostępnych wydarzeń";
    availableCities.appendChild(li);
  }
}

async function fetchEventData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const events = data.tickets;
    updateTooltip(events);
  } catch (error) {
    console.error("Błąd podczas pobierania danych z API:", error);
  }
}

function initBlumMap() {
  const tooltipToggle = document.getElementById("tooltip-toggle");
  const availableCities = document.getElementById("available-cities");

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

  document.querySelectorAll(".map-point").forEach((point) => {
    const eventId = point.getAttribute("data-event-id");
    const eventLink = point.getAttribute("data-link");

    // Add only default behavior here, updateTooltip() will handle saleStatus logic
    const tooltip = document.createElement("div");
    tooltip.classList.add("map-point-tooltip");
    tooltip.innerHTML = `<strong>Event Name</strong><br><a href="${eventLink}" target="_blank">Zapisz się</a>`;

    point.appendChild(tooltip);

    point.addEventListener("mouseenter", () => {
      tooltip.style.display = "block";
    });

    tooltip.addEventListener("mouseenter", () => {
      tooltip.style.display = "block";
    });

    point.addEventListener("mouseleave", () => {
      setTimeout(() => {
        if (!tooltip.matches(":hover") && !point.matches(":hover")) {
          tooltip.style.display = "none";
        }
      }, 300);
    });

    tooltip.addEventListener("mouseleave", () => {
      setTimeout(() => {
        if (!tooltip.matches(":hover") && !point.matches(":hover")) {
          tooltip.style.display = "none";
        }
      }, 300);
    });
  });

  fetchEventData();
}
