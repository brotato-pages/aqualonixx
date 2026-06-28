let cart = [];

/* CARRITO */
function addToCart(item) {
  cart.push(item);
  updateCart();
}

function updateCart() {
  document.getElementById("cartCount").innerText = cart.length;

  let list = document.getElementById("cartList");
  list.innerHTML = "";

  cart.forEach(i => {
    let li = document.createElement("li");
    li.textContent = i;
    list.appendChild(li);
  });
}

/* CART OPEN/CLOSE */
function openCart() {
  document.getElementById("cart").style.right = "0";
}

function closeCart() {
  document.getElementById("cart").style.right = "-300px";
}

/* LANGUAGE SWITCH */
function setLang(lang) {
  document.querySelectorAll("[data-es]").forEach(el => {
    el.textContent = el.getAttribute("data-" + lang);
  });
}
