// Initialize cart from localStorage or create an empty one
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Clean price string (e.g., "$900" -> 900)
function parsePrice(price) {
    return parseFloat(price.replace('$', ''));
}

// Apply discount if available
function getProductPrice(product, discounts) {
    const discountItem = discounts.find(d => d.id === product.id);
    return discountItem ? parsePrice(discountItem.price) : parsePrice(product.price);
}

// Toggle favorite icon (only for product/discount sections)
function toggleFavorite(icon) {
    const isFavorited = icon.classList.contains('favorite');
    if (isFavorited) {
        icon.src = './asserts/Favorite_duotone.svg';
        icon.classList.remove('favorite');
    } else {
        icon.src = './asserts/redfav.png';
        icon.classList.add('favorite');
    }
}

// Fetch and display products for new arrivals
function displayProducts(products, discounts) {
    const container = document.querySelector('.centered.ravi');
    if (!container) return;

    container.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        const formattedName = product.name.replace(/(Graphite)/, '<br>$1');
        const finalPrice = getProductPrice(product, discounts);

        productDiv.innerHTML = `
            <img class="favorite-icon" src="./asserts/Favorite_duotone.svg" alt="Favorite">
            <img src="${product.image}" alt="${product.name}">
            <p id="desc">${formattedName}</p>
            <p id="price">$${finalPrice.toFixed(2)}</p>
            <button class="buy-now" data-id="${product.id}">Buy Now</button>
        `;

        container.appendChild(productDiv);
    });

    // Event listeners for "Buy Now" buttons
    document.querySelectorAll('.buy-now').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.dataset.id);
            addToCart(productId, products, discounts);
        });
    });

    // Favorite icon toggling for products
    document.querySelectorAll('.centered.ravi .favorite-icon').forEach(icon => {
        icon.addEventListener('click', () => toggleFavorite(icon));
    });
}

// Fetch and display discounted products
function displayDiscounts(products, discounts) {
    const container = document.getElementById('product-container');
    if (!container) return;

    container.innerHTML = '';

    discounts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        productDiv.innerHTML = `
            <img class="favorite-icon" src="./asserts/Favorite_duotone.svg" alt="Favorite">
            <img src="${product.image}" alt="${product.name}">
            <p id="desc">${product.name}</p>
            <p id="price">${product.price}</p>
            <button class="buy-now" data-id="${product.id}">Buy Now</button>
        `;

        container.appendChild(productDiv);
    });

    // Event listeners for "Buy Now" buttons
    document.querySelectorAll('#product-container .buy-now').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.dataset.id);
            addToCart(productId, products, discounts);
        });
    });

    // Favorite icon toggling for discounts
    document.querySelectorAll('#product-container .favorite-icon').forEach(icon => {
        icon.addEventListener('click', () => toggleFavorite(icon));
    });
}

// Add product to cart
function addToCart(productId, products, discounts) {
    const product = products.find(p => p.id === productId) || discounts.find(d => d.id === productId);
    if (!product) return;

    const cart = getCart();
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    alert(`${product.name} added to cart!`);
}

// Display cart on cart.html
function displayCart(products, discounts) {
    const cartItemsDiv = document.querySelector('.shopping-cart');
    const cart = getCart();

    if (!cartItemsDiv) return;

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<h2>Shopping Cart</h2><img src="./asserts/empty.webp" alt="Empty Cart" style="max-width: 100%; height: auto;">';
        updateCartTotal(cart, discounts);
        return;
    }

    cartItemsDiv.innerHTML = '<h2>Shopping Cart</h2>';
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');
        itemDiv.dataset.id = item.id;

        const finalPrice = getProductPrice(item, discounts);
        const totalItemPrice = finalPrice * item.quantity;

        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="product-image">
            <div class="details">
                <div class="item-details">
                    <p class="title">${item.name}</p>
                    <p class="id">#${item.id.toString().padStart(14, '0')}</p>
                </div>
                <div class="quantity">
                    <button class="button decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="button increase">+</button>
                    <p class="price">$${totalItemPrice.toFixed(2)}</p>
                    <img src="./asserts/Close.svg" alt="X" class="X-icon remove">
                </div>
            </div>
        `;

        cartItemsDiv.appendChild(itemDiv);
    });

    // Event listeners for quantity controls and remove
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', () => updateQuantity(button, 1, discounts));
    });
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', () => updateQuantity(button, -1, discounts));
    });
    document.querySelectorAll('.remove').forEach(button => {
        button.addEventListener('click', () => removeFromCart(button, discounts));
    });

    updateCartTotal(cart, discounts);
}

// Update quantity dynamically
function updateQuantity(button, change, discounts) {
    const itemDiv = button.closest('.item');
    const productId = parseInt(itemDiv.dataset.id);
    const cart = getCart();
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += change;
        if (cartItem.quantity <= 0) {
            removeFromCart(button, discounts);
            return;
        }
        saveCart(cart);
        itemDiv.querySelector('.quantity span').textContent = cartItem.quantity;
        const finalPrice = getProductPrice(cartItem, discounts);
        itemDiv.querySelector('.quantity p.price').textContent = `$${(finalPrice * cartItem.quantity).toFixed(2)}`;
        updateCartTotal(cart, discounts);
    }
}

// Remove item from cart
function removeFromCart(button, discounts) {
    const itemDiv = button.closest('.item');
    const productId = parseInt(itemDiv.dataset.id);
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    itemDiv.remove();
    const updatedCart = getCart();
    if (updatedCart.length === 0) {
        document.querySelector('.shopping-cart').innerHTML = '<h2>Shopping Cart</h2><img src="./asserts/empty.webp" alt="Empty Cart" style="max-width: 100%; height: auto;">';
    }
    updateCartTotal(updatedCart, discounts);
}

// Update cart total
function updateCartTotal(cart, discounts) {
    const subtotalElement = document.querySelector('.subtotal p:last-child');
    const taxElement = document.querySelector('.tax p:last-child');
    const shippingElement = document.querySelector('.shipping p:last-child');
    const totalElement = document.querySelector('.total p:last-child');

    if (!subtotalElement || !totalElement) return;

    const subtotal = cart.reduce((sum, item) => sum + getProductPrice(item, discounts) * item.quantity, 0);
    const tax = cart.length > 0 ? 50 : 0;
    const shipping = cart.length > 0 ? 29 : 0;
    const total = subtotal + tax + shipping;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    shippingElement.textContent = `$${shipping.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Burger menu toggle
function toggleMenu() {
    const nav = document.querySelector('.nav ul');
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
}

// Initialize based on current page (no header icon setup needed)
document.addEventListener('DOMContentLoaded', () => {
    // Fetch both JSON files once and share data across functions
    Promise.all([
        fetch('./items/products.json').then(res => res.json()),
        fetch('./items/discounts.json').then(res => res.json())
    ])
    .then(([products, discounts]) => {
        if (document.querySelector('.centered.ravi')) {
            displayProducts(products, discounts);
        }
        if (document.getElementById('product-container')) {
            displayDiscounts(products, discounts);
        }
        if (document.querySelector('.shopping-cart')) {
            displayCart(products, discounts);
        }
        // Removed setupHeaderIcons since the header favorite icon should not toggle
    })
    .catch(error => console.error('Error loading JSON files:', error));
});