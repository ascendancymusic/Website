// Get the h3 element and the wheel-container
const songSelector = document.querySelector(".content h3");
const wheelContainer = document.getElementById("wheel-container");
const angleDisplay = document.getElementById("angle-display");

// Hide the angle display by default
angleDisplay.style.display = "none";

// Add a click event listener to the h3 element
songSelector.addEventListener("click", () => {
  if (wheelContainer.style.display === "block") {
    wheelContainer.style.opacity = "0";
    setTimeout(() => {
      wheelContainer.style.display = "none";
      angleDisplay.style.display = "none"; // Hide the angle display
      songSelector.classList.remove("open"); // Remove the "open" class
      songSelector.textContent = "SONG MENU";
    }, 500);
  } else {
    wheelContainer.style.display = "block";
    angleDisplay.style.display = "block"; // Show the angle display
    songSelector.classList.add("open"); // Add the "open" class
    songSelector.textContent = "CLOSE MENU";
    setTimeout(() => {
      wheelContainer.style.opacity = "1";
    }, 0);
  }
});