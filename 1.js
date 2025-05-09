document.addEventListener("DOMContentLoaded", () => {
    // Fetch car data from backend and render dynamically
    const carShowcase = document.getElementById('car-showcase');
    let allCars = [];
    let carCards = [];

    // Helper: Render car cards (professional UI)
    function renderCars(cars) {
        // Remove everything except section title and review form
        const showcaseSection = document.getElementById('car-showcase');
        showcaseSection.querySelectorAll('.card-container, .car-card, .large-car-card').forEach(e => e.remove());
        // Create card container
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container pro-cards';
        carCards = [];
        cars.forEach(car => {
            const name = `${car.make_display || car.make || ''} ${car.model_display || car.model || ''} ${car.year || ''}`.trim();
            const price = car.price || car.msrp || null;
            const image = car.image_url || car.image || 'https://carapi.app/static/img/car-placeholder.png';
            const desc = car.engine || car.body_type || car.trim || '';
            const priceDisplay = price ? `$${price.toLocaleString()}` : 'Contact for price';
            const card = document.createElement('div');
            card.className = 'pro-car-card fade-in';
            card.innerHTML = `
                <div class="car-img-wrap">
                    <img src="${image}" alt="${name}" class="car-img" />
                </div>
                <div class="car-details">
                    <h3 class="car-title">${name}</h3>
                    <p class="car-desc">${desc}</p>
                    <div class="car-meta">
                        <span class="car-price">${priceDisplay}</span>
                    </div>
                    <button class="details-button">View Details</button>
                </div>
            `;
            cardContainer.appendChild(card);
            carCards.push(card);
        });
        showcaseSection.appendChild(cardContainer);
        setupFadeIn();
    }

    // Fetch cars from backend proxy to avoid CORS issues
    fetch('http://localhost:5000/api/cars?limit=20&page=1')
        .then(res => res.json())
        .then(data => {
            allCars = data.data || [];
            renderCars(allCars);
        })
        .catch(err => {
            carShowcase.innerHTML = '<p style="color:red">Failed to load cars.</p>';
        });

    // --- AUTHENTICATION ---
    async function registerUser(name, email, password) {
        const res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        return res.json();
    }
    async function loginUser(email, password) {
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.token) localStorage.setItem('token', data.token);
        return data;
    }
    function logoutUser() {
        localStorage.removeItem('token');
    }
    function getToken() {
        return localStorage.getItem('token');
    }

    // --- USER PROFILE ---
    async function getProfile() {
        const res = await fetch('http://localhost:5000/api/users/me', {
            headers: { 'Authorization': 'Bearer ' + getToken() }
        });
        return res.json();
    }
    async function updateProfile(updates) {
        const res = await fetch('http://localhost:5000/api/users/me', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() },
            body: JSON.stringify(updates)
        });
        return res.json();
    }
    async function deleteProfile() {
        const res = await fetch('http://localhost:5000/api/users/me', {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + getToken() }
        });
        return res.json();
    }

    // --- ORDERS ---
    async function createOrder(products, total) {
        const res = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() },
            body: JSON.stringify({ products, total })
        });
        return res.json();
    }
    async function getMyOrders() {
        const res = await fetch('http://localhost:5000/api/orders/my', {
            headers: { 'Authorization': 'Bearer ' + getToken() }
        });
        return res.json();
    }

    // --- REVIEWS ---
    async function getReviews(productId) {
        const res = await fetch(`http://localhost:5000/api/reviews/product/${productId}`);
        return res.json();
    }
    async function postReview(productId, rating, comment) {
        const res = await fetch(`http://localhost:5000/api/reviews/product/${productId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() },
            body: JSON.stringify({ rating, comment })
        });
        return res.json();
    }

  
    }

    // --- ADMIN DASHBOARD ---
    async function getAdminSummary() {
        const res = await fetch('http://localhost:5000/api/admin/summary', {
            headers: { 'Authorization': 'Bearer ' + getToken() }
        });
        return res.json();
    }

    // --- EXAMPLES ---
    // Call registerUser, loginUser, etc. on form submit events
    // Use getProfile() to show user info after login
    // Use createOrder() after checkout
    // Use postReview() to submit product reviews
    // Use uploadFile() for file/image uploads
    // Use createPaymentIntent() for Stripe payments
    // Use getAdminSummary() to show admin stats

    // Fade-in effect for sections
    function setupFadeIn() {
        const options = { root: null, threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        carCards.forEach(card => {
            observer.observe(card);
        });
    }

    // Search Functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.querySelector('.search-bar button');

    function filterCars() {
        const query = searchInput.value.toLowerCase();
        const filtered = allCars.filter(car =>
            `${car.make} ${car.model}`.toLowerCase().includes(query)
        );
        renderCars(filtered);
    }

    searchButton.addEventListener('click', filterCars);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            filterCars();
        }
    });
});
