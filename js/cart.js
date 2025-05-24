// Utility to safely get cart from localStorage
function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart"));
    return cart && typeof cart === "object" ? cart : {};
  } catch {
    return {};
  }
}

// Save cart object back to localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Format price as $xx.xx
function formatPrice(value) {
  return `$${parseFloat(value).toFixed(2)}`;
}

// Update cart item count in header
function updateCartCount() {
  const cart = getCart();
  const totalQty = Object.values(cart).reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  $(".cart-count")
    .text(totalQty)
    .toggle(totalQty > 0);
}

// Render cart table and totals
function renderCart() {
  const cart = getCart();
  const items = Object.values(cart);
  const $tbody = $(".cart-table tbody");
  const $totalDisplay = $(".pr-total-price");
  const $grandTotalDisplay = $(".grand-total h2:last-child");
  const $cartTable = $(".cart-table");
  const $cartTotal = $(".cart-total");
  const $cartButtons = $(".cart-btn-box");
  const $cartTitle = $(".cart-area h2");

  $tbody.empty();
  let total = 0;

  if (items.length === 0) {
    $cartTable.hide();
    $cartTotal.hide();
    $cartButtons.hide();
    $cartTitle.html(
      `<span class=" empty-msg">Your cart is empty. Start your shopping now.<br><br><a href="shop.html" class="btn shop-now-btn">Shop Now</a></span>`
    );
    updateCartCount();
    return;
  } else {
    $cartTable.show();
    $cartTotal.show();
    $cartButtons.show();
    $cartTitle.text("Your cart items");
  }

  items.forEach((item) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const $row = $(
      `<tr>
        <td class="img-cell">
          <a href="product-desc.html?id=${item.id}">
            <img src="${item.img}" alt="${item.name}">
          </a>
        </td>
        <td class="title-cell">
          <a href="product-desc.html?id=${item.id}">
            <span class="pr-name">${item.name}</span> × <span class="pr-qty">${
        item.quantity
      }</span>
          </a>
        </td>
        <td class="text-cell"><span class="pr-price">${formatPrice(
          item.price
        )}</span></td>
        <td class="text-cell text-center">
          <div class="quantity-box">
            <button class="qty-btn minus" data-id="${
              item.id
            }"><span>-</span></button>
            <input type="number" class="qty-input" value="${
              item.quantity
            }" min="1" data-id="${item.id}">
            <button class="qty-btn plus" data-id="${
              item.id
            }"><span>+</span></button>
          </div>
        </td>
        <td class="text-cell"><span class="pr-subtotal-price">${formatPrice(
          subtotal
        )}</span></td>
        <td class="text-center img-cell">
          <a href="#" class="pr-del" data-id="${
            item.id
          }"><img src="images/trash.svg" alt="trash"></a>
        </td>
      </tr>`
    );

    $tbody.append($row);
  });

  $totalDisplay.text(formatPrice(total));
  $grandTotalDisplay.text(formatPrice(total));
  updateCartCount();
}

// Update item quantity
function updateQuantity(id, amount) {
  const cart = getCart();
  if (!cart[id]) return;
  cart[id].quantity = Math.max(1, cart[id].quantity + amount);
  saveCart(cart);
  renderCart();
}

// Change quantity to custom value
function changeQuantity(id, value) {
  const cart = getCart();
  if (!cart[id]) return;
  cart[id].quantity = Math.max(1, value);
  saveCart(cart);
  renderCart();
}

// Remove item from cart
function deleteCartItem(id) {
  const cart = getCart();
  delete cart[id];
  saveCart(cart);
  renderCart();
}

// Clear entire cart
function clearCart() {
  localStorage.removeItem("cart");
  renderCart();
}

$(document).ready(function () {
  renderCart();

  // Quantity +
  $(document).on("click", ".qty-btn.plus", function () {
    const id = $(this).data("id");
    updateQuantity(id, 1);
  });

  // Quantity -
  $(document).on("click", ".qty-btn.minus", function () {
    const id = $(this).data("id");
    updateQuantity(id, -1);
  });

  // Input value change
  $(document).on("change", ".qty-input", function () {
    const id = $(this).data("id");
    const value = Math.max(1, parseInt($(this).val()) || 1);
    changeQuantity(id, value);
  });

  // Remove item
  $(document).on("click", ".pr-del", function (e) {
    e.preventDefault();
    const id = $(this).data("id");
    deleteCartItem(id);
  });

  // Clear cart
  $(document).on("click", ".clear-btn", function (e) {
    e.preventDefault();
    clearCart();
  });
});
