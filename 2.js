document.addEventListener("DOMContentLoaded", () => {
    // Fade in effect for sections
    const sections = document.querySelectorAll('.car-section');

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

    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
});
document.addEventListener("DOMContentLoaded", () => {
    // Fade in effect for sections
    const sections = document.querySelectorAll('.large-car-card'); // Assuming each car card is a section

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

    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Search Functionality
    const searchInput = document.createElement('input');
    searchInput.id = 'search-input';
    searchInput.type = 'text';
    searchInput.placeholder = 'Search by car model...';
    searchInput.classList.add('search-bar'); // Add class for styling

    const searchButton = document.createElement('button');
    searchButton.textContent = 'Search';
    searchButton.classList.add('search-button'); // Add class for styling
    searchButton.addEventListener('click', filterCars); // Attach click event

    

    // Filter function for cars based on search input
    function filterCars() {
        const query = searchInput.value.toLowerCase();
        sections.forEach(section => {
            const carTitle = section.querySelector('h3').innerText.toLowerCase();
            if (carTitle.includes(query)) {
                section.style.display = 'block'; // Show matching cars
                section.classList.add('fade-in'); // Optional fade-in effect
            } else {
                section.style.display = 'none'; // Hide non-matching cars
            }
        });
    }
});
