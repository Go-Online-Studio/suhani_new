/**
 * product-manager.js
 * Handles fetching product data, populating the view, and initializing interactions (Gallery/WhatsApp).
 */

let currentProductData = null;

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Initialize Fancybox (The Fix) ---
    // We bind it to the selector. Because Fancybox 5 uses event delegation on the body,
    // this works perfectly for dynamic content loaded via fetch() later.
    if (typeof Fancybox !== "undefined") {
        Fancybox.bind("[data-fancybox='product-gallery']", {
            // Optional: Infinite loop for gallery navigation
            Carousel: {
                infinite: false,
            },
            // Optional: Show thumbnails by default in the lightbox
            Thumbs: {
                autoStart: false,
            }
        });
    } else {
        console.error("Fancybox is not loaded. Check your script tags.");
    }

    // --- 2. Get Product ID from URL ---
    // Example: product-view.html?id=wave-board
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        // Redirect to home or listing page if no ID is provided
        window.location.href = 'index.html'; 
        return;
    }

    // --- 3. Fetch Data & Populate ---
    fetch('products.json')
        .then(res => {
            if (!res.ok) throw new Error("Network response was not ok");
            return res.json();
        })
        .then(products => {
            // Find the specific product by ID
            const product = products.find(p => p.id === productId);
            
            if (product) {
                currentProductData = product;
                loadProduct(product);
            } else {
                handleProductNotFound();
            }
        })
        .catch(err => {
            console.error("Failed to load products:", err);
            handleProductNotFound();
        });
});

/**
 * Populates the HTML elements with the fetched product data
 */
function loadProduct(data) {
    // --- Text Content ---
    safeSetText('breadCrumbName', data.name);
    safeSetText('prodCategory', data.category);
    safeSetText('prodName', data.name);
    safeSetText('prodShortDesc', data.shortDesc);
    safeSetText('prodFullDesc', data.fullDesc);

    // --- Images & Gallery ---
    if (data.images && data.images.length > 0) {
        // Set Main Image (First image is default)
        const mainImg = document.getElementById('mainImg');
        if (mainImg) mainImg.src = data.images[0];

        // 1. Generate Visible Thumbnails (Grid)
        const thumbGrid = document.getElementById('thumbGrid');
        if (thumbGrid) {
            thumbGrid.innerHTML = data.images.map((img, index) => `
                <div class="col-3">
                    <div class="ratio ratio-1x1">
                        <img src="${img}" 
                             class="img-fluid w-100 h-100 object-fit-cover product-gallery-thumbs ${index === 0 ? 'active' : ''}" 
                             onclick="updateMainImage(this, ${index})" 
                             alt="${data.name} View ${index + 1}"
                             style="cursor: pointer;">
                    </div>
                </div>
            `).join('');
        }

        // 2. Populate Hidden Gallery for Fancybox
        // These invisible links are what Fancybox actually "reads" when triggered
        const hiddenGallery = document.getElementById('hiddenGallery');
        if (hiddenGallery) {
            hiddenGallery.innerHTML = data.images.map((img, index) => `
                <a href="${img}" 
                   data-fancybox="product-gallery" 
                   data-caption="${data.name} - View ${index + 1}">
                </a>
            `).join('');
        }
    }

    // --- Specs Table ---
    const specsTable = document.getElementById('specsTable');
    if (specsTable && data.specs) {
        specsTable.innerHTML = Object.entries(data.specs).map(([k, v]) => `
            <tr class="spec-row">
                <td class="text_brand py-3 ps-3 w-25 border-end border-secondary border-opacity-25 text-uppercase small">${k}</td>
                <td class="text-white py-3 ps-3 fw-bold">${v}</td>
            </tr>
        `).join('');
    }

    // --- Features List ---
    const featuresList = document.getElementById('featuresList');
    if (featuresList && data.features) {
        featuresList.innerHTML = data.features.map(f => `
            <li class="col-md-6 d-flex align-items-center mb-2">
                <i class="bi bi-caret-right-fill colorMain me-2"></i>
                <span class="text-light small text-uppercase fw-bold">${f}</span>
            </li>
        `).join('');
    }

    // --- Responsive WhatsApp Link ---
    updateWhatsAppLink(data.name);
    window.addEventListener('resize', () => updateWhatsAppLink(data.name));
}

/**
 * Updates the Main Display Image when a thumbnail is clicked
 */
window.updateMainImage = function (thumb, index) {
    if (!currentProductData || !currentProductData.images[index]) return;

    const src = currentProductData.images[index];
    const mainImg = document.getElementById('mainImg');
    
    // Update src with a simple fade effect could be added here, 
    // but for now we just swap source
    if (mainImg) mainImg.src = src;

    // Update active border class styling
    document.querySelectorAll('.product-gallery-thumbs').forEach(el => el.classList.remove('active'));
    thumb.classList.add('active');
}

/**
 * Triggers Fancybox to open the gallery starting from the currently visible image
 */
window.openProductGallery = function () {
    // 1. Find which thumbnail is currently active
    const activeThumb = document.querySelector('.product-gallery-thumbs.active');
    
    // 2. Determine index (default to 0 if not found)
    let index = 0;
    if (activeThumb) {
        const allThumbs = Array.from(document.querySelectorAll('.product-gallery-thumbs'));
        index = allThumbs.indexOf(activeThumb);
    }

    // 3. Trigger the corresponding hidden link
    // Fancybox event delegation monitors clicks on these links
    const hiddenLinks = document.querySelectorAll('#hiddenGallery a');
    if (hiddenLinks[index]) {
        hiddenLinks[index].click();
    } else if (hiddenLinks.length > 0) {
        hiddenLinks[0].click();
    }
}

/**
 * Generates correct WhatsApp link based on device type
 */
function updateWhatsAppLink(productName) {
    const phone = "919898011309"; // Removed formatting for cleaner API call
    const msg = encodeURIComponent(`Hi, I am interested in *${productName}*. Please provide a quote.`);
    const btn = document.getElementById('whatsappBtn');

    if (!btn) return;

    // Check if mobile width OR mobile user agent
    const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    btn.href = isMobile
        ? `https://wa.me/${phone}?text=${msg}`
        : `https://web.whatsapp.com/send?phone=${phone}&text=${msg}`;
}

/**
 * Helper: Safely set text content if element exists
 */
function safeSetText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text || '';
}

/**
 * Helper: Handle "Product Not Found" scenario
 */
function handleProductNotFound() {
    safeSetText('prodName', "Product Not Found");
    safeSetText('breadCrumbName', "Not Found");
    
    // Disable buttons
    const btns = document.querySelectorAll('.btn-service');
    btns.forEach(btn => btn.classList.add('disabled', 'opacity-50'));
}
