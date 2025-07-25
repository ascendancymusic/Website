window.onload = function () {
    // Code for the first functionality
    window.addEventListener('scroll', function (e) {
        if (window.pageYOffset > 100) {
            document.querySelector("header").classList.add('is-scrolling');
        } else {
            document.querySelector("header").classList.remove('is-scrolling');
        }
    });

    const menu_btn = document.querySelector('.hamburger');
    const mobile_menu = document.querySelector('.mobile-nav');

    menu_btn.addEventListener('click', function () {
        menu_btn.classList.toggle('is-active');
        mobile_menu.classList.toggle('is-active');
    });

    // Code for the second functionality
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const h2Element = document.querySelector("h2[data-value]");
    animateText(h2Element);

    // Check if the current page is not about.html or contact.html
    const currentPage = window.location.pathname;
    if (!currentPage.includes("about") && !currentPage.includes("contact")) {
        const pElements = document.querySelectorAll("p");
        pElements.forEach(pElement => {
            animateText(pElement);
        });
    }

    function animateText(element) {
        if (!element) return;  // Ensure the element exists before processing

        const originalText = element.dataset.value || element.innerText; // Use data-value or innerText as a fallback
        let iteration = 0;

        let interval = setInterval(() => {
            element.innerText = originalText
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return originalText[index];
                    }

                    return letters[Math.floor(Math.random() * 26)];
                })
                .join("");

            if (iteration >= originalText.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3;
        }, 30);
    }
};
