document.addEventListener('DOMContentLoaded', function() {
    // Create a container for the cursor trail
    var trailContainer = document.createElement('div');
    trailContainer.classList.add('cursor-trail-container');
    document.body.appendChild(trailContainer);

    // Function to create a trail element at cursor position
    function createTrail(event) {
        var trail = document.createElement('div');
        trail.classList.add('cursor-trail');
        trail.style.left = event.clientX + 'px';
        trail.style.top = event.clientY + 'px';
        trailContainer.appendChild(trail);

        // Remove the trail element after animation ends
        trail.addEventListener('animationend', function() {
            trail.remove();
        });
    }

    // Add mousemove event listener to create cursor trail
    document.addEventListener('mousemove', createTrail);
});
