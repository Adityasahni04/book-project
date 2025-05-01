// Global variable to track translation state
let isTranslating = false;

function googleTranslateElementInit() {
    // Initialize the Google Translate widget
    new google.translate.TranslateElement({
        pageLanguage: "en",
        includedLanguages: "en,hi",
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
        gaTrack: false
    }, "google_translate_element");

    // Update UI to reflect current language
    updateLanguageSelector();
}

function updateLanguageSelector() {
    const cookieLang = getTranslationCookie();
    const selector = document.getElementById('language-selector');
    
    if (selector) {
        selector.value = cookieLang === 'hi' ? 'hi' : 'en';
    }
}

function getTranslationCookie() {
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith('googtrans='));
    return cookie ? cookie.split('=')[1].split('/').pop() : 'en';
}

function setTranslationCookie(lang) {
    const domainParts = window.location.hostname.split('.');
    const domain = domainParts.length > 1 ? 
                 '.' + domainParts.slice(-2).join('.') : 
                 domainParts[0];
    
    const cookieValue = lang === 'en' ? '' : `/en/${lang}`;
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    
    // Set cookie for all paths and subdomains
    document.cookie = `googtrans=${cookieValue}; expires=${expires}; path=/; domain=${domain}`;
    document.cookie = `googtrans=${cookieValue}; expires=${expires}; path=/`;
}

document.addEventListener("DOMContentLoaded", function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            menuToggle.classList.toggle("active");
        });
    }

    // Navbar scroll effect
    window.addEventListener("scroll", () => {
        const navbar = document.querySelector(".navbar");
        if (navbar) {
            navbar.classList.toggle("scrolled", window.scrollY > 50);
        }
    });
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to Top Button
        const backToTop = document.querySelector('.back-to-top');
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    // Back to Top Functionality
    document.querySelector('.back-to-top').addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                navLinks.classList.remove('active');

                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Load Google Translate script
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // Language selector functionality
    const languageSelector = document.getElementById("language-selector");
    if (languageSelector) {
        languageSelector.addEventListener("change", function() {
            if (isTranslating) return;
            isTranslating = true;
            
            const lang = this.value;
            setTranslationCookie(lang);
            
            if (lang === 'en') {
                // For English, we need to force a revert
                if (typeof google !== 'undefined' && google.translate) {
                    const frame = document.querySelector('.goog-te-menu-frame');
                    if (frame) {
                        frame.contentDocument.querySelector('.goog-te-menu2-item:first-child').click();
                    }
                }
                
                // Fallback method
                setTimeout(() => {
                    document.querySelectorAll('iframe').forEach(iframe => {
                        if (iframe.src.includes('translate.google.com')) {
                            iframe.remove();
                        }
                    });
                    window.location.reload();
                }, 1000);
            } else {
                // For Hindi, trigger the translation
                const translateScript = document.createElement('script');
                translateScript.src = `//translate.google.com/translate?sl=auto&tl=${lang}&u=${encodeURIComponent(window.location.href)}`;
                document.body.appendChild(translateScript);
                
                // Fallback in case the script doesn't load
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
            
            setTimeout(() => {
                isTranslating = false;
            }, 1500);
        });
    }

    // Hero button click event
    const heroBtn = document.querySelector(".hero-btn");
    if (heroBtn) {
        heroBtn.addEventListener("click", function() {
            const booksSection = document.getElementById("books");
            if (booksSection) {
                booksSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }
});

// Initialize with user's preferred language if not already set
window.addEventListener('load', function() {
    if (!getTranslationCookie() && navigator.language.startsWith("hi")) {
        setTranslationCookie('hi');
        window.location.reload();
    }
});