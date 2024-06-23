document.addEventListener("DOMContentLoaded", () => {
    function updateCountdown() {
        const now = new Date();
        const targetDate = new Date("March 7, 2024 19:00:00");
        const diff = targetDate - now;

        // Calculate time left
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Construct the countdown string
        const countdownString = `In ${days}d ${hours}h ${minutes}m ${seconds}s`;

        // Update the DOM with the new time
        const countdownElement = document.querySelector(".countdown-timer");
        countdownElement.textContent = countdownString;
    }

    // Update the countdown every second
    setInterval(updateCountdown, 1000);

    // Initialize the countdown
    updateCountdown();
});
