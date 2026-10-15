

const products = window.noireProducts;

window.noireProducts = products;
const productGrid = document.getElementById("productGrid");
const filterBar = document.getElementById("filterBar");
const cartCount = document.getElementById("cartCount");
const cartButton = document.getElementById("cartButton");
const toast = document.getElementById("toast");
const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");
const cartPanel = document.createElement("aside");
cartPanel.id = "cartPanel";
cartPanel.className = "cart-panel";
cartPanel.setAttribute("aria-label", "Shopping bag");
cartPanel.setAttribute("aria-hidden", "true");


cartPanel.innerHTML = `
    <div class="cart-header">
        <div>
            <p class="eyebrow">YOUR SELECTION</p>
            <h2>Your Shopping Bag</h2>
        </div>
        <button type="button" id="closeCart" aria-label="Close shopping bag">×</button>
    </div>

    <div id="cartItems"></div>

    <div class="cart-footer">
        <div class="cart-total">
            <span>Total</span>
            <strong id="cartTotal">₦0</strong>
        </div>
        <button type="button" id="checkoutButton">PROCEED TO CHECKOUT →</button>
        <button type="button" id="continueShopping">CONTINUE SHOPPING</button>
    </div>
`;


document.body.appendChild(cartPanel);


let activeFilter = "all";
const cart = [];

const money = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
});

function renderProducts() {
    const visibleProducts = products.filter(product =>
        activeFilter === "all" || product.category === activeFilter
    );

    


const categoryOrder = {
    sneakers: 1,
    heels: 1,
    oxford: 1,
    watches: 2,
    clothing: 3,
    handbags: 4
};

const orderedProducts = [...visibleProducts].sort((a, b) => {
    const categoryDifference =
        (categoryOrder[a.category] ?? 999) -
        (categoryOrder[b.category] ?? 999);

    if (categoryDifference !== 0) {
        return categoryDifference;
    }

    // Clothing: suits first, then 3D hoodies, then JPG hoodies
    if (a.category === "clothing" && b.category === "clothing") {
        const clothingOrder = product => {
            if (product.model?.startsWith("suit-")) return 1;
            if (product.model?.startsWith("hoodie-")) return 2;
            return 3;
        };

        return clothingOrder(a) - clothingOrder(b) || a.id - b.id;
    }

    // Handbags: 3D models before JPG images
    if (a.category === "handbags" && b.category === "handbags") {
        const aIs3D = a.model?.endsWith(".glb") ? 0 : 1;
        const bIs3D = b.model?.endsWith(".glb") ? 0 : 1;

        return aIs3D - bIs3D || a.id - b.id;
    }

// Watches: show 3D models before JPG-only products
if (a.category === "watches" && b.category === "watches") {
    const aIs3D = a.model?.endsWith(".glb") ? 0 : 1;
    const bIs3D = b.model?.endsWith(".glb") ? 0 : 1;

    return aIs3D - bIs3D || a.id - b.id;
}

return a.id - b.id;
});


productGrid.innerHTML = orderedProducts.map(product => `
    <article
        class="product-card"
        ${product.model ? `data-model="${product.model}"` : ""}
    >
        <div class="product-image">
            <a
                href="product.html?id=${product.id}"
                class="product-detail-link"
                aria-label="View ${product.name} details"
            >
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >
            </a>

            <span class="product-tag">${product.tag}</span>

            <button
                class="add-button"
                data-add="${product.id}"
                aria-label="Add ${product.name} to bag"
                     >+</button>
        </div>

        <div class="product-details">
            <span class="product-category">${product.category}</span>
            <h3>
                <a href="product.html?id=${product.id}" class="product-detail-link">
                    ${product.name}
                </a>
            </h3>
            <p class="product-price">${money.format(product.price)}</p>
        </div>
    </article>
`).join("");


    productGrid.querySelectorAll(".product-card").forEach((card, index) => {
        card.style.animationDelay = `${index * 70}ms`;
    });
}

function renderCart() {
    const cartItems = document.getElementById("cartItems");

    const totalQuantity = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity, 0
    );

    cartCount.textContent = totalQuantity;
    window.dispatchEvent(new Event("noire-cart-updated"));
    document.getElementById("cartTotal").textContent =
        money.format(totalPrice);

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="cart-empty">Your bag is empty. Discover something you love.</p>';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <h3>${item.product.name}</h3>
                <p>${money.format(item.product.price)}</p>
                <div class="cart-item-actions">
                    <button data-cart-action="decrease" data-id="${item.product.id}" aria-label="Decrease quantity">−</button>
                    <span>${item.quantity}</span>
                    <button data-cart-action="increase" data-id="${item.product.id}" aria-label="Increase quantity">+</button>
                    <button class="remove-item" data-cart-action="remove" data-id="${item.product.id}">Remove</button>
                </div>
            </div>
            <strong>${money.format(item.product.price * item.quantity)}</strong>
        </div>
    `).join("");
}

cartPanel.addEventListener("click", event => {
    const button = event.target.closest("[data-cart-action]");
    if (!button) return;

    const id = Number(button.dataset.id);
    const item = cart.find(entry => entry.product.id === id);
    if (!item) return;

    switch (button.dataset.cartAction) {
        case "increase":
            item.quantity++;
            break;
        case "decrease":
            item.quantity--;
            if (item.quantity <= 0) {
                cart.splice(cart.indexOf(item), 1);
            }
            break;
        case "remove":
            cart.splice(cart.indexOf(item), 1);
            break;
    }

    renderCart();
});
window.noireCart = cart;
window.renderNoireCart = renderCart;
renderCart();


function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
        toast.classList.remove("show");
    }, 2400);
}

filterBar.addEventListener("click", event => {
    const button = event.target.closest("[data-filter]");

    if (!button) return;

    activeFilter = button.dataset.filter;

    filterBar.querySelectorAll(".filter-button").forEach(filterButton => {
        filterButton.classList.toggle("active", filterButton === button);
    });

    renderProducts();
});


productGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");
    if (!button) return;

    const product = products.find(
        item => item.id === Number(button.dataset.add)
    );
    if (!product) return;

    const existingItem = cart.find(
        item => item.product.id === product.id
    );

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ product, quantity: 1 });
    }

    renderCart();
    showToast(`${product.name} added to your bag.`);
});



cartButton.addEventListener("click", () => {
    cartPanel.classList.add("open");
    cartPanel.setAttribute("aria-hidden", "false");
});

document.getElementById("closeCart").addEventListener("click", () => {
    cartPanel.classList.remove("open");
    cartPanel.setAttribute("aria-hidden", "true");
});

document.getElementById("continueShopping").addEventListener("click", () => {
    cartPanel.classList.remove("open");
    cartPanel.setAttribute("aria-hidden", "true");
});


const checkoutButton = document.getElementById("checkoutButton");

checkoutButton.addEventListener("click", () => {
    if (cart.length === 0) {
        showToast("Your bag is empty.");
        return;
    }

    let checkoutOverlay = document.getElementById("checkoutOverlay");

    if (!checkoutOverlay) {
        checkoutOverlay = document.createElement("div");
        checkoutOverlay.id = "checkoutOverlay";
        checkoutOverlay.className = "checkout-overlay";

        checkoutOverlay.innerHTML = `
            <div class="checkout-dialog" role="dialog" aria-modal="true" aria-labelledby="checkoutTitle">
                <div class="checkout-header">
                    <div>
                        <p class="eyebrow">NOIRÉ PRIVATE CLIENT</p>
                        <h2 id="checkoutTitle">Complete Your Order</h2>
                    </div>
                    <button type="button" id="closeCheckout" aria-label="Close checkout">×</button>
                </div>

                <h3 class="checkout-section-title">ORDER SUMMARY</h3>
                <div id="checkoutSummary"></div>

                <form id="checkoutForm">
                    <label>
                        Full name
                        <input type="text" name="customerName" required placeholder="Enter your full name">
                    </label>

                    <label>
                        Phone number
                        <input type="tel" name="phone" required placeholder="Enter your phone number">
                    </label>

                    <label>
                        Delivery address
                        <textarea name="address" required rows="3" placeholder="Enter your delivery address"></textarea>
                    </label>

                    <button type="submit" id="confirmDemoOrder">CONFIRM ORDER →</button>
                    <p class="checkout-note">Demo checkout only. No payment will be collected, and your details will not be sent anywhere.</p>
                </form>
            </div>
        `;

        document.body.appendChild(checkoutOverlay);

        checkoutOverlay.querySelector("#closeCheckout").addEventListener("click", () => {
            checkoutOverlay.classList.remove("open");
        });

        checkoutOverlay.addEventListener("click", event => {
            if (event.target === checkoutOverlay) {
                checkoutOverlay.classList.remove("open");
            }
        });

        checkoutOverlay.querySelector("#checkoutForm").addEventListener("submit", event => {
            event.preventDefault();

            checkoutOverlay.classList.remove("open");
            showToast("Demo order complete. No payment was made.");
        });
    }

    const checkoutSummary = checkoutOverlay.querySelector("#checkoutSummary");

    checkoutSummary.innerHTML = cart.map(item => `
        <div class="checkout-summary-item">
            <div>
                <strong>${item.product.name}</strong>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <strong>${money.format(item.product.price * item.quantity)}</strong>
        </div>
    `).join("");

    const total = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    checkoutSummary.innerHTML += `
        <div class="checkout-summary-total">
            <span>Total</span>
            <strong>${money.format(total)}</strong>
        </div>
    `;

    checkoutOverlay.classList.add("open");
});



menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
    });
});

document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
        activeFilter = card.dataset.category;

        filterBar.querySelectorAll(".filter-button").forEach(button => {
            button.classList.toggle("active", button.dataset.filter === activeFilter);
        });

        renderProducts();
    });
});

renderProducts();
// NOIRÉ 3D FOOTWEAR SELECTOR
const fashionModel = document.getElementById("fashion-model");
const modelSelect = document.getElementById("model-select");
const modelTitle = document.getElementById("model-title");
const modelDescription = document.getElementById("model-description");
const exploreModel = document.getElementById("explore-model");

if (fashionModel && modelSelect) {
  modelSelect.addEventListener("change", () => {
    const option = modelSelect.options[modelSelect.selectedIndex];

    fashionModel.src = `assets/models/${option.value}`;
    modelTitle.textContent = option.dataset.title;
    modelDescription.textContent = option.dataset.description;
  });

  exploreModel?.addEventListener("click", () => {
    document.getElementById("showcase-3d").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    fashionModel.cameraOrbit = "0deg 75deg auto";
    fashionModel.jumpCameraToGoal();
  });
}// CONNECT FOOTWEAR PRODUCTS TO THE 3D SHOWCASE
productGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".product-card");

  if (!card || !card.dataset.model) return;

  const modelSelect = document.getElementById("model-select");
  const showcase = document.getElementById("showcase-3d");

  if (!modelSelect || !showcase) return;

  modelSelect.value = card.dataset.model;
  modelSelect.dispatchEvent(new Event("change"));

  showcase.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

/* NOIRÉ light/dark mode toggle */
(function () {
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);

        if (themeIcon) {
            themeIcon.textContent = theme === "dark" ? "☀" : "☾";
        }

        if (themeToggle) {
            themeToggle.setAttribute(
                "aria-label",
                theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );
        }
    }

    const savedTheme = localStorage.getItem("noire-theme") || "dark";
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            const currentTheme =
                document.documentElement.getAttribute("data-theme") || "dark";

            const newTheme = currentTheme === "dark" ? "light" : "dark";

            localStorage.setItem("noire-theme", newTheme);
            applyTheme(newTheme);
        });
    }
})();
