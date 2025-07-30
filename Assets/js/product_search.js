document.addEventListener('DOMContentLoaded', function() {
    // FIXME: TEST DATA TO SIMULATE DB QUERY
    const products = [
        {
            "id": 1,
            "name": "Vintage Sport Tyre 17-inch",
            "price": 120.00,
            "group": "Tyres",
            "images": ["Assets/images/vintage_tyre.webp", "Assets/images/tyre_alt1.webp", "Assets/images/tyre_alt2.webp"],
            "description": "A classic sport tyre for enhanced grip and performance."
        },
        {
            "id": 2,
            "name": "Chrome Classic Rim 15-inch",
            "price": 250.00,
            "group": "Rims",
            "images": ["Assets/images/Red_Rim.webp", "Assets/images/rim_alt1.webp"],
            "description": "Shiny chrome rim, perfect for a vintage restoration."
        },
        {
            "id": 3,
            "name": "All-Season Tyre 16-inch",
            "price": 95.00,
            "group": "Tyres",
            "images": ["Assets/images/vintage_tyre.webp"],
            "description": "Durable all-season tyre for reliable performance."
        },
        {
            "id": 4,
            "name": "Alloy Racing Rim 18-inch",
            "price": 380.00,
            "group": "Rims",
            "images": ["Assets/images/Red_Rim.webp", "Assets/images/rim_alt2.webp", "Assets/images/rim_alt3.webp"],
            "description": "Lightweight alloy rim designed for racing enthusiasts."
        },
        {
            "id": 5,
            "name": "Whitewall Vintage Tyre 14-inch",
            "price": 150.00,
            "group": "Tyres",
            "images": ["Assets/images/vintage_tyre.webp", "Assets/images/tyre_alt3.webp"],
            "description": "Authentic whitewall tyre for a true vintage look."
        },
        {
            "id": 6,
            "name": "Steel Wheel Rim 16-inch",
            "price": 80.00,
            "group": "Rims",
            "images": ["Assets/images/Red_Rim.webp"],
            "description": "Robust steel rim, ideal for heavy-duty use."
        },
        {
            "id": 7,
            "name": "Performance Tyre 17-inch",
            "price": 180.00,
            "group": "Tyres",
            "images": ["Assets/images/vintage_tyre.webp"],
            "description": "High-performance tyre for sports cars."
        },
        {
            "id": 8,
            "name": "Deep Dish Rim 15-inch",
            "price": 300.00,
            "group": "Rims",
            "images": ["Assets/images/Red_Rim.webp", "Assets/images/rim_alt1.webp"],
            "description": "Stylish deep dish rim for a custom look."
        },
        {
            "id": 9,
            "name": "Off-Road Tyre 16-inch",
            "price": 130.00,
            "group": "Tyres",
            "images": ["Assets/images/vintage_tyre.webp"],
            "description": "Aggressive tread tyre for off-road adventures."
        },
        {
            "id": 10,
            "name": "Spoke Wheel Rim 17-inch",
            "price": 420.00,
            "group": "Rims",
            "images": ["Assets/images/Red_Rim.webp", "Assets/images/rim_alt2.webp"],
            "description": "Elegant spoke wheel rim for a classic touch."
        }
    ];

    // --- Get references to all input fields and the search button ---
    const productNameInput = document.getElementById('product-name');
    const priceRangeInput = document.getElementById('price-range');
    const productGroupInput = document.getElementById('product-group');
    const performSearchBtn = document.getElementById('perform-search-btn');

    // --- Autocomplete Datalist Elements ---
    const productNameDatalist = document.getElementById('product-names-suggestions');
    const productGroupDatalist = document.getElementById('product-groups-suggestions');

    // --- Populate Autocomplete Datalists on Load ---
    function populateDatalists() {
        // Get unique product names and groups
        const uniqueProductNames = [...new Set(products.map(p => p.name))];
        const uniqueProductGroups = [...new Set(products.map(p => p.group))];

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

    // Call populateDatalists when the DOM is ready
    populateDatalists();

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

        // Check if at least one search field has a value
        if (productName || priceRange || productGroup) {
            // Filter products based on criteria
            const filteredResults = products.filter(product => {
                let matchesName = true;
                let matchesPrice = true;
                let matchesGroup = true;

                // Filter by Product Name
                if (productName) {
                    matchesName = product.name.toLowerCase().includes(productName.toLowerCase());
                }

                // Filter by Price Range
                if (minPrice !== undefined && product.price < minPrice) {
                    matchesPrice = false;
                }
                if (maxPrice !== undefined && product.price > maxPrice) {
                    matchesPrice = false;
                }

                // Filter by Product Group
                if (productGroup) {
                    matchesGroup = product.group.toLowerCase().includes(productGroup.toLowerCase());
                }

                return matchesName && matchesPrice && matchesGroup;
            });

            // Store results in localStorage and redirect
            localStorage.setItem('searchResults', JSON.stringify(filteredResults));
            localStorage.setItem('searchQuery', JSON.stringify({ productName, priceRange, productGroup })); // Store query for display

            window.location.href = 'results.html'; // Redirect to results page

        } else {
            console.log('Please fill at least one search field to proceed.');
            // In a real app, display a user-friendly message on the UI
        }
    });

});
