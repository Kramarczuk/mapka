document.addEventListener("DOMContentLoaded", function () {
  const tooltipToggle = document.getElementById("tooltip-toggle");
  const availableCities = document.getElementById("available-cities");
  const apiUrl =
    "https://app.gridaly.com/api/v1/event/blum-w-trasie-2024/tickets";

  // Aktualizacja centralnego tooltipa

    function updateTooltip(events) {
        availableCities.innerHTML = ''; 

        events.forEach(event => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#">${event.name}</a>`;
            availableCities.appendChild(li);

            // Dodanie eventu do linku - do dodania
            li.querySelector('a').href = `#`; 
        });

        if (events.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Brak dostępnych miast';
            availableCities.appendChild(li);
        }
    }


  // API

  async function fetchEventData() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log(data); // Logowanie danych

      const events = data.tickets; // Używamy tickets bezpośrednio

      events.forEach((event) => {
        const cityPoint = document.querySelector(
          `[data-event-id="${event.id}"]`
        );
        if (cityPoint) {
          const tooltipText = `${event.name}<br>Bilety: ${
            event.saleStatus === "onGoing" ? "Dostępne" : "Brak dostępnych"
          }<br><a href="${event.ticketUrl || "#"}">Zapisz się</a>`;

          if (event.saleStatus === "onGoing") {
            cityPoint.classList.add("available");

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
        }
      });

      updateTooltip(events); // Aktualizacja centralnego tooltipa
    } catch (error) {
      console.error("Błąd podczas pobierania danych z API:", error);
    }
  }

  // Logika przycisku do pokazania/ukrycia listy
  tooltipToggle.addEventListener("click", () => {
    if (
      availableCities.style.display === "none" ||
      availableCities.style.display === ""
    ) {
      availableCities.style.display = "block";
      tooltipToggle.textContent = "Ukryj dostępne miasta";
    } else {
      availableCities.style.display = "none";
      tooltipToggle.textContent = "Wybierz miasto";
    }
  });

  fetchEventData();
});
