document.addEventListener("DOMContentLoaded", function () {
  const fullscreenButton = document.getElementById("fullscreen-button");
  
  fullscreenButton.addEventListener("click", function () {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(error => {
        console.error("Exiting fullscreen failed:", error);
      });
    } else {
      document.documentElement.requestFullscreen().catch(error => {
        console.error("Entering fullscreen failed:", error);
      });
    }
  });
});
