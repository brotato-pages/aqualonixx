const products = [
  {
    id: "x1",
    nameES: "Aqualonixx X1",
    nameEN: "Aqualonixx X1",
    descES: "Compacta, liviana y lista para el verano.",
    descEN: "Compact, lightweight, and ready for summer.",
    price: 19.99,
    chipsES: ["USB", "8m", "Auto"],
    chipsEN: ["USB", "8m", "Auto"]
  },
  {
    id: "x2",
    nameES: "Aqualonixx X2",
    nameEN: "Aqualonixx X2",
    descES: "Más potencia, mejor autonomía y tanque extra.",
    descEN: "More power, better battery life, and extra tank.",
    price: 29.99,
    chipsES: ["Pro", "10m", "USB-C"],
    chipsEN: ["Pro", "10m", "USB-C"]
  },
  {
    id: "x3",
    nameES: "Aqualonixx X3",
    nameEN: "Aqualonixx X3",
    descES: "Diseño premium para jugar en grande.",
    descEN: "Premium design for bigger summer battles.",
    price: 39.99,
    chipsES: ["Max", "LED", "Long Range"],
    chipsEN: ["Max", "LED", "Long Range"]
  }
];

let currentLang = "es";
let cart = {};

const productsEl = document.getElementById("products");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");
const cartPanelEl = document.getElementById("cartPanel");
const backdropEl = document.getElementById("backdrop");

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

function getProduct(id) {
  return products.find((p) => p.id === id);
}

function renderProducts() {
  productsEl.innerHTML = products.map((p) => {
    const title = currentLang === "es" ? p.nameES : p.nameEN;
    const desc = currentLang === "es" ? p.descES : p.descEN;
    const chips = currentLang === "es" ? p.chipsES : p.chipsEN;

    return `
      <article class="product-card">
        <div class="product-visual" aria-hidden="true"></div>

        <div class="product-title">
          <h3>${title}</h3>
          <div class="price">${formatMoney(p.price)}</div>
        </div>

        <p class="product-desc">${desc}</p>

        <div class="feature-list">
          ${chips.map((chip) => `<span class="chip">${chip}</span>`).join("")}
        </div>

        <button class="add-btn" onclick="addToCart('${p.id}')" type="button">
          ${currentLang === "es" ? "Agregar al carrito" : "Add to cart"}
        </button>
      </article>
    `;
  }).join("");
}

function updateLangButtons() {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.textContent.toLowerCase() === currentLang);
  });
}

function translateStaticTexts() {
  document.querySelectorAll("[data-es]").forEach((el) => {
    const text = el.getAttribute(`data-${currentLang}`);
    if (text) el.textContent = text;
  });
}

function setLang(lang) {
  currentLang = lang;
  updateLangButtons();
  translateStaticTexts();
  renderProducts();
  renderCart();
}

function bumpCounter() {
  cartCountEl.classList.remove("bump");
  void cartCountEl.offsetWidth;
  cartCountEl.classList.add("bump");
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  bumpCounter();
  openCart();
}

function increaseQty(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  bumpCounter();
}

function decreaseQty(id) {
  if (!cart[id]) return;
  cart[id] -= 1;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
  bumpCounter();
}

function removeItem(id) {
  delete cart[id];
  renderCart();
  bumpCounter();
}

function getCartCount() {
  return Object.values(cart).reduce((acc, qty) => acc + qty, 0);
}

function getCartTotal() {
  return Object.entries(cart).reduce((acc, [id, qty]) => {
    const product = getProduct(id);
    return acc + (product ? product.price * qty : 0);
  }, 0);
}

function renderCart() {
  const count = getCartCount();
  const total = getCartTotal();

  cartCountEl.textContent = count;
  cartTotalEl.textContent = formatMoney(total);

  if (count === 0) {
    cartItemsEl.innerHTML = `
      <p class="empty-cart">
        ${currentLang === "es"
          ? "Tu carrito está vacío. Agregá un producto para ver el total automático."
          : "Your cart is empty. Add a product to see the auto total."}
      </p>
    `;
    return;
  }

  cartItemsEl.innerHTML = Object.entries(cart).map(([id, qty]) => {
    const product = getProduct(id);
    if (!product) return "";

    const title = currentLang === "es" ? product.nameES : product.nameEN;
    const lineTotal = product.price * qty;

    return `
      <div class="cart-item">
        <div class="cart-item-top">
          <div>
            <p class="cart-item-name">${title}</p>
            <div class="cart-item-price">${formatMoney(product.price)}</div>
          </div>
          <button class="remove-btn" onclick="removeItem('${id}')" type="button">
            ${currentLang === "es" ? "Quitar" : "Remove"}
          </button>
        </div>

        <div class="qty-controls">
          <div class="qty-box">
            <button class="qty-btn" onclick="decreaseQty('${id}')" type="button">−</button>
            <span class="qty-value">${qty}</span>
            <button class="qty-btn" onclick="increaseQty('${id}')" type="button">+</button>
          </div>
          <strong>${formatMoney(lineTotal)}</strong>
        </div>
      </div>
    `;
  }).join("");
}

function openCart() {
  cartPanelEl.classList.add("open");
  backdropEl.classList.add("show");
}

function closeCart() {
  cartPanelEl.classList.remove("open");
  backdropEl.classList.remove("show");
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCart();
});

cartPanelEl.addEventListener("click", (e) => {
  e.stopPropagation();
});

document.addEventListener("click", (e) => {
  if (!cartPanelEl.classList.contains("open")) return;
  const clickedInsideCart = cartPanelEl.contains(e.target);
  const clickedCartButton = e.target.closest(".cart-btn");
  if (!clickedInsideCart && !clickedCartButton) closeCart();
});

window.setLang = setLang;
window.addToCart = addToCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.increaseQty = increaseQty;
window.decreaseQty = decreaseQty;
window.removeItem = removeItem;

renderProducts();
renderCart();
updateLangButtons();
translateStaticTexts();
