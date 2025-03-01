document.addEventListener("DOMContentLoaded", () => {
    // Fade-in effect for sections
    const carCards = document.querySelectorAll('.large-car-card');

    const options = {
        root: null,
        threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    carCards.forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });

    // Search Functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.querySelector('.search-bar button');

    searchButton.addEventListener('click', filterCars);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            filterCars();
        }
    });

    function filterCars() {
        const query = searchInput.value.toLowerCase();
        carCards.forEach(card => {
            const carTitle = card.querySelector('h3').innerText.toLowerCase();
            if (carTitle.includes(query)) {
                card.style.display = 'flex'; // Show matching cars
                card.classList.add('show'); // Optional fade-in effect
            } else {
                card.style.display = 'none'; // Hide non-matching cars
            }
        });
    }
});
