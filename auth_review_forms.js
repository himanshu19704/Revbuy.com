// Handles login, registration, and review form logic for 1.html

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const userProfileDiv = document.getElementById('user-profile');
    const reviewForm = document.getElementById('review-form');

    // --- Helper functions from 1.js ---
    // Assumes registerUser, loginUser, logoutUser, getToken, getProfile, postReview, allCars are globally available

    // Login handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const msgDiv = document.getElementById('login-msg');
            msgDiv.textContent = '';
            const res = await loginUser(email, password);
            if (res.token) {
                msgDiv.style.color = 'green';
                msgDiv.textContent = 'Login successful!';
                loginForm.style.display = 'none';
                registerForm.style.display = 'none';
                showUserProfile();
            } else {
                msgDiv.style.color = 'red';
                msgDiv.textContent = res.error || 'Login failed.';
            }
        });
    }
    // Register handler
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const msgDiv = document.getElementById('register-msg');
            msgDiv.textContent = '';
            const res = await registerUser(name, email, password);
            if (res.message) {
                msgDiv.style.color = 'green';
                msgDiv.textContent = 'Registration successful! Please login.';
            } else {
                msgDiv.style.color = 'red';
                msgDiv.textContent = res.error || 'Registration failed.';
            }
        });
    }
    // Show user profile if logged in
    async function showUserProfile() {
        if (!getToken()) return;
        const profile = await getProfile();
        userProfileDiv.style.display = 'block';
        userProfileDiv.innerHTML = `<b>Welcome, ${profile.name} (${profile.email})</b> <button id="logout-btn">Logout</button>`;
        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn.onclick = () => {
            logoutUser();
            userProfileDiv.style.display = 'none';
            loginForm.style.display = 'block';
            registerForm.style.display = 'block';
        };
    }
    // Auto-show profile if already logged in
    if (getToken()) {
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        showUserProfile();
    }
    // --- REVIEW FORM HANDLER (example for first product) ---
    if (reviewForm) {
        // Show review form for demo (replace productId with real one as needed)
        reviewForm.style.display = 'block';
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const rating = document.getElementById('review-rating').value;
            const comment = document.getElementById('review-comment').value;
            const msgDiv = document.getElementById('review-msg');
            msgDiv.textContent = '';
            // For demo: use the first car's id if available
            let productId = window.allCars && window.allCars[0]?._id || null;
            if (!productId) {
                msgDiv.style.color = 'red';
                msgDiv.textContent = 'No product available for review.';
                return;
            }
            const res = await postReview(productId, rating, comment);
            if (res._id) {
                msgDiv.style.color = 'green';
                msgDiv.textContent = 'Review submitted!';
                reviewForm.reset();
            } else {
                msgDiv.style.color = 'red';
                msgDiv.textContent = res.error || 'Failed to submit review.';
            }
        });
    }
});
