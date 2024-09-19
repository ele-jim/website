document.addEventListener("DOMContentLoaded", () => {
    function updateCountdown() {
        const now = new Date();
        
        // Select all event elements with a data-target-date attribute
        const eventElements = document.querySelectorAll('.event[data-target-date]');

        eventElements.forEach(eventElement => {
            const targetDate = new Date(eventElement.getAttribute('data-target-date'));
            const diff = targetDate - now;

            // Check if the target date is valid
            if (isNaN(targetDate)) {
                console.error("Invalid target date for event", eventElement);
                return;
            }

            // Calculate time left
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            // Ensure the countdown doesn't go negative
            if (diff < 0) {
                eventElement.querySelector(".countdown-timer").textContent = "The event has started!";
                return;
            }

            // Construct the countdown string
            const countdownString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

            // Update the DOM with the new time
            const countdownElement = eventElement.querySelector(".countdown-timer");
            
            if (countdownElement) {
                countdownElement.textContent = countdownString;
            } else {
                console.error("No .countdown-timer element found within event", eventElement);
            }
        });
    }

    // Update the countdown every second
    setInterval(updateCountdown, 1000);

    // Initialize the countdown
    updateCountdown();
});

