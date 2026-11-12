const products = [
  { id: 1, name: "Sweet oranges", category: "Produce", price: 1.8, unit: "per kg", emoji: "🍊", color: "#f5d6a4", badge: "Fresh pick" },
  { id: 2, name: "Red apples", category: "Produce", price: 2.4, unit: "per kg", emoji: "🍎", color: "#efd4c7", badge: "" },
  { id: 3, name: "Creamy avocado", category: "Produce", price: 1.2, unit: "each", emoji: "🥑", color: "#dce4c9", badge: "" },
  { id: 4, name: "Farm fresh eggs", category: "Pantry", price: 3.5, unit: "per dozen", emoji: "🥚", color: "#f0e2c7", badge: "Everyday" },
  { id: 5, name: "Long grain rice", category: "Pantry", price: 4.8, unit: "per 5 kg", emoji: "🍚", color: "#deded0", badge: "" },
  { id: 6, name: "Fresh milk", category: "Drinks", price: 1.6, unit: "per liter", emoji: "🥛", color: "#dbe6eb", badge: "" },
  { id: 7, name: "Bottled water", category: "Drinks", price: 0.6, unit: "per bottle", emoji: "💧", color: "#d6e7ed", badge: "" },
  { id: 8, name: "Soft bread", category: "Pantry", price: 1.3, unit: "per loaf", emoji: "🥖", color: "#f1dfbf", badge: "Fresh today" },
  { id: 9, name: "Dish soap", category: "Home", price: 2.1, unit: "per bottle", emoji: "🧴", color: "#d8e6d9", badge: "" },
  { id: 10, name: "Tomatoes", category: "Produce", price: 1.5, unit: "per kg", emoji: "🍅", color: "#f0d2c4", badge: "" },
  { id: 11, name: "Cooking oil", category: "Pantry", price: 3.2, unit: "per liter", emoji: "🫒", color: "#ece4bb", badge: "" },
  { id: 12, name: "Laundry care", category: "Home", price: 4.2, unit: "per pack", emoji: "🧺", color: "#e5dce8", badge: "" }
];

const productGrid = document.querySelector("#product-grid");
const searchInput = document.querySelector("#product-search");
const emptyState = document.querySelector("#empty-state");
const cartDrawer = document.querySelector("#cart-drawer");
const cartBackdrop = document.querySelector("#cart-backdrop");
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartCount = document.querySelector(".cart-count");
const cartTotal = document.querySelector("#cart-total");
const cart = new Map();
let activeFilter = "All";

const money = (amount) => `$${amount.toFixed(2)}`;

function renderProducts() {
  const search = searchInput.value.trim().toLowerCase();
  const visibleProducts = products.filter((product) => {
    const matchesCategory = activeFilter === "All" || product.category === activeFilter;
    const matchesSearch = `${product.name} ${product.category}`.toLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card">
      <div class="product-visual" style="background-color:${product.color}">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        <span class="product-emoji" role="img" aria-label="${product.name}">${product.emoji}</span>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category} · ${product.unit}</span>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-bottom"><span class="product-price">${money(product.price)}</span>
          <button class="add-button" type="button" data-add="${product.id}" aria-label="Add ${product.name} to cart">+</button>
        </div>
      </div>
    </article>
  `).join("");
  emptyState.hidden = visibleProducts.length > 0;
}

function renderCart() {
  let itemCount = 0;
  let subtotal = 0;
  const rows = [];
  for (const [id, quantity] of cart) {
    const product = products.find((entry) => entry.id === id);
    itemCount += quantity;
    subtotal += product.price * quantity;
    rows.push(`
      <div class="cart-row">
        <span class="cart-row-emoji" aria-hidden="true">${product.emoji}</span>
        <div><div class="cart-row-name">${product.name}</div><div class="cart-row-price">${money(product.price)} · ${product.unit}</div></div>
        <div class="quantity-controls">
          <button type="button" data-change="${id}" data-delta="-1" aria-label="Remove one ${product.name}">−</button>
          <span>${quantity}</span>
          <button type="button" data-change="${id}" data-delta="1" aria-label="Add one ${product.name}">+</button>
        </div>
      </div>
    `);
  }
  cartItems.innerHTML = rows.join("");
  cartEmpty.hidden = itemCount > 0;
  cartItems.hidden = itemCount === 0;
  cartCount.textContent = itemCount;
  cartTotal.textContent = money(subtotal);
}

function setCartOpen(isOpen) {
  cartDrawer.classList.toggle("open", isOpen);
  cartDrawer.setAttribute("aria-hidden", String(!isOpen));
  cartBackdrop.hidden = !isOpen;
  document.body.classList.toggle("cart-open", isOpen);
  if (isOpen) document.querySelector(".cart-close").focus();
}

document.querySelector(".filter-row").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter-button").forEach((filter) => {
    const isActive = filter === button;
    filter.classList.toggle("active", isActive);
    filter.setAttribute("aria-pressed", String(isActive));
  });
  renderProducts();
});

document.querySelector(".category-grid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeFilter = button.dataset.category;
  document.querySelectorAll(".filter-button").forEach((filter) => {
    const isActive = filter.dataset.filter === activeFilter;
    filter.classList.toggle("active", isActive);
    filter.setAttribute("aria-pressed", String(isActive));
  });
  renderProducts();
  document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
});

searchInput.addEventListener("input", renderProducts);
productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const id = Number(button.dataset.add);
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  button.textContent = "✓";
  window.setTimeout(() => { if (button.isConnected) button.textContent = "+"; }, 700);
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-change]");
  if (!button) return;
  const id = Number(button.dataset.change);
  const quantity = (cart.get(id) || 0) + Number(button.dataset.delta);
  if (quantity <= 0) cart.delete(id);
  else cart.set(id, quantity);
  renderCart();
});

document.querySelector(".cart-button").addEventListener("click", () => setCartOpen(true));
document.querySelector(".cart-close").addEventListener("click", () => setCartOpen(false));
cartBackdrop.addEventListener("click", () => setCartOpen(false));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer.classList.contains("open")) setCartOpen(false);
});

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  mainNav.classList.toggle("open", isOpen);
});
mainNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
document.querySelectorAll(".filter-button").forEach((button) => {
  button.setAttribute("aria-pressed", String(button.dataset.filter === "All"));
});
renderProducts();
renderCart();
