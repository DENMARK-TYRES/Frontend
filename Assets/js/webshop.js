// products.js

// Path to your JSON file
const JSON_FILE = "data/products.json";

document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.querySelector("#webshop .grid");

  // Modal elements
  const modal = document.getElementById("productModal");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalPrice = document.getElementById("modalPrice");
  const modalDetails = document.getElementById("modalDetails");

  // Open modal function
  function openModal(product, imageUrl) {
    modalImage.src = imageUrl;
    modalTitle.textContent = product["Product Name"];
    modalPrice.textContent = `£${product["Webshop Price"]}`;

    modalDetails.innerHTML = `
      <p><strong>PCD-EU:</strong> ${product["PCD-EU mm"]} mm</p>
      <p><strong>Size:</strong> ${product["Wheel Size in Inch"]} inch</p>
      <p><strong>Material:</strong> ${product["Wheel Material"]}</p>
      <p><strong>Car Model:</strong> ${product["Car Model"]}</p>
      <p><strong>Car Year:</strong> ${product["Car Year"]}</p>
    `;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  // Close modal function
  function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }

  // Close modal on background click
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Load products
  fetch(JSON_FILE)
    .then((res) => res.json())
    .then((data) => {
      // Shuffle the array randomly
      const shuffled = data.sort(() => 0.5 - Math.random());

      // Take first 60 unique products
      const products = shuffled.slice(0, 60);

      products.forEach((product) => {
        const imageUrl =
          product["Image Link"] && product["Image Link"] !== "nan"
            ? `Assets/images/${product["Image Link"]}`
            : "Assets/images/placeholder.webp";

        // Create product card HTML
        const card = document.createElement("div");
        card.className =
          "bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden flex flex-col transition-shadow duration-300";

        card.innerHTML = `
          <img src="${imageUrl}" alt="${product["Product Name"]}" class="w-full h-full object-cover cursor-pointer">
          <div class="p-5 flex flex-col flex-grow justify-between">
            <div>
              <h4 class="text-lg font-bold mb-2 text-gray-800">${product["Product Name"]}</h4>
              <p class="text-3xl font-extrabold text-red-700 mb-4">£${product["Webshop Price"]}</p>
              
              <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
                <div><strong>PCD:</strong> ${product["PCD-EU mm"]} mm</div>
                <div><strong>Size:</strong> ${product["Wheel Size in Inch"]} inch</div>
                <div><strong>Material:</strong> ${product["Wheel Material"]}</div>
                <div><strong>Car Model:</strong> ${product["Car Model"]}</div>
                <div><strong>Car Year:</strong> ${product["Car Year"]}</div>
              </div>
            </div>

            <div class="mt-5 flex space-x-3">
              <button class="flex-1 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-full hover:bg-gray-100 transition more-details-btn">
                More Details
              </button>
              <button class="flex-1 bg-red-700 text-white font-bold py-2 px-4 rounded-full hover:bg-red-800 transition">
                Place Order
              </button>
            </div>
          </div>
        `;

        // Attach modal triggers
        const imgEl = card.querySelector("img");
        const detailsBtn = card.querySelector(".more-details-btn");

        imgEl.addEventListener("click", () => openModal(product, imageUrl));
        detailsBtn.addEventListener("click", () => openModal(product, imageUrl));

        productsContainer.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Error loading products:", error);
      productsContainer.innerHTML =
        "<p class='text-center text-red-600'>Failed to load products.</p>";
    });
});
