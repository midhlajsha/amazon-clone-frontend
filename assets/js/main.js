let products = [];
let cart = JSON.parse(localStorage.getItem('amazon_cart')) || [];

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Amazon Clone Loaded');

    await fetchProducts();
    updateCartCount();
    setupSearch();
    setupCategoryFilters();

    // Check if we are on the product detail page
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId && document.getElementById('product-detail-container')) {
        renderProductDetail(parseInt(productId));
    }

    // Check if we are on the checkout page
    if (document.getElementById('shipping-form')) {
        renderCheckout();
    }
});

async function fetchProducts() {
    try {
        const response = await fetch('api/products.php');
        if (!response.ok) throw new Error('Network error');
        products = await response.json();

        // Only render grid if on homepage
        if (document.getElementById('product-grid')) {
            renderProducts(products);
        } else if (document.getElementById('best-sellers')) {
            // Render slider on detail page
            renderProducts(products);
        }
    } catch (error) {
        console.error("Failed to load products from API, falling back to JSON:", error);
        // Fallback for local testing without PHP
        try {
            const fbResponse = await fetch('assets/data/products.json');
            products = await fbResponse.json();
            if (document.getElementById('product-grid')) renderProducts(products);
            else if (document.getElementById('best-sellers')) renderProducts(products);
        } catch (e) {
            console.error(e);
        }
    }
}

function renderProducts(productList) {
    const slider = document.getElementById('best-sellers');
    if (!slider) return;

    slider.innerHTML = '';

    if (productList.length === 0) {
        slider.innerHTML = '<p style="padding: 20px;">No products found.</p>';
        return;
    }

    productList.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        // Add click listener to navigate to detail view
        card.onclick = (e) => {
            // Prevent navigation if they clicked the Add to Cart button directly
            if (e.target.className !== 'add-to-cart-btn') {
                window.location.href = `product.html?id=${product.id}`;
            }
        };

        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div class="product-title">${product.title}</div>
            <div class="product-rating">
                ${getStars(product.rating)}
                <span class="product-count">${product.reviewCount || 0}</span>
            </div>
            <div class="product-price">₹${product.price.toLocaleString()}</div>
            ${product.prime ? '<div class="prime-badge">✓prime</div>' : ''}
            <button class="add-to-cart-btn" onclick="addToCart(${product.id}, event)">Add to Cart</button>
        `;
        slider.appendChild(card);
    });
}

function renderProductDetail(id) {
    const container = document.getElementById('product-detail-container');
    const product = products.find(p => p.id === id);

    if (!product) {
        container.innerHTML = '<h1>Product not found.</h1>';
        container.style.display = 'flex';
        return;
    }

    container.innerHTML = `
        <div class="detail-image-box">
            <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="detail-info-box">
            <h1>${product.title}</h1>
            <div class="detail-rating">
                ${getStars(product.rating)}
                <span style="color: var(--amazon-link-blue); margin-left: 10px;">${product.reviewCount || 0} ratings</span>
            </div>
            <div class="detail-price-box">
                <span style="color: #565959; font-size: 0.9rem;">Price:</span>
                <span class="price">₹${product.price.toLocaleString()}</span>
            </div>
            ${product.prime ? '<div class="prime-badge" style="font-size: 1rem;">✓prime</div>' : ''}
            <div class="detail-description">
                <p><b>About this item:</b></p>
                <p>${product.description || 'No description available for this product.'}</p>
                <p style="margin-top: 10px;"><b>Category:</b> ${product.category || 'General'}</p>
            </div>
        </div>
        <div class="detail-action-box">
            <div class="price">₹${product.price.toLocaleString()}</div>
            <span style="color: #007600; font-weight: 500;">In stock</span>
            <p style="font-size: 0.9rem; margin-top: 10px;">Ships from Amazon</p>
            <p style="font-size: 0.9rem;">Sold by Amazon Retail</p>
            
            <button class="action-btn btn-add" style="margin-top: 20px;" onclick="addToCart(${product.id}, event)">Add to Cart</button>
            <button class="action-btn btn-buy" onclick="buyNow(${product.id})">Buy Now</button>
        </div>
    `;
    container.style.display = 'flex';
}

function getStars(rating) {
    let stars = '';
    const r = rating || 0;
    for (let i = 0; i < 5; i++) {
        if (i < Math.floor(r)) {
            stars += '<i class="fa-solid fa-star" style="color: var(--amazon-orange)"></i>';
        } else if (i === Math.floor(r) && r % 1 !== 0) {
            stars += '<i class="fa-solid fa-star-half-stroke" style="color: var(--amazon-orange)"></i>';
        } else {
            stars += '<i class="fa-regular fa-star" style="color: var(--amazon-orange)"></i>';
        }
    }
    return stars;
}

window.addToCart = function (productId, event) {
    if (event) event.stopPropagation(); // Prevent clicking full card
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        localStorage.setItem('amazon_cart', JSON.stringify(cart));
        updateCartCount();
        alert(`${product.title} added to cart!`);
    }
};

window.buyNow = function (productId) {
    // Add to cart and immediately go to checkout (placeholder)
    addToCart(productId);
    window.location.href = 'checkout.html';
}

function updateCartCount() {
    const countElement = document.querySelector('.cart-count');
    if (countElement) {
        countElement.textContent = cart.length;
    }
}

function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchIcon = document.querySelector('.search-icon-box');

    if (!searchInput || !searchIcon) return;

    const handleSearch = () => {
        const query = searchInput.value.toLowerCase();

        // If on detail page, go back to home page with search query
        if (window.location.pathname.includes('product.html') || window.location.pathname.includes('checkout.html')) {
            window.location.href = `index.html?search=${encodeURIComponent(query)}`;
            return;
        }

        const filtered = products.filter(p => p.title.toLowerCase().includes(query));
        renderProducts(filtered);

        const sliderContainer = document.querySelector('.product-slider-container');
        if (sliderContainer) {
            sliderContainer.scrollIntoView({ behavior: 'smooth' });
            sliderContainer.querySelector('h2').textContent = query ? `Search Results for "${query}"` : 'Best Sellers in Computers & Accessories';
        }
    };

    searchIcon.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Auto search on load if URL param exists
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery && document.getElementById('product-grid')) { // Only on homepage
        searchInput.value = searchQuery;
        // Wait briefly for products to fetch
        setTimeout(() => handleSearch(), 500);
    }
}

function setupCategoryFilters() {
    const categoryLinks = document.querySelectorAll('.bottom-left a');

    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const categoryName = e.target.textContent.trim();

            // Skip non-category links
            if (['Amazon miniTV', 'Sell', 'Customer Service', 'Prime'].includes(categoryName)) {
                return;
            }

            e.preventDefault();

            // If not on homepage, redirect with category param
            if (!document.getElementById('product-grid')) {
                window.location.href = `index.html?category=${encodeURIComponent(categoryName)}`;
                return;
            }

            filterByCategory(categoryName);
        });
    });

    // Check URL for category filter on load
    const urlParams = new URLSearchParams(window.location.search);
    const categoryQuery = urlParams.get('category');
    if (categoryQuery && document.getElementById('product-grid')) {
        setTimeout(() => filterByCategory(categoryQuery), 500);
    }
}

function filterByCategory(categoryName) {
    if (categoryName === 'Best Sellers' || categoryName === 'Today\'s Deals') {
        renderProducts(products); // Show all for now
    } else {
        const filtered = products.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());
        renderProducts(filtered);
    }

    const sliderContainer = document.querySelector('.product-slider-container');
    if (sliderContainer) {
        sliderContainer.scrollIntoView({ behavior: 'smooth' });
        sliderContainer.querySelector('h2').textContent = `Category: ${categoryName}`;
    }
}

function renderCheckout() {
    const listContainer = document.getElementById('checkout-items-list');
    const itemsPriceEl = document.getElementById('summary-items-price');
    const totalPriceEl = document.getElementById('summary-total-price');

    if (!listContainer) return;

    if (cart.length === 0) {
        listContainer.innerHTML = '<p>Your Amazon Cart is empty.</p>';
        itemsPriceEl.textContent = '₹0';
        totalPriceEl.textContent = '₹0';
        return;
    }

    let total = 0;
    listContainer.innerHTML = '';

    cart.forEach((item, index) => {
        total += item.price;
        const div = document.createElement('div');
        div.style.cssText = 'display: flex; gap: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px;';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}" style="width: 80px; height: 80px; object-fit: contain;">
            <div style="flex: 1;">
                <h4 style="font-size: 0.95rem; margin-bottom: 5px;">${item.title}</h4>
                <div style="color: #B12704; font-weight: bold;">₹${item.price.toLocaleString()}</div>
                <button onclick="removeFromCart(${index})" style="background: none; border: none; color: var(--amazon-link-blue); cursor: pointer; padding: 0; margin-top: 5px; font-size: 0.85rem;">Delete</button>
            </div>
        `;
        listContainer.appendChild(div);
    });

    const delivery = 40;
    itemsPriceEl.textContent = `₹${total.toLocaleString()}`;
    totalPriceEl.textContent = `₹${(total + delivery).toLocaleString()}`;
}

window.removeFromCart = function (index) {
    cart.splice(index, 1);
    localStorage.setItem('amazon_cart', JSON.stringify(cart));
    updateCartCount();
    renderCheckout();
}

window.placeOrder = function () {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const form = document.getElementById('shipping-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Simulate API call and success
    alert("Order Placed Successfully! Thank you for shopping with us.");
    cart = [];
    localStorage.setItem('amazon_cart', JSON.stringify(cart));
    window.location.href = 'index.html';
}
