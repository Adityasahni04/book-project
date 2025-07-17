document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');

            // Animate hamburger menu
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Back to top button
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Favorite button toggle
    const favoriteBtn = document.getElementById('favoriteBtn');

    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function () {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.background = 'var(--primary)';
                this.style.color = 'white';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.background = 'var(--bg-white)';
                this.style.color = 'var(--text-dark)';
            }
        });
    }

    // Share button
    const shareBtn = document.getElementById('shareBtn');

    if (shareBtn) {
        shareBtn.addEventListener('click', function () {
            if (navigator.share) {
                navigator.share({
                    title: 'The Midnight Library - Matt Haig',
                    text: 'Check out this amazing book!',
                    url: window.location.href
                });
            } else {
                // Fallback for browsers that don't support Web Share API
                const url = window.location.href;
                navigator.clipboard.writeText(url).then(function () {
                    alert('Link copied to clipboard!');
                });
            }
        });
    }

    // Load more reviews
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function () {
            // Simulate loading more reviews
            this.textContent = 'Loading...';
            this.disabled = true;

            setTimeout(() => {
                this.textContent = 'No more reviews';
                this.classList.add('disabled-btn');
            }, 1500);
        });
    }

    // Language selector
    const languageSelector = document.getElementById('language-selector');

    if (languageSelector) {
        languageSelector.addEventListener('change', function () {
            const selectedLang = this.value;
            // Here you would implement language switching logic
            console.log('Language changed to:', selectedLang);
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.review-card, .book-stats-card, .summary-section, .author-section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
document.querySelectorAll('.podcast-play').forEach(button => {
    button.addEventListener('click', function () {
        const icon = this.querySelector('i');

        if (icon.classList.contains('fa-play')) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        } else {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        }

        console.log('Playing/pausing podcast');
    });
});

function handleProtectedRedirect(targetPage) {
    if (localStorage.getItem("isLoggedIn") === "true") {
        window.location.href = targetPage;
    } else {
        localStorage.setItem("redirectAfterLogin", targetPage);
        window.location.href = "../../sign-login.html";
    }
}