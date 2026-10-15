
document.addEventListener("DOMContentLoaded", () => {
    const products = window.noireProducts || [];

    const grid = document.getElementById("allProductsGrid");
    const search = document.getElementById("productSearch");
    const category = document.getElementById("categoryFilter");
    const minPrice = document.getElementById("minPrice");
    const maxPrice = document.getElementById("maxPrice");
    const sort = document.getElementById("sortProducts");
    const clearButton = document.getElementById("clearFilters");
    const resultsCount = document.getElementById("resultsCount");

    const formatPrice = price =>
        "₦" + Number(price).toLocaleString("en-NG");

    function renderProducts() {
        const query = search.value.trim().toLowerCase();
        const selectedCategory = category.value;
        const min = minPrice.value === "" ? 0 : Number(minPrice.value);
        const max = maxPrice.value === "" ? Infinity : Number(maxPrice.value);

        let filtered = products.filter(product => {
            const matchesSearch =
                product.name.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query) ||
                (product.tag || "").toLowerCase().includes(query);

            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;

            const matchesMin = Number(product.price) >= min;
            const matchesMax = Number(product.price) <= max;

            return matchesSearch && matchesCategory &&
                   matchesMin && matchesMax;
        });

        if (sort.value === "name-asc") {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort.value === "price-asc") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sort.value === "price-desc") {
            filtered.sort((a, b) => b.price - a.price);
        }

        resultsCount.textContent =
            `${filtered.length} ${filtered.length === 1 ? "piece" : "pieces"} found`;

        if (!filtered.length) {
            grid.innerHTML = `
                <div class="collection-empty">
                    <h3>No pieces found.</h3>
                    <p>Try another search or adjust your filters.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(product => `
            <article class="collection-product-card">
                <div class="collection-product-image">
                    <img
                        src="${product.image}"
                        alt="${product.name.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")}"
                        loading="lazy"
                    >
                    ${product.tag
                        ? `<span class="collection-product-tag">${product.tag}</span>`
                        : ""}
                </div>
                <div class="collection-product-info">
                    <p class="collection-product-category">
                        ${product.category === "oxford"
                            ? "Formal Shoes"
                            : product.category}
                    </p>
                    <h3>${product.name.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</h3>
                    <p class="collection-product-price">
                        ${formatPrice(product.price)}
                    </p>
                </div>
            </article>
        `).join("");
    }

    [search, category, minPrice, maxPrice, sort].forEach(control => {
        control.addEventListener("input", renderProducts);
        control.addEventListener("change", renderProducts);
    });

    clearButton.addEventListener("click", () => {
        search.value = "";
        category.value = "all";
        minPrice.value = "";
        maxPrice.value = "";
        sort.value = "featured";
        renderProducts();
    });

    
    // Use the same saved theme preference as the homepage.
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    function applyTheme(theme) {
        const selectedTheme = theme === "light" ? "light" : "dark";

        document.documentElement.setAttribute("data-theme", selectedTheme);

        if (themeIcon) {
            themeIcon.textContent = selectedTheme === "dark" ? "☀" : "☾";
        }

        if (themeToggle) {
            themeToggle.setAttribute(
                "aria-label",
                selectedTheme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );
        }
    }

    applyTheme(localStorage.getItem("noire-theme") || "dark");

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const currentTheme =
                document.documentElement.getAttribute("data-theme") || "dark";

            const nextTheme = currentTheme === "dark" ? "light" : "dark";

            localStorage.setItem("noire-theme", nextTheme);
            applyTheme(nextTheme);
        });
    }


    // Mobile navigation
    const menuButton = document.getElementById("menuButton");
    const navLinks = document.getElementById("navLinks");

    menuButton.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("active");
        menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    renderProducts();
});
