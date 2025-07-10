// DOM Elements
const favoriteBtn = document.getElementById("favoriteBtn")
const shareBtn = document.getElementById("shareBtn")
const loadMoreBtn = document.getElementById("loadMoreBtn")

// State
let isFavorited = false
let reviewsLoaded = 4

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners()
  initializeAnimations()
})

// Event Listeners
function initializeEventListeners() {
  // Favorite button
  favoriteBtn.addEventListener("click", toggleFavorite)

  // Share button
  shareBtn.addEventListener("click", shareBook)

  // Load more reviews button
  loadMoreBtn.addEventListener("click", loadMoreReviews)

  // Read Now button
  const readNowBtn = document.querySelector(".btn-primary")
  readNowBtn.addEventListener("click", handleReadNow)

  // Write Review button
  const writeReviewBtn = document.querySelector(".reviews-header .btn-outline")
  writeReviewBtn.addEventListener("click", handleWriteReview)
}

// Favorite functionality
function toggleFavorite() {
  isFavorited = !isFavorited
  const icon = favoriteBtn.querySelector("i")

  if (isFavorited) {
    icon.className = "fas fa-heart"
    favoriteBtn.style.color = "#ef4444"
    showNotification("Added to favorites!")
  } else {
    icon.className = "far fa-heart"
    favoriteBtn.style.color = "#6b7280"
    showNotification("Removed from favorites")
  }

  // Add animation
  favoriteBtn.style.transform = "scale(1.2)"
  setTimeout(() => {
    favoriteBtn.style.transform = "scale(1)"
  }, 150)
}

// Share functionality
function shareBook() {
  if (navigator.share) {
    navigator
      .share({
        title: "The Midnight Library by Matt Haig",
        text: "Check out this amazing book!",
        url: window.location.href,
      })
      .catch(console.error)
  } else {
    // Fallback for browsers that don't support Web Share API
    copyToClipboard(window.location.href)
    showNotification("Link copied to clipboard!")
  }
}

// Copy to clipboard utility
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand("copy")
    document.body.removeChild(textArea)
  }
}

// Load more reviews
function loadMoreReviews() {
  const additionalReviews = [
    {
      name: "Lisa Wang",
      avatar: "https://via.placeholder.com/48x48/06b6d4/ffffff?text=LW",
      rating: 5,
      date: "1 month ago",
      text: "A profound and moving exploration of life's infinite possibilities. This book will stay with you long after you finish reading it.",
    },
    {
      name: "James Miller",
      avatar: "https://via.placeholder.com/48x48/84cc16/ffffff?text=JM",
      rating: 4,
      date: "1 month ago",
      text: "Beautifully written with a unique concept. Some parts dragged a bit, but overall a very engaging and thought-provoking read.",
    },
  ]

  const reviewsList = document.querySelector(".reviews-list")

  additionalReviews.forEach((review) => {
    const reviewElement = createReviewElement(review)
    reviewsList.appendChild(reviewElement)
  })

  reviewsLoaded += additionalReviews.length

  // Hide load more button after loading additional reviews
  loadMoreBtn.style.display = "none"
  showNotification("More reviews loaded!")
}

// Create review element
function createReviewElement(review) {
  const reviewCard = document.createElement("div")
  reviewCard.className = "review-card"
  reviewCard.style.opacity = "0"
  reviewCard.style.transform = "translateY(20px)"

  const stars = generateStars(review.rating)

  reviewCard.innerHTML = `
        <div class="review-content">
            <div class="reviewer-avatar">
                <img src="${review.avatar}" alt="${review.name}">
            </div>
            <div class="review-details">
                <div class="review-meta">
                    <h4 class="reviewer-name">${review.name}</h4>
                    <div class="review-stars">${stars}</div>
                    <span class="review-date">${review.date}</span>
                </div>
                <p class="review-text">"${review.text}"</p>
            </div>
        </div>
    `

  // Animate in
  setTimeout(() => {
    reviewCard.style.transition = "all 0.3s ease-out"
    reviewCard.style.opacity = "1"
    reviewCard.style.transform = "translateY(0)"
  }, 100)

  return reviewCard
}

// Generate stars HTML
function generateStars(rating) {
  let starsHTML = ""
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      starsHTML += '<i class="fas fa-star"></i>'
    } else {
      starsHTML += '<i class="far fa-star"></i>'
    }
  }
  return starsHTML
}

// Handle Read Now button
function handleReadNow() {
  showNotification("Opening book reader...")
  // In a real application, this would open the book reader
  setTimeout(() => {
    alert("This would open the book reader in a real application!")
  }, 500)
}

// Handle Write Review button
function handleWriteReview() {
  showNotification("Opening review form...")
  // In a real application, this would open a review form modal
  setTimeout(() => {
    alert("This would open a review form in a real application!")
  }, 500)
}

// Notification system
function showNotification(message) {
  // Remove existing notification
  const existingNotification = document.querySelector(".notification")
  if (existingNotification) {
    existingNotification.remove()
  }

  // Create notification
  const notification = document.createElement("div")
  notification.className = "notification"
  notification.textContent = message
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 24px;
        border-radius: 6px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
    `

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      notification.remove()
    }, 300)
  }, 3000)
}

// Initialize animations
function initializeAnimations() {
  // Smooth scroll for any anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Add hover effects to review cards
  const reviewCards = document.querySelectorAll(".review-card")
  reviewCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })
}

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observe elements for scroll animations
document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(".review-card, .summary-section, .author-section")
  animateElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(20px)"
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out"
    observer.observe(el)
  })
})
