document.addEventListener('DOMContentLoaded', function() {
    const navMarqueeMenu = document.getElementById('nav-marquee-menu');
    let scrollAmount = 0;
    const scrollSpeed = 15; // Adjust for faster/slower scroll
    let animationFrameId;
    let isPaused = false;
    let pauseTimeout;

    // Function to check if we are on a mobile screen size
    const isMobile = () => window.innerWidth < 768; // Tailwind's 'md' breakpoint

    function animateMarquee() {
        if (!isPaused && isMobile()) {
            scrollAmount += scrollSpeed;
            if (scrollAmount >= navMarqueeMenu.scrollWidth - navMarqueeMenu.clientWidth) {
                // If scrolled to the end, reset to beginning
                scrollAmount = 0; // Or a small positive value to prevent flicker
            }
            navMarqueeMenu.scrollLeft = scrollAmount;
        }
        animationFrameId = requestAnimationFrame(animateMarquee);
    }

    function startMarquee() {
        if (!animationFrameId) {
            animateMarquee();
        }
    }

    function stopMarquee() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    // Pause marquee on user interaction
    const pauseMarquee = () => {
        isPaused = true;
        clearTimeout(pauseTimeout); // Clear any pending resume
        stopMarquee();
    };

    // Resume marquee after a short delay
    const resumeMarquee = () => {
        isPaused = false;
        // Only resume if it's a mobile view
        if (isMobile()) {
            pauseTimeout = setTimeout(() => {
                startMarquee();
            }, 1000); // Resume after 1 second of inactivity
        }
    };

    // Event listeners for user interaction
    if (navMarqueeMenu) {
        // Mouse events for desktop (if user resizes window)
        navMarqueeMenu.addEventListener('mouseenter', pauseMarquee);
        navMarqueeMenu.addEventListener('mouseleave', resumeMarquee);

        // Touch events for mobile
        navMarqueeMenu.addEventListener('touchstart', pauseMarquee);
        navMarqueeMenu.addEventListener('touchend', resumeMarquee);
        navMarqueeMenu.addEventListener('scroll', () => {
            // If user is actively scrolling, keep it paused
            pauseMarquee();
            // And then resume after a short delay if scrolling stops
            clearTimeout(pauseTimeout);
            pauseTimeout = setTimeout(resumeMarquee, 200); // Shorter delay for active scroll
        });
    }

    // Start marquee initially if on mobile
    if (isMobile()) {
        startMarquee();
    }

    // Adjust marquee behavior on window resize
    window.addEventListener('resize', () => {
        if (isMobile()) {
            startMarquee(); // Start if resized to mobile
        } else {
            stopMarquee(); // Stop if resized to desktop
            navMarqueeMenu.scrollLeft = 0; // Reset scroll position for desktop
        }
    });

    //info row search functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            console.log('Searching for:', query);
            // In a real application, you would typically redirect the user to a search results page:
            // window.location.href = `/search?q=${encodeURIComponent(query)}`;
        } else {
            console.log('Search input is empty. Please type something to search.');
            // Optionally, you could show a temporary message to the user here
        }
    }

    // Event listener for pressing 'Enter' key in the search input
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Event listener for clicking the search button
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }

    // hero section banners carousel
    const carouselTrack = document.getElementById('carousel-track');
        const carouselDotsContainer = document.getElementById('carousel-dots');
        const slides = Array.from(carouselTrack.children);
        const totalSlides = slides.length;
        let currentSlideIndex = 0;
        let autoSlideInterval;
        const autoSlideDelay = 5000; // 5 seconds

        // Create navigation dots
        function createDots() {
            carouselDotsContainer.innerHTML = ''; // Clear existing dots
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('w-3', 'h-3', 'rounded-full', 'mx-1', 'focus:outline-none', 'dot');
                dot.setAttribute('data-slide-to', index);
                dot.addEventListener('click', () => {
                    showSlide(index);
                    resetAutoSlide();
                });
                carouselDotsContainer.appendChild(dot);
            });
        }

        // Update active dot and slide position
        function showSlide(index) {
            if (index < 0) {
                currentSlideIndex = totalSlides - 1;
            } else if (index >= totalSlides) {
                currentSlideIndex = 0;
            } else {
                currentSlideIndex = index;
            }

            // Update transform for smooth sliding
            const offset = -currentSlideIndex * 100;
            carouselTrack.style.transform = `translateX(${offset}%)`;

            // Update active dot
            document.querySelectorAll('.dot').forEach((dot, idx) => {
                if (idx === currentSlideIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        function nextSlide() {
            showSlide(currentSlideIndex + 1);
        }

        function prevSlide() { // Still needed for swipe functionality
            showSlide(currentSlideIndex - 1);
        }

        function startAutoSlide() {
            clearInterval(autoSlideInterval); // Clear any existing interval
            autoSlideInterval = setInterval(nextSlide, autoSlideDelay);
        }

        function resetAutoSlide() {
            startAutoSlide(); // Restart the interval
        }

        // Touch/Swipe Functionality for Mobile
        let touchStartX = 0;
        let touchEndX = 0;

        carouselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            clearInterval(autoSlideInterval); // Pause auto-slide on touch
        });

        carouselTrack.addEventListener('touchmove', (e) => {
            touchEndX = e.touches[0].clientX;
        });

        carouselTrack.addEventListener('touchend', () => {
            const swipeThreshold = 50; // Minimum pixels to register a swipe
            const diff = touchStartX - touchEndX;

            if (diff > swipeThreshold) {
                nextSlide(); // Swiped left
            } else if (diff < -swipeThreshold) {
                prevSlide(); // Swiped right
            }
            resetAutoSlide(); // Resume auto-slide after touch ends
        });

        // Initialize carousel
        createDots();
        showSlide(0); // Show the first slide initially
        startAutoSlide(); // Start auto-sliding
    
});