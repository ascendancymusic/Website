const { Engine, Render, World, Bodies, Constraint, Vector } = Matter;

const engine = Engine.create();
const render = Render.create({
    element: document.getElementById('wheel-container'),
    engine: engine,
    options: {
        width: 250,
        height: 250,
        background: 'transparent',
        wireframes: false
    }
});
Render.run(render);
const world = engine.world;

const imageUrls = ['media/vinyl2024.png', 'media/vinylOld.png'];
let currentImageIndex = 0;
let wheelSize = 250;
const wheelPosition = {
    x: render.options.width / 2 + 2.5,
    y: render.options.height / 2 - 1.5
};

const loadImage = (src) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = src;
        image.onload = () => resolve(image);
        image.onerror = (error) => {
            console.error(`Failed to load image: ${src}`, error);
            reject(error);
        };
    });
};

const playAudio = () => {
    const audio = new Audio("media/sound.flac");
    audio.play().catch(error => {
        console.error("Audio playback failed:", error);
    });
};

let isDragging = false;
let initialAngle = 0;
let highlightedSongUrl = '';
let wheelAngle = 0;
let wheel;

const setupWheel = (image) => {
    wheel = Bodies.circle(wheelPosition.x, wheelPosition.y, wheelSize / 2, {
        frictionAir: 0.03,
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

    const constraint = Constraint.create({
        pointA: wheelPosition,
        bodyB: wheel,
        stiffness: 0.1
    });
    World.add(world, constraint);

    // Update song list based on the image
    updateSongList();
};

const initializeWheel = () => {
    loadImage(imageUrls[currentImageIndex]).then(image => {
        setupWheel(image);
        updateWheelButtons();
    });
};

initializeWheel();

const wheelCanvas = render.canvas;

const startDragging = (event) => {
    const { clientX, clientY } = event;
    const canvasX = clientX - wheelCanvas.getBoundingClientRect().left;
    const canvasY = clientY - wheelCanvas.getBoundingClientRect().top;

    const distance = Math.sqrt(
        (canvasX - wheelPosition.x) ** 2 +
        (canvasY - wheelPosition.y) ** 2
    );

    if (distance <= wheelSize / 2) {
        isDragging = true;
        const initialDragVector = Vector.sub({ x: canvasX, y: canvasY }, wheel.position);
        initialAngle = Math.atan2(initialDragVector.y, initialDragVector.x) - wheel.angle;

        document.body.classList.add('no-select');
    }
};

const updateAngle = (canvasX, canvasY) => {
    if (isDragging) {
        const dragVector = Vector.sub({ x: canvasX, y: canvasY }, wheel.position);
        const newAngle = Math.atan2(dragVector.y, dragVector.x) - initialAngle;

        Matter.Body.setAngle(wheel, newAngle);
        wheelAngle = newAngle;

        const degrees = ((wheelAngle * (180 / Math.PI) + 360) % 360).toFixed(0);
        highlightSong(degrees);
    }
};

const onMouseMove = (event) => {
    const { clientX, clientY } = event;
    const canvasX = clientX - wheelCanvas.getBoundingClientRect().left;
    const canvasY = clientY - wheelCanvas.getBoundingClientRect().top;
    updateAngle(canvasX, canvasY);
};

const stopDragging = () => {
    isDragging = false;
    document.body.classList.remove('no-select');
};

const startDraggingTouch = (event) => {
    const { clientX, clientY } = event.touches[0];
    const canvasX = clientX - wheelCanvas.getBoundingClientRect().left;
    const canvasY = clientY - wheelCanvas.getBoundingClientRect().top;

    const distance = Math.sqrt(
        (canvasX - wheelPosition.x) ** 2 +
        (canvasY - wheelPosition.y) ** 2
    );

    if (distance <= wheelSize / 2) {
        isDragging = true;
        const initialDragVector = Vector.sub({ x: canvasX, y: canvasY }, wheel.position);
        initialAngle = Math.atan2(initialDragVector.y, initialDragVector.x) - wheel.angle;
    }
};

const onTouchMove = (event) => {
    const { clientX, clientY } = event.touches[0];
    const canvasX = clientX - wheelCanvas.getBoundingClientRect().left;
    const canvasY = clientY - wheelCanvas.getBoundingClientRect().top;
    updateAngle(canvasX, canvasY);
};

wheelCanvas.addEventListener('mousedown', startDragging);
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mouseup', stopDragging);

wheelCanvas.addEventListener('touchstart', startDraggingTouch);
document.addEventListener('touchmove', onTouchMove);
document.addEventListener('touchend', stopDragging);

function highlightSong(angle) {
    const songElements = document.querySelectorAll(`#song-list .song[data-image="${imageUrls[currentImageIndex]}"]`);
    let songChanged = false;

    const anglePerSong = 360 / songElements.length; // Calculate angle per song

    songElements.forEach((song, index) => {
        const startAngle = index * anglePerSong;
        const endAngle = startAngle + anglePerSong;

        if (angle >= startAngle && angle < endAngle) {
            if (!song.classList.contains("highlighted")) {
                song.classList.add("highlighted");
                songChanged = true;
                song.scrollIntoView({ behavior: "smooth", block: "nearest" });

                let songText = song.getAttribute("data-song-name").trim(); // Get the song name from data attribute
                highlightedSongUrl = songText.toLowerCase();
                playAudio(); // Trigger audio playback here
            }
        } else {
            song.classList.remove("highlighted");
        }
    });

    return songChanged;
}

const songSelector = document.querySelector(".content h3");
const wheelContainer = document.getElementById("wheel-container");
const angleDisplay = document.getElementById("angle-display");
const playButton = document.getElementById("play-button");
const changeWheelButtonRight = document.getElementById("change-wheel-right");
const changeWheelButtonLeft = document.getElementById("change-wheel-left");
const VinylTitles = document.getElementById("vinyl-titles");

const updateWheelButtons = () => {
    if (wheelContainer.style.display === "block") {
        changeWheelButtonRight.style.display = currentImageIndex === imageUrls.length - 1 ? "none" : "block";
        changeWheelButtonLeft.style.display = currentImageIndex === 0 ? "none" : "block";
    } else {
        changeWheelButtonRight.style.display = "none";
        changeWheelButtonLeft.style.display = "none";
    }
};

const updateSongList = () => {
    const allSongs = document.querySelectorAll("#song-list .song");
    allSongs.forEach(song => {
        song.style.display = song.dataset.image === imageUrls[currentImageIndex] ? "block" : "none";
    });
};

angleDisplay.style.display = "none";
playButton.style.display = "none";
VinylTitles.style.display = "none";

songSelector.addEventListener("click", () => {
    if (wheelContainer.style.display === "block") {
        wheelContainer.style.opacity = "0";
        angleDisplay.style.opacity = "0";
        playButton.style.opacity = "0";
        VinylTitles.style.opacity = "0";
        setTimeout(() => {
            wheelContainer.style.display = "none";
            angleDisplay.style.display = "none";
            playButton.style.display = "none";
            VinylTitles.style.display = "none";
            songSelector.classList.remove("open");
            songSelector.textContent = "SONG MENU";
            updateWheelButtons();
        }, 500);
    } else {
        wheelContainer.style.display = "block";
        angleDisplay.style.display = "block";
        playButton.style.display = "block";
        VinylTitles.style.display = "block";
        songSelector.classList.add("open");
        songSelector.textContent = "CLOSE SONG MENU";
        setTimeout(() => {
            wheelContainer.style.opacity = "1";
            angleDisplay.style.opacity = "1";
            playButton.style.opacity = "1";
            VinylTitles.style.opacity = "1";
        }, 0);
        updateWheelButtons();
    }
});

playButton.addEventListener("click", () => {
    if (highlightedSongUrl) {
        // Open the URL or HTML file in a new tab
        window.open(highlightedSongUrl, '_blank');
    } else {
        alert("No song selected. Spin the vinyl!");
    }
});

const changeWheelImage = (direction) => {
    currentImageIndex = (currentImageIndex + direction + imageUrls.length) % imageUrls.length;
    const newImageUrl = imageUrls[currentImageIndex];
    World.remove(world, wheel);
    loadImage(newImageUrl).then(image => {
        setupWheel(image);
        updateWheelButtons();
    });
};

document.getElementById('change-wheel-left').addEventListener('click', function() {
    showVinylTitle(1); // Show Vinyl 1 title when left arrow is clicked
});

document.getElementById('change-wheel-right').addEventListener('click', function() {
    showVinylTitle(2); // Show Vinyl 2 title when right arrow is clicked
});

function showVinylTitle(vinylNumber) {
    const vinyl2024Title = document.getElementById('vinyl2024-title');
    const vinylOldTitle = document.getElementById('vinylOld-title');
    const songs = document.querySelectorAll('#song-list .song');

    if (vinylNumber === 1) {
        vinyl2024Title.style.display = 'block';
        vinylOldTitle.style.display = 'none';
        // Ensure only vinyl2024 songs are visible
        songs.forEach(song => {
            if (song.dataset.image === 'media/vinyl2024.png') {
                song.style.display = 'block';
            } else {
                song.style.display = 'none';
            }
        });
    } else if (vinylNumber === 2) {
        vinyl2024Title.style.display = 'none';
        vinylOldTitle.style.display = 'block';
        // Ensure only vinyl2 songs are visible
        songs.forEach(song => {
            if (song.dataset.image === 'media/vinylOld.png') {
                song.style.display = 'block';
            } else {
                song.style.display = 'none';
            }
        });
    }
}

changeWheelButtonRight.addEventListener("click", () => changeWheelImage(1));
changeWheelButtonLeft.addEventListener("click", () => changeWheelImage(-1));

Matter.Runner.run(engine);
