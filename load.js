window.addEventListener('load', function () {
  // After the content is fully loaded, add a class to elements for fade-in effect
  const fadeElements = document.querySelectorAll('.fade-in');
  fadeElements.forEach(function (element) {
    element.style.opacity = '1';
  });
});