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
  const copyLinkBtn = document.getElementById("copyLinkBtn");

  // Generate product link
  function generateProductLink(product) {
    const nameSlug = product["Product Name"]
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return `${window.location.origin}/products/${nameSlug}-${product["Product Number"]}`;
  }

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
      <!--<p><strong>Weight:</strong> ${product["Weight"]} kg <sub>(s)</sub></p>-->
      <p><strong>Car Year:</strong> ${product["Car Year"]}</p>
    `;

    // Attach link generator to button
    if (copyLinkBtn) {
      copyLinkBtn.onclick = () => {
        const link = generateProductLink(product);
        navigator.clipboard.writeText(link).then(() => {
          copyLinkBtn.textContent = "Link Copied!";
          setTimeout(() => (copyLinkBtn.textContent = "Copy Product Link"), 2000);
        });
      };
    }

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
      const shuffled = data.sort(() => 0.5 - Math.random());
      const products = shuffled.slice(0, 60);

      products.forEach((product) => {
        const imageUrl =
          product["Image Link"] && product["Image Link"] !== "nan"
            ? `Assets/images/${product["Image Link"]}`
            : "Assets/images/placeholder.webp";

        const stock = parseInt(product["Stock"], 10) || 0;
        const stockBadge = stock > 0
          ? `<span class="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">In Stock</span>`
          : `<span class="inline-block bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">Out of Stock</span>`;

        const card = document.createElement("div");
        card.className =
          "bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden flex flex-col transition-shadow duration-300";

        card.innerHTML = `
          <div class="relative">
            <img src="${imageUrl}" alt="${product["Product Name"]}" class="w-full h-64 object-cover cursor-pointer">
            <div class="absolute top-2 left-2">${stockBadge}</div>
          </div>
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
                <!--<div><strong>Weight:</strong> ${product["Weight"]} kg <sub>(s)</sub></div>-->
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
