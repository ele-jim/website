document.addEventListener("DOMContentLoaded", () => {
    function updateCountdown() {
        const now = new Date();
        
        // Select all event elements with a data-target-date attribute
        const eventElements = document.querySelectorAll('.event[data-target-date]');

        eventElements.forEach(eventElement => {
            const targetDate = new Date(eventElement.getAttribute('data-target-date'));
            const targetDateEnd = new Date(targetDate);
            targetDateEnd.setHours(23, 30, 0, 0); // Set the target end time to 23:30

            // Check if the target date is valid
            if (isNaN(targetDate)) {
                console.error("Invalid target date for event", eventElement);
                return;
            }

            // Get the countdown and caption elements
            const countdownElement = eventElement.querySelector(".countdown-timer");

            // If it's after 23:30 on the event day, replace "This event has started!" with the event date in white
            if (now > targetDateEnd) {
                // Format the event date as DD/MM/YY
                const eventDate = targetDate.toLocaleDateString('en-GB'); // Formats the date as DD/MM/YY.

                // Replace the countdown with the event date and set the font color to white
                if (countdownElement) {
                    countdownElement.textContent = eventDate;
                    countdownElement.style.color = "white";  // Set the font color to white after 23:30
                }

                return;  // Stop further processing for this event
            }

            // If the event has started but it's still before 23:30, show "This event has started!"
            if (now > targetDate && now <= targetDateEnd) {
                if (countdownElement) {
                    countdownElement.textContent = "This event has started!";
                }
                return;
            }

            // Calculate time left for the countdown
            const diff = targetDate - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            // Construct the countdown string
            const countdownString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

            // Update the DOM with the new countdown time
            if (countdownElement) {
                countdownElement.textContent = countdownString;
            } else {
                console.error("No .countdown-timer element found within event", eventElement);
            }
        });
    }

    // Update the countdown every second
    setInterval(updateCountdown, 1000);

    // Initialize the countdown on page load
    updateCountdown();
});