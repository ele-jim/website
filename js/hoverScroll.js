document.addEventListener("DOMContentLoaded", () => {
    const scrollContainers = document.querySelectorAll(".event-cards, .vinyl-cards");
    let scrollAnimationRequest;
    let interactionTimeout;
    let autoScrollingRight;
    let autoScrollingLeft;
    let userInteraction = false;
    const edgeThreshold = 50; // Distance in pixels from the edge to trigger edge scrolling
  
    // Helper function to detect touch devices
    function isTouchDevice() {
      return window.matchMedia("(hover: none)").matches;
    }
  
    // Check if the user is on a mobile or touch device
    if (
      /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) ||
      isTouchDevice()
    ) {
      // If on a mobile or touch device, exit the function to prevent setting up mouse-based event listeners
      return;
    }
  
    function autoScroll(container) {
      if (!userInteraction) {
        container.scrollLeft += 0.3; // Adjust the speed as necessary
        scrollAnimationRequest = requestAnimationFrame(() => autoScroll(container));
      }
    }
  
    function stopAutoScroll() {
      console.log("Stopping auto scroll");
      userInteraction = true; // Set this flag only for explicit user interactions
      cancelAnimationFrame(scrollAnimationRequest);
      clearInterval(autoScrollingRight);
      clearInterval(autoScrollingLeft);
      autoScrollingRight = null;
      autoScrollingLeft = null;
      if (interactionTimeout) {
        clearTimeout(interactionTimeout);
      }
    }
  
    function resumeAutoScroll(container) {
      console.log("Resuming auto scroll");
      if (!autoScrollingRight && !autoScrollingLeft) {
        interactionTimeout = setTimeout(() => {
          userInteraction = false;
          autoScroll(container);
        }, 3000); // Wait 3 seconds before resuming
      }
    }
  
    function startEdgeScrolling(container, direction) {
      console.log("Starting edge scrolling: ", direction);
      stopAutoScroll(); // Stop auto-scroll when starting edge scrolling
      if (direction === "right" && !autoScrollingRight) {
        autoScrollingRight = setInterval(() => {
          container.scrollLeft += 10;
        }, 20);
      } else if (direction === "left" && !autoScrollingLeft) {
        autoScrollingLeft = setInterval(() => {
          container.scrollLeft -= 10;
        }, 20);
      }
    }
  
    function stopEdgeScrolling() {
      console.log("Stopping edge scrolling");
      clearInterval(autoScrollingRight);
      clearInterval(autoScrollingLeft);
      autoScrollingRight = null;
      autoScrollingLeft = null;
    }
  
    function addEventListeners(container) {
      container.addEventListener("mouseenter", stopAutoScroll);
      container.addEventListener("mouseleave", () => resumeAutoScroll(container));
  
      container.addEventListener("mousemove", (e) => {
        const rect = container.getBoundingClientRect();
        const distanceFromRightEdge = rect.right - e.clientX;
        const distanceFromLeftEdge = e.clientX - rect.left;
  
        if (
          distanceFromRightEdge <= edgeThreshold &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          startEdgeScrolling(container, "right");
        } else if (
          distanceFromLeftEdge <= edgeThreshold &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          startEdgeScrolling(container, "left");
        } else {
          stopEdgeScrolling();
          resumeAutoScroll(container);
        }
      });
    }
  
    scrollContainers.forEach(container => {
      addEventListeners(container);
      autoScroll(container); // Initialize auto-scroll for each container
    });
  });  