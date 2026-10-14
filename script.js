
const products = [
    {
        id: 1,
        name: "Midnight Runner",
        category: "sneakers",
        price: 85000,
        tag: "Bestseller",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 2,
        name: "Urban Classic",
        category: "sneakers",
        price: 72000,
        tag: "New",
        image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 3,
        name: "Chronos Gold",
        category: "watches",
        price: 125000,
        tag: "Editor's pick",
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 4,
        name: "Silver Hour",
        category: "watches",
        price: 98000,
        tag: "Essential",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 5,
        name: "The Muse",
        category: "handbags",
        price: 110000,
        tag: "New",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 6,
        name: "Evening Edit",
        category: "handbags",
        price: 145000,
        tag: "Limited edit",
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 7,
        name: "Essential Overshirt",
        category: "clothing",
        price: 45000,
        tag: "Essential",
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 8,
        name: "Everyday Luxe",
        category: "clothing",
        price: 38000,
        tag: "New",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80"
    }
];

const productGrid = document.getElementById("productGrid");
const filterBar = document.getElementById("filterBar");
const cartCount = document.getElementById("cartCount");
const cartButton = document.getElementById("cartButton");
const toast = document.getElementById("toast");
const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

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

    productGrid.innerHTML = visibleProducts.map(product => `
        <article class="product-card">
            <div class="product-image">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >
                <span class="product-tag">${product.tag}</span>
                <button
                    class="add-button"
                    data-add="${product.id}"
                    aria-label="Add ${product.name} to bag"
                >+</button>
            </div>
            <div class="product-details">
                <span class="product-category">${product.category}</span>
                <h3>${product.name}</h3>
                <p class="product-price">${money.format(product.price)}</p>
            </div>
        </article>
    `).join("");

    productGrid.querySelectorAll(".product-card").forEach((card, index) => {
        card.style.animationDelay = `${index * 70}ms`;
    });
}

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

    const product = products.find(item => item.id === Number(button.dataset.add));

    if (!product) return;

    cart.push(product);
    cartCount.textContent = cart.length;
    showToast(`${product.name} added to your bag.`);
});

cartButton.addEventListener("click", () => {
    if (cart.length === 0) {
        showToast("Your bag is empty. Discover something you love.");
        return;
    }

    const total = cart.reduce((sum, product) => sum + product.price, 0);

    showToast(`${cart.length} item(s) in your bag · Total: ${money.format(total)}`);
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
}