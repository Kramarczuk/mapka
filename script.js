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

        const address = event.short_description || "No address available";
        let tooltipText = `${event.name}<br>${address}<br><a href="${linkUrl}">Zapisz się</a>`;

        if (secondEventId && secondEventLink) {
          const secondEvent = events.find((e) => e.id === secondEventId);
          if (secondEvent) {
            tooltipText += `<br><br><strong style="font-weight: normal;">${secondEvent.name}</strong><br><a href="${secondEventLink}">Zapisz się</a>`;
          }
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
      // Jeśli event nie jest dostępny (saleStatus != "onGoing"), usuń tooltip
      if (cityPoint) {
        cityPoint.classList.remove("available");
        const tooltip = cityPoint.querySelector(".map-point-tooltip");
        if (tooltip) {
          tooltip.remove(); // Usuwanie tooltipa
        }
      }
    }
  });

  const jasinPoint = document.getElementById("jasin-point");
  const jasinEventId = jasinPoint.getAttribute("data-event-id");
  const secondJasinEventId = jasinPoint.getAttribute("second-event-id");

  const isJasinAvailable = events.some(
    (event) =>
      (event.id === jasinEventId || event.id === secondJasinEventId) &&
      event.saleStatus === "onGoing"
  );

  if (isJasinAvailable) {
    const firstEvent = events.find(
      (e) => e.id === jasinEventId && e.saleStatus === "onGoing"
    );
    const secondEvent = events.find(
      (e) => e.id === secondJasinEventId && e.saleStatus === "onGoing"
    );

    let tooltipText = "";

    if (firstEvent) {
      tooltipText = `${firstEvent.name}<br>${
        firstEvent.short_description || "No address available"
      }<br><a href="${jasinPoint.getAttribute("data-link")}">Zapisz się</a>`;
    }

    if (secondEvent) {
      tooltipText += `<br><br><strong style="font-weight: normal;">${
        secondEvent.name
      }</strong><br><a href="${jasinPoint.getAttribute(
        "second-data-link"
      )}">Zapisz się</a>`;
    }

    let tooltip = jasinPoint.querySelector(".map-point-tooltip");

    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.classList.add("map-point-tooltip");
      tooltip.innerHTML = tooltipText;
      jasinPoint.appendChild(tooltip);
    } else {
      tooltip.innerHTML = tooltipText;
    }

    jasinPoint.classList.add("available");
    jasinPoint.style.pointerEvents = "auto";

    if (firstEvent) {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${jasinPoint.getAttribute("data-link")}">${
        firstEvent.name
      }</a>`;
      li.addEventListener("click", () => {
        window.location.href = jasinPoint.getAttribute("data-link");
      });
      availableCities.appendChild(li);
    }

    if (secondEvent) {
      const secondLi = document.createElement("li");
      secondLi.innerHTML = `<a href="${jasinPoint.getAttribute(
        "second-data-link"
      )}">${secondEvent.name}</a>`;
      secondLi.addEventListener("click", () => {
        window.location.href = jasinPoint.getAttribute("second-data-link");
      });
      availableCities.appendChild(secondLi);
    }
  } else {
    jasinPoint.classList.remove("available");
    jasinPoint.style.pointerEvents = "none";
    const tooltip = jasinPoint.querySelector(".map-point-tooltip");
    if (tooltip) {
      tooltip.remove(); // Usunięcie tooltipa, gdy wydarzenie nie jest dostępne
    }
  }

  if (availableCities.children.length === 0) {
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

  const tooltipContainer = document.getElementById("tooltip-container");

  tooltipContainer.addEventListener("click", function (event) {
    const availableCities = document.getElementById("available-cities");
    const tooltipToggle = document.getElementById("tooltip-toggle");

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

    const tooltip = document.createElement("div");
    tooltip.classList.add("map-point-tooltip");
    tooltip.innerHTML = `<strong>Event Name</strong><br>Zarejestruj się`;

    point.appendChild(tooltip);

    point.addEventListener("mouseenter", () => {
      tooltip.style.display = "block";
    });

    point.addEventListener("mouseleave", () => {
      setTimeout(() => {
        if (!tooltip.matches(":hover") && !point.matches(":hover")) {
          tooltip.style.display = "none";
        }
      }, 300);
    });

    tooltip.addEventListener("mouseenter", () => {
      tooltip.style.display = "block";
    });

    tooltip.addEventListener("mouseleave", () => {
      setTimeout(() => {
        if (!tooltip.matches(":hover") && !point.matches(":hover")) {
          tooltip.style.display = "none";
        }
      }, 300);
    });

    tooltip.addEventListener("click", () => {
      window.location.href = eventLink;
    });
  });

  fetchEventData();
}

zz;
