document.addEventListener('DOMContentLoaded', function() {
    let products = []; // Will store products fetched from JSON

    // --- Get references to all input fields and the search button ---
    const productNameInput = document.getElementById('product-name');
    const priceRangeInput = document.getElementById('price-range');
    const productGroupInput = document.getElementById('product-group');
    const performSearchBtn = document.getElementById('perform-search-btn');

    // --- Autocomplete Datalist Elements ---
    const productNameDatalist = document.getElementById('product-names-suggestions');
    const productGroupDatalist = document.getElementById('product-groups-suggestions');

    // --- Fetch Product Data from JSON ---
    async function fetchProducts() {
        try {
            const response = await fetch('data/products.json'); // Path to your JSON file
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            products = await response.json();
            console.log('Products loaded:', products.length);
            populateDatalists(); // Populate datalists once products are loaded
        } catch (error) {
            console.error('Error fetching products:', error);
            // Display a user-friendly error message on the UI if data cannot be loaded
        }
    }

    // --- Populate Autocomplete Datalists ---
    function populateDatalists() {
        // Get unique product names and groups
        const uniqueProductNames = [...new Set(products.map(p => p["Product Name"]))];
        const uniqueProductGroups = [...new Set(products.map(p => p["Product Group Name"]))];

        // Populate product names datalist
        productNameDatalist.innerHTML = ''; // Clear previous options
        uniqueProductNames.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            productNameDatalist.appendChild(option);
        });

        // Populate product groups datalist
        productGroupDatalist.innerHTML = ''; // Clear previous options
        uniqueProductGroups.forEach(group => {
            const option = document.createElement('option');
            option.value = group;
            productGroupDatalist.appendChild(option);
        });
    }

    // --- Search Functionality ---
    performSearchBtn.addEventListener('click', function() {
        const productName = productNameInput.value.trim();
        const priceRange = priceRangeInput.value.trim();
        const productGroup = productGroupInput.value.trim();

        let minPrice = undefined;
        let maxPrice = undefined;

        // Parse the priceRange input
        if (priceRange) {
            if (priceRange.includes('-')) {
                const parts = priceRange.split('-').map(p => parseFloat(p.trim()));
                if (!isNaN(parts[0])) minPrice = parts[0];
                if (!isNaN(parts[1])) maxPrice = parts[1];
            } else if (!isNaN(parseFloat(priceRange))) {
                minPrice = parseFloat(priceRange);
            }
            // Basic validation: ensure min is not greater than max if both are numbers
            if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
                [minPrice, maxPrice] = [maxPrice, minPrice]; // Swap them
            }
        }

        // Check if at least one search field has a value AND products are loaded
        if ((productName || priceRange || productGroup) && products.length > 0) {
            // Filter products based on criteria
            const filteredResults = products.filter(product => {
                let matchesName = true;
                let matchesPrice = true;
                let matchesGroup = true;

                // Filter by Product Name
                if (productName) {
                    matchesName = product["Product Name"].toLowerCase().includes(productName.toLowerCase());
                }

                // Filter by Price Range
                // Convert "Webshop Price" from "105" (string) to 105 (number)
                const productWebshopPrice = parseFloat(product["Webshop Price"].replace(',', '.'));
                if (!isNaN(productWebshopPrice)) {
                    if (minPrice !== undefined && productWebshopPrice < minPrice) {
                        matchesPrice = false;
                    }
                    if (maxPrice !== undefined && productWebshopPrice > maxPrice) {
                        matchesPrice = false;
                    }
                } else {
                    // If price is invalid, it won't match any price range
                    matchesPrice = false;
                }

                // Filter by Product Group
                if (productGroup) {
                    matchesGroup = product["Product Group Name"].toLowerCase().includes(productGroup.toLowerCase());
                }

                return matchesName && matchesPrice && matchesGroup;
            });

            // Store results in localStorage and redirect
            localStorage.setItem('searchResults', JSON.stringify(filteredResults));
            localStorage.setItem('searchQuery', JSON.stringify({ productName, priceRange, productGroup })); // Store query for display

            window.location.href = 'results.html'; // Redirect to results page

        } else if (products.length === 0) {
            console.log('Product data not loaded yet. Please wait or check for errors.');
            // Inform user that data is still loading
        } else {
            console.log('Please fill at least one search field to proceed.');
            // In a real app, display a user-friendly message on the UI
        }
    });

    // --- Initial Data Fetch ---
    fetchProducts();

    // --- Navbar Marquee Functionality (from previous request) ---
    const navMarqueeMenu = document.getElementById('nav-marquee-menu');
    let navScrollAmount = 0;
    const navScrollSpeed = 0.5; // Adjust for faster/slower scroll
    let navAnimationFrameId;
    let navIsPaused = false;
    let navPauseTimeout;

    const isMobile = () => window.innerWidth < 768; // Tailwind's 'md' breakpoint

    function animateNavMarquee() {
        if (!navIsPaused && isMobile()) {
            navScrollAmount += navScrollSpeed;
            // Reset to beginning if scrolled past content
            if (navMarqueeMenu && navScrollAmount >= navMarqueeMenu.scrollWidth - navMarqueeMenu.clientWidth) {
                navScrollAmount = 0;
            }
            if (navMarqueeMenu) {
                navMarqueeMenu.scrollLeft = navScrollAmount;
            }
        }
        navAnimationFrameId = requestAnimationFrame(animateNavMarquee);
    }

    function startNavMarquee() {
        if (!navAnimationFrameId) {
            animateNavMarquee();
        }
    }

    function stopNavMarquee() {
        if (navAnimationFrameId) {
            cancelAnimationFrame(navAnimationFrameId);
            navAnimationFrameId = null;
        }
    }

    const pauseNavMarquee = () => {
        navIsPaused = true;
        clearTimeout(navPauseTimeout);
        stopNavMarquee();
    };

    const resumeNavMarquee = () => {
        navIsPaused = false;
        if (isMobile()) {
            navPauseTimeout = setTimeout(() => {
                startNavMarquee();
            }, 1000); // Resume after 1 second of inactivity
        }
    };

    if (navMarqueeMenu) {
        navMarqueeMenu.addEventListener('mouseenter', pauseNavMarquee);
        navMarqueeMenu.addEventListener('mouseleave', resumeNavMarquee);
        navMarqueeMenu.addEventListener('touchstart', pauseNavMarquee);
        navMarqueeMenu.addEventListener('touchend', resumeNavMarquee);
        navMarqueeMenu.addEventListener('scroll', () => {
            pauseNavMarquee();
            clearTimeout(navPauseTimeout);
            navPauseTimeout = setTimeout(resumeNavMarquee, 200);
        });
    }

    if (isMobile()) {
        startNavMarquee();
    }

    window.addEventListener('resize', () => {
        if (isMobile()) {
            startNavMarquee();
        } else {
            stopNavMarquee();
            if (navMarqueeMenu) {
                navMarqueeMenu.scrollLeft = 0;
            }
        }
    });

    // --- Hero Carousel Functionality (from previous request) ---
    const carouselTrack = document.getElementById('carousel-track');
    const carouselDotsContainer = document.getElementById('carousel-dots');
    let slides = [];
    let totalSlides = 0;
    let currentSlideIndex = 0;
    let autoSlideInterval;
    const autoSlideDelay = 5000; // 5 seconds

    // Ensure carousel elements exist before trying to access them
    if (carouselTrack && carouselDotsContainer) {
        slides = Array.from(carouselTrack.children);
        totalSlides = slides.length;

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
    } else {
        console.warn("Carousel elements not found. Carousel functionality skipped.");
    }
});
