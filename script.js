// Initialize Matter.js and other libraries
const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint;

const engine = Engine.create();
const render = Render.create({
    element: document.getElementById('wheel-container'),
    engine: engine,
    options: {
        width: 300,
        height: 300,
        background: 'transparent',
        wireframes: false
    }
});
Render.run(render);
const world = engine.world;

// Load the image
const imageUrl = 'vinyl.png';
const wheelSize = 300; // Size of the wheel's hitbox (both width and height)
const wheelPosition = {
    x: render.options.width / 2 + 2.5,
    y: render.options.height / 2 - 1.5
};

const loadImage = new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => resolve(image);
    image.onerror = error => reject(error);
});

let wheelAngle = 0; // Initialize angle variable

// Store the previous label
let previousLabel = "";

loadImage.then(image => {
    // Create the spinning wheel body with the loaded image
    const wheel = Bodies.circle(wheelPosition.x, wheelPosition.y, wheelSize / 2, {
        frictionAir: 0.03, // Lower frictionAir for longer spin
        restitution: 0.5,
        density: 0.005,
        render: {
            sprite: {
                texture: image.src,
                xScale: wheelSize / image.width,
                yScale: wheelSize / image.height
            }
        }
    });
    World.add(world, wheel);

    // Create a constraint to allow rotation
    const constraint = Constraint.create({
        pointA: { x: wheelPosition.x, y: wheelPosition.y },
        bodyB: wheel,
        stiffness: 0.1
    });
    World.add(world, constraint);

    let isDragging = false;
    let initialAngle = 0;
    let initialDragVector = { x: 0, y: 0 };
	let soundElement = new Audio("sound.wav");

    // Capture mouse drags on the wheel's hitbox
    const wheelCanvas = render.canvas;

    const startDragging = (event) => {
        const canvasX = event.clientX - wheelCanvas.getBoundingClientRect().left;
        const canvasY = event.clientY - wheelCanvas.getBoundingClientRect().top;

        const distance = Math.sqrt(
            (canvasX - wheelPosition.x) ** 2 +
            (canvasY - wheelPosition.y) ** 2
        );

        if (distance <= wheelSize / 2) {
            isDragging = true;
            initialDragVector = Matter.Vector.sub(
                { x: canvasX, y: canvasY },
                { x: wheel.position.x, y: wheel.position.y }
            );
            initialAngle = Math.atan2(initialDragVector.y, initialDragVector.x) - wheel.angle;
        }
    };

    const onDocumentMouseMove = (event) => {
        if (isDragging) {
            const canvasX = event.clientX - wheelCanvas.getBoundingClientRect().left;
            const canvasY = event.clientY - wheelCanvas.getBoundingClientRect().top;

            const dragVector = Matter.Vector.sub(
                { x: canvasX, y: canvasY },
                { x: wheel.position.x, y: wheel.position.y }
            );
            const newAngle = Math.atan2(dragVector.y, dragVector.x) - initialAngle;

            Matter.Body.setAngle(wheel, newAngle);

            // Update the angle display text and path
            const degrees = ((wheelAngle * (180 / Math.PI) + 360) % 360).toFixed(0);
            const { label, path } = getAngleInfo(degrees);

            // Check if the label has changed before playing the sound
            if (label !== previousLabel) {
                soundElement.pause(); // Pause the previous sound
                soundElement.currentTime = 0; // Reset the time
                soundElement = new Audio("sound.wav"); // Create a new sound element
                soundElement.play(); // Play the new sound
                previousLabel = label;
            }

            angleDisplay.innerHTML = `<a href="${path}" style="text-decoration: none; color: white; filter: drop-shadow(2px 2px 10px rgba(0, 128, 0, 0.5)); transition: color 0.3s ease, filter 0.3s ease;" onmouseover="this.style.color='#00d965'; this.style.filter='drop-shadow(2px 2px 10px rgba(0, 128, 0, 1))';" onmouseout="this.style.color='white'; this.style.filter='drop-shadow(2px 2px 10px rgba(0, 128, 0, 0.5))';">${label}</a>`;
            wheelAngle = newAngle;
        }
    };

    const stopDragging = () => {
        isDragging = false;
    };

    // Attach the mouse events only to the wheel's hitbox area
    wheelCanvas.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mouseup', stopDragging);
});

// Create a function to map angle ranges to text labels and paths
function getAngleInfo(angle) {
    if (angle >= 0 && angle <= 89) {
        return {
            label: '<span class="label"><span class="label-line1">ASCENDANCY - CHIPPER<span class="label-line2"><br>(GENRE: ELECTRO | BPM: 106 | DATE: 14.7.)</span></span>',
            path: "chipper.html"
        };
    } else if (angle >= 90 && angle <= 179) {
        return {
            label: '<span class="label"><span class="label-line3">ASCENDANCY - BLISS<span class="label-line4"><br>(GENRE: FUTURE BOUNCE | BPM: 128 | DATE: 5.5.)</span></span>',
            path: "bliss.html"
        };
    } else if (angle >= 180 && angle <= 269) {
        return {
            label: '<span class="label"><span class="label-line5">ASCENDANCY - DECEIVER<span class="label-line4"><br>(GENRE: FUTURE BOUNCE | BPM: 128 | DATE: 24.3.)</span></span>',
            path: "deceiver.html"
        };
    } else {
        return {
            label: '<span class="label"><span class="label-line6">ASCENDANCY - BROKEN LOVE<span class="label-line4"><br>(GENRE: FUTURE BOUNCE | BPM: 129.3 | DATE: 11.2.)</span></span>',
            path: "broken-love.html"
        };
    }
}

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
        angleDisplay.style.opacity = "0"; // Hide the angle display
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
        songSelector.textContent = "CLOSE SONG MENU";
        setTimeout(() => {
            wheelContainer.style.opacity = "1";
            angleDisplay.style.opacity = "1"; // Show the angle display
        }, 0);
    }
});

// Run the engine
Engine.run(engine);