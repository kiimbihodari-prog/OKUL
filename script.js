/* =========================================
   KAKELO SECONDARY - WEBSITE INTERACTIONS
   ========================================= */

// MOBILE NAVIGATION
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuToggle.textContent = isOpen ? "✕" : "☰";
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });

  // Close the mobile menu when a navigation link is clicked.
  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    });
  });
}

// FOOTER YEAR
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// DEMONSTRATION STUDENT LOGIN (Safe check added so it doesn't crash if ID is missing)
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

if (loginForm && loginMessage) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const admission = document.getElementById("admission").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!fullName || !admission || !phone) {
      loginMessage.textContent = "Please complete all the fields.";
      loginMessage.style.color = "#c62828";
      return;
    }

    loginMessage.textContent = `Welcome, ${fullName}! Your demonstration login is complete.`;
    loginMessage.style.color = "#16814d";
  });
}

// PHOTO SLIDESHOW
const slides = [
    {
        image: "images (1).jpg",
        caption: "image of the school",
        number: "1 / 4"
    },
    {
        image: "studentsz.png",
        caption: "Students posing for a photo",
        number: "2 / 4"
    },
    {
        image: "computer lab.png",
        caption: "Computer laboratory",
        number: "3 / 4"
    },
    {
        image: "library.jpg.png",
        caption: "School library",
        number: "4 / 4"
    }
];

const slideImage = document.getElementById("slideImage");
const slideCaption = document.getElementById("slideCaption");
const slideNumber = document.getElementById("slideNumber");
const slideDots = document.getElementById("slideDots");
const prevSlide = document.getElementById("prevSlide");
const nextSlide = document.getElementById("nextSlide");
const slideshow = document.querySelector(".slideshow");

let currentSlide = 0;
let slideshowTimer;
let touchStartX = 0;

// Build the navigation dots only if slideDots exists in HTML
if (slideDots) {
  slides.forEach((slide, index) => {
    const dot = document.createElement("button");

    dot.className = "slide-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Show photo ${index + 1}`);

    dot.addEventListener("click", () => {
      showSlide(index);
      restartSlideshow();
    });

    slideDots.appendChild(dot);
  });
}

function showSlide(index) {
  if (!slideImage) return;
  
  currentSlide = (index + slides.length) % slides.length;
  const slide = slides[currentSlide];

  slideImage.style.opacity = "0";

  window.setTimeout(() => {
    slideImage.src = slide.image;
    slideImage.alt = slide.caption; // Fixed from slide.alt to slide.caption
    if (slideCaption) slideCaption.textContent = slide.caption;
    if (slideNumber) slideNumber.textContent = slide.number; // Uses your array's number format ("1 / 4")

    slideImage.onload = () => {
      slideImage.style.opacity = "1";
    };

    slideImage.onerror = () => {
      slideImage.style.opacity = "1";
      if (slideCaption) slideCaption.textContent = "Please check your image filename.";
    };

    if (slideImage.complete && slideImage.naturalWidth > 0) {
      slideImage.style.opacity = "1";
    }
  }, 180);

  document.querySelectorAll(".slide-dot").forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === currentSlide);
    dot.setAttribute("aria-current", dotIndex === currentSlide ? "true" : "false");
  });
}

function startSlideshow() {
  window.clearInterval(slideshowTimer);

  slideshowTimer = window.setInterval(() => {
    showSlide(currentSlide + 1);
  }, 4000); // Changes every 4 seconds
}

function restartSlideshow() {
  startSlideshow();
}

if (prevSlide) {
  prevSlide.addEventListener("click", () => {
    showSlide(currentSlide - 1);
    restartSlideshow();
  });
}

if (nextSlide) {
  nextSlide.addEventListener("click", () => {
    showSlide(currentSlide + 1);
    restartSlideshow();
  });
}

// Pause automatic changes while the mouse is over the slideshow.
if (slideshow) {
  slideshow.addEventListener("mouseenter", () => {
    window.clearInterval(slideshowTimer);
  });

  slideshow.addEventListener("mouseleave", startSlideshow);

  // Support swiping between photos on phones.
  slideshow.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });

  slideshow.addEventListener("touchend", (event) => {
    const touchEndX = event.changedTouches[0].screenX;
    const distance = touchEndX - touchStartX;

    if (Math.abs(distance) > 50) {
      showSlide(currentSlide + (distance < 0 ? 1 : -1));
      restartSlideshow();
    }
  }, { passive: true });
}

// Display the first photo and begin automatic rotation.
if (slideImage) {
  showSlide(0);
  startSlideshow();
}