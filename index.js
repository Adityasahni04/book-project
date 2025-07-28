
document.addEventListener('DOMContentLoaded', function () {
    const supportToggle = document.querySelector('.support-toggle');
    const supportPanel = document.querySelector('.support-panel');

    supportToggle.addEventListener('click', function (e) {
        e.preventDefault();

        if (supportPanel.style.display === 'none' || !supportPanel.style.display) {
            supportPanel.style.display = 'block';
        } else {
            supportPanel.style.display = 'none';
        }
    });

    const swipeBtn = document.querySelector('.swipe-btn');
    swipeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        alert('This would integrate with a payment processor like Razorpay, Stripe, etc.');
    });
});
// Form Submission
async function trackViews() {
    try {
        const response = await fetch('https://book-project-00ch.onrender.com/views');
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();

        console.log('Total Views:', data.totalViews);
        console.log('Daily Views:', data.dailyViews);
    } catch (error) {
        console.error('Failed to track views:', error);
    }
}

window.addEventListener('load', trackViews);
// Podcast Play Buttons
document.querySelectorAll('.podcast-play').forEach(button => {
    button.addEventListener('click', function () {
        const icon = this.querySelector('i');

        // Toggle between play and pause
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

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.2 });

observer.observe(document.getElementById('bookMonth'));
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};


const form = document.forms['contact-form'];

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form['Name'].value.trim();
    const email = form['Email'].value.trim();
    const subject = form['Subject'].value.trim();
    const message = form['Message'].value.trim();


    const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|.*\.stu)$/i;
    const namePattern = /^[A-Za-z][A-Za-z\s]*$/;

    if (!namePattern.test(name)) {
        return Swal.fire({
            icon: 'warning',
            title: 'Invalid Name',
            text: 'Name must start with a letter and not contain special characters at the beginning.',
        });
    }

    if (!emailPattern.test(email)) {
        return Swal.fire({
            icon: 'warning',
            title: 'Invalid Email',
            text: 'Email must be from Gmail, Yahoo, or end with .stu.',
        });
    }

    if (subject.length === 0) {
        return Swal.fire({
            icon: 'warning',
            title: 'Subject Missing',
            text: 'Please enter a subject.',
        });
    }

    if (message.length === 0) {
        return Swal.fire({
            icon: 'warning',
            title: 'Message Missing',
            text: 'Please enter a message.',
        });
    }

    const formData = { Name: name, Email: email, Subject: subject, Message: message };

    try {
        const response = await fetch('https://book-project-00ch.onrender.com/submit-form', {  
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Message Sent!',
                text: 'Thank you for contacting us.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.reload();
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong. Please try again!',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Retry'
            });
        }
    } catch (error) {
        console.error('Error!', error.message);
        Swal.fire({
            icon: 'error',
            title: 'Server Error!',
            text: 'Unable to send message right now. Try again later.',
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK'
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const tabBtns = document.querySelectorAll(".tab-btn")
    const tabContents = document.querySelectorAll(".tab-content")
    const tabIndicator = document.querySelector(".tab-indicator")

    // Function to switch tabs
    function switchTab(tabId) {
        // Update active button
        tabBtns.forEach((btn) => {
            if (btn.dataset.tab === tabId) {
                btn.classList.add("active")
            } else {
                btn.classList.remove("active")
            }
        })

        // Update tab indicator position
        if (tabId === "us") {
            tabIndicator.style.transform = "translateX(100%)"
        } else {
            tabIndicator.style.transform = "translateX(0)"
        }

        // Show active content with animation
        tabContents.forEach((content) => {
            if (content.id === `${tabId}-tab`) {
                // First set to display block so the animation works
                content.style.display = "block"

                // Force a reflow to ensure the animation works
                void content.offsetWidth

                // Then add active class for the animation
                content.classList.add("active")
            } else {
                content.classList.remove("active")

                // Set a timeout to hide the content after animation completes
                setTimeout(() => {
                    if (!content.classList.contains("active")) {
                        content.style.display = "none"
                    }
                }, 300)
            }
        })
    }

    // Add click event listeners to tab buttons
    tabBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            const tabId = this.dataset.tab
            switchTab(tabId)
        })
    })
})

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

const images = ["images/bg4.png", "images/bg11.jpg"]; // Add your image filenames here
let currentIndex = 0;

function showImage(index) {
    const img = document.getElementById("bookImage");
    img.src = images[index];
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
}

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
}


function handleProtectedRedirect(targetPage) {
    if (localStorage.getItem("isLoggedIn") === "true") {
        window.location.href = targetPage;
    } else {
        localStorage.setItem("redirectAfterLogin", targetPage);
        window.location.href = "sign-login.html";
    }
}

